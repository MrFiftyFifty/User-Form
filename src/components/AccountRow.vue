<template>
  <div class="account-row">
    <div class="row-content">
      <!-- Label field -->
      <div class="field-wrapper">
        <el-tooltip
          content="Разделяйте метки точкой с запятой (например: метка1; метка2; метка3)"
          placement="top"
        >
          <el-input
            v-model="formData.labelText"
            placeholder="Введите метки через ;"
            :status="errors.label ? 'error' : ''"
            @blur="handleLabelBlur"
            clearable
          />
        </el-tooltip>
        <div v-if="errors.label" class="error-message">{{ errors.label }}</div>
      </div>

      <!-- Record Type field -->
      <div class="field-wrapper">
        <el-select
          v-model="formData.type"
          placeholder="Выберите тип"
          @change="handleTypeChange"
        >
          <el-option label="LDAP" value="LDAP" />
          <el-option label="Локальная" value="Локальная" />
        </el-select>
      </div>

      <!-- Login field -->
      <div class="field-wrapper">
        <el-input
          v-model="formData.login"
          placeholder="Введите логин"
          :status="errors.login ? 'error' : ''"
          @blur="handleLoginBlur"
          clearable
        />
        <div v-if="errors.login" class="error-message">{{ errors.login }}</div>
      </div>

      <!-- Password field -->
      <div class="field-wrapper">
        <el-input
          v-if="showPasswordField"
          v-model="formData.password"
          type="password"
          placeholder="Введите пароль"
          :status="errors.password ? 'error' : ''"
          @blur="handlePasswordBlur"
          show-password
          clearable
        />
        <div v-else class="hidden-field">
          <span class="hidden-text">Скрыто для LDAP</span>
        </div>
        <div v-if="errors.password" class="error-message">{{ errors.password }}</div>
      </div>

      <!-- Delete button -->
      <div class="field-wrapper action-wrapper">
        <el-button
          type="danger"
          :icon="Delete"
          circle
          size="small"
          @click="handleDelete"
          class="delete-button"
        />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { Delete } from '@element-plus/icons-vue'
import { ElMessageBox } from 'element-plus'
import { useAccountStore } from '@/stores/accountStore'
import { useAccountValidation } from '@/composables/useAccountValidation'
import type { AccountFormData } from '@/types/Account'

interface Props {
  accountId: string
}

const props = defineProps<Props>()

const accountStore = useAccountStore()
const { errors, validateField } = useAccountValidation()

const formData = ref<AccountFormData>({
  id: props.accountId,
  labelText: '',
  type: 'LDAP',
  login: '',
  password: ''
})

const showPasswordField = computed(() => {
  return formData.value.type === 'Локальная'
})

// Load existing account data
onMounted(() => {
  const existingData = accountStore.getAccountFormData(props.accountId)
  if (existingData) {
    formData.value = { ...existingData }
  }
})

// Update store when type changes
const handleTypeChange = () => {
  if (formData.value.type === 'LDAP') {
    formData.value.password = ''
  }
  updateAccount()
}

const handleLabelBlur = () => {
  validateField('label', formData.value.labelText)
  updateAccount()
}

const handleLoginBlur = () => {
  validateField('login', formData.value.login)
  updateAccount()
}

const handlePasswordBlur = () => {
  validateField('password', formData.value.password, formData.value.type)
  updateAccount()
}

const updateAccount = () => {
  accountStore.updateAccount(formData.value)
}

const handleDelete = async () => {
  try {
    await ElMessageBox.confirm(
      'Эта учетная запись будет удалена безвозвратно. Продолжить?',
      'Подтверждение удаления',
      {
        confirmButtonText: 'Удалить',
        cancelButtonText: 'Отмена',
        type: 'warning',
        confirmButtonClass: 'el-button--danger',
      }
    )
    accountStore.deleteAccount(props.accountId)
  } catch {
    // User cancelled, do nothing
  }
}
</script>

<style scoped>
.account-row {
  border-bottom: 1px solid #ebeef5;
  transition: background-color 0.3s;
}

.account-row:hover {
  background-color: #f9f9f9;
}

.row-content {
  display: grid;
  grid-template-columns: 1fr 150px 200px 200px 60px;
  gap: 16px;
  padding: 16px;
  align-items: start;
}

.field-wrapper {
  position: relative;
}

.error-message {
  color: #f56c6c;
  font-size: 12px;
  margin-top: 4px;
  line-height: 1.2;
}

.hidden-field {
  height: 32px;
  display: flex;
  align-items: center;
  padding: 0 12px;
  background: #f5f7fa;
  border: 1px solid #dcdfe6;
  border-radius: 4px;
}

.hidden-text {
  color: #909399;
  font-size: 14px;
  font-style: italic;
}

.action-wrapper {
  display: flex;
  justify-content: center;
  align-items: flex-start;
  padding-top: 6px;
}

.delete-button {
  width: 32px;
  height: 32px;
}

.delete-button:hover {
  transform: scale(1.05);
}

@media (max-width: 768px) {
  .row-content {
    grid-template-columns: 1fr;
    gap: 12px;
  }
  
  .action-wrapper {
    justify-content: flex-end;
    padding-top: 0;
  }
}
</style>
