export interface LabelTag {
  text: string
}

export type AccountType = 'LDAP' | 'Локальная'

export interface Account {
  id: string
  label: LabelTag[]
  type: AccountType
  login: string
  password: string | null
}

export interface AccountFormData {
  id: string
  labelText: string // Raw text input (will be converted to LabelTag[])
  type: AccountType
  login: string
  password: string
}

export interface ValidationErrors {
  login?: string
  password?: string
  label?: string
}
