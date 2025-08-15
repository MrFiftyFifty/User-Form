import { reactive } from 'vue'
import type { AccountFormData, ValidationErrors, LabelTag } from '@/types/Account'

export function useAccountValidation() {
  const errors = reactive<ValidationErrors>({})

  const validateField = (field: keyof ValidationErrors, value: string, type?: string): boolean => {
    let isValid = true
    delete errors[field]

    switch (field) {
      case 'login':
        if (!value.trim()) {
          errors.login = 'Логин обязателен для заполнения'
          isValid = false
        } else if (value.length > 100) {
          errors.login = 'Логин не должен превышать 100 символов'
          isValid = false
        }
        break

      case 'password':
        if (type === 'Локальная') {
          if (!value.trim()) {
            errors.password = 'Пароль обязателен для локальной учетной записи'
            isValid = false
          } else if (value.length > 100) {
            errors.password = 'Пароль не должен превышать 100 символов'
            isValid = false
          }
        }
        break

      case 'label':
        if (value.length > 50) {
          errors.label = 'Метка не должна превышать 50 символов'
          isValid = false
        }
        break
    }

    return isValid
  }

  const validateAccount = (account: AccountFormData): boolean => {
    const isLoginValid = validateField('login', account.login)
    const isPasswordValid = validateField('password', account.password, account.type)
    const isLabelValid = validateField('label', account.labelText)

    return isLoginValid && isPasswordValid && isLabelValid
  }

  const parseLabels = (labelText: string): LabelTag[] => {
    if (!labelText.trim()) return []
    
    return labelText
      .split(';')
      .map(text => text.trim())
      .filter(text => text.length > 0)
      .map(text => ({ text }))
  }

  const labelsToText = (labels: LabelTag[]): string => {
    return labels.map(label => label.text).join('; ')
  }

  const clearErrors = () => {
    Object.keys(errors).forEach(key => {
      delete errors[key as keyof ValidationErrors]
    })
  }

  return {
    errors,
    validateField,
    validateAccount,
    parseLabels,
    labelsToText,
    clearErrors
  }
}
