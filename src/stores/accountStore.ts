import { defineStore } from 'pinia'
import { ref } from 'vue'
import type { Account, AccountFormData, LabelTag } from '@/types/Account'

export const useAccountStore = defineStore(
  'accounts',
  () => {
    const accounts = ref<Account[]>([])

    const generateId = (): string => {
      return Date.now().toString() + Math.random().toString(36).substr(2, 9)
    }

    const parseLabels = (labelText: string): LabelTag[] => {
      if (!labelText.trim()) return []
      
      return labelText
        .split(';')
        .map(text => text.trim())
        .filter(text => text.length > 0)
        .map(text => ({ text }))
    }

    const createEmptyAccount = (): Account => {
      return {
        id: generateId(),
        label: [],
        type: 'LDAP',
        login: '',
        password: null
      }
    }

    const addAccount = (): string => {
      const newAccount = createEmptyAccount()
      accounts.value.push(newAccount)
      return newAccount.id
    }

    const deleteAccount = (id: string): void => {
      const index = accounts.value.findIndex(account => account.id === id)
      if (index !== -1) {
        accounts.value.splice(index, 1)
      }
    }

    const updateAccount = (formData: AccountFormData): void => {
      const index = accounts.value.findIndex(account => account.id === formData.id)
      if (index !== -1) {
        const account = accounts.value[index]
        
        account.label = parseLabels(formData.labelText)
        account.type = formData.type
        account.login = formData.login
        
        // Apply password logic based on account type
        if (formData.type === 'LDAP') {
          account.password = null
        } else {
          account.password = formData.password
        }
      }
    }

    const getAccount = (id: string): Account | undefined => {
      return accounts.value.find(account => account.id === id)
    }

    const getAccountFormData = (id: string): AccountFormData | undefined => {
      const account = getAccount(id)
      if (!account) return undefined

      return {
        id: account.id,
        labelText: account.label.map(label => label.text).join('; '),
        type: account.type,
        login: account.login,
        password: account.password || ''
      }
    }

    return {
      accounts,
      addAccount,
      deleteAccount,
      updateAccount,
      getAccount,
      getAccountFormData,
      createEmptyAccount
    }
  },
  {
    persist: true
  }
)
