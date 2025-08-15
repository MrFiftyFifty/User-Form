import { describe, it, expect, beforeEach } from 'vitest'
import { useAccountValidation } from '../useAccountValidation'
import type { AccountFormData } from '@/types/Account'

describe('useAccountValidation', () => {
  let validation: ReturnType<typeof useAccountValidation>

  beforeEach(() => {
    validation = useAccountValidation()
  })

  describe('validateField', () => {
    it('validates login field correctly', () => {
      // Empty login should fail
      expect(validation.validateField('login', '')).toBe(false)
      expect(validation.errors.login).toBe('Логин обязателен для заполнения')

      // Valid login should pass
      validation.clearErrors()
      expect(validation.validateField('login', 'testuser')).toBe(true)
      expect(validation.errors.login).toBeUndefined()

      // Login too long should fail
      validation.clearErrors()
      const longLogin = 'a'.repeat(101)
      expect(validation.validateField('login', longLogin)).toBe(false)
      expect(validation.errors.login).toBe('Логин не должен превышать 100 символов')
    })

    it('validates password field for local accounts', () => {
      // Empty password for local account should fail
      expect(validation.validateField('password', '', 'Локальная')).toBe(false)
      expect(validation.errors.password).toBe('Пароль обязателен для локальной учетной записи')

      // Valid password should pass
      validation.clearErrors()
      expect(validation.validateField('password', 'secret123', 'Локальная')).toBe(true)
      expect(validation.errors.password).toBeUndefined()

      // Password too long should fail
      validation.clearErrors()
      const longPassword = 'a'.repeat(101)
      expect(validation.validateField('password', longPassword, 'Локальная')).toBe(false)
      expect(validation.errors.password).toBe('Пароль не должен превышать 100 символов')
    })

    it('skips password validation for LDAP accounts', () => {
      // Empty password for LDAP should pass
      expect(validation.validateField('password', '', 'LDAP')).toBe(true)
      expect(validation.errors.password).toBeUndefined()
    })

    it('validates label field correctly', () => {
      // Empty label should pass (it's optional)
      expect(validation.validateField('label', '')).toBe(true)
      expect(validation.errors.label).toBeUndefined()

      // Valid label should pass
      expect(validation.validateField('label', 'tag1; tag2')).toBe(true)
      expect(validation.errors.label).toBeUndefined()

      // Label too long should fail
      const longLabel = 'a'.repeat(51)
      expect(validation.validateField('label', longLabel)).toBe(false)
      expect(validation.errors.label).toBe('Метка не должна превышать 50 символов')
    })
  })

  describe('validateAccount', () => {
    it('validates complete account form', () => {
      const validAccount: AccountFormData = {
        id: '1',
        labelText: 'tag1; tag2',
        type: 'Локальная',
        login: 'testuser',
        password: 'secret123'
      }

      expect(validation.validateAccount(validAccount)).toBe(true)
    })

    it('fails validation for invalid account', () => {
      const invalidAccount: AccountFormData = {
        id: '1',
        labelText: '',
        type: 'Локальная',
        login: '', // Missing required login
        password: '' // Missing required password for local account
      }

      expect(validation.validateAccount(invalidAccount)).toBe(false)
      expect(validation.errors.login).toBeDefined()
      expect(validation.errors.password).toBeDefined()
    })
  })

  describe('parseLabels', () => {
    it('parses semicolon-separated labels correctly', () => {
      const result = validation.parseLabels('tag1; tag2; tag3')
      expect(result).toEqual([
        { text: 'tag1' },
        { text: 'tag2' },
        { text: 'tag3' }
      ])
    })

    it('handles empty string', () => {
      const result = validation.parseLabels('')
      expect(result).toEqual([])
    })

    it('trims whitespace and filters empty tags', () => {
      const result = validation.parseLabels('  tag1  ; ; tag2 ;  ')
      expect(result).toEqual([
        { text: 'tag1' },
        { text: 'tag2' }
      ])
    })
  })

  describe('labelsToText', () => {
    it('converts label array to text', () => {
      const labels = [
        { text: 'tag1' },
        { text: 'tag2' },
        { text: 'tag3' }
      ]
      const result = validation.labelsToText(labels)
      expect(result).toBe('tag1; tag2; tag3')
    })

    it('handles empty array', () => {
      const result = validation.labelsToText([])
      expect(result).toBe('')
    })
  })
})
