<template>
  <div class="account-row">
    <div class="row-content">
      <!-- Поле метки -->
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

      <!-- Поле выбора типа записи -->
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

      <!-- Поле логина -->
      <div class="field-wrapper login-wrapper" :class="{ 'span-two': !showPasswordField }">
        <el-input
          v-model="formData.login"
          placeholder="Введите логин"
          :status="errors.login ? 'error' : ''"
          @blur="handleLoginBlur"
          clearable
        />
        <div v-if="errors.login" class="error-message">{{ errors.login }}</div>
      </div>

      <!-- Поле пароля -->
      <div v-if="showPasswordField" class="field-wrapper">
        <el-input
          v-model="formData.password"
          type="password"
          placeholder="Введите пароль"
          :status="errors.password ? 'error' : ''"
          @blur="handlePasswordBlur"
          show-password
          clearable
        />
        <div v-if="errors.password" class="error-message">{{ errors.password }}</div>
      </div>

      <!-- Кнопка удаления -->
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
const { errors, validateField, validateAccount } = useAccountValidation()

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

// Загружаем существующие данные учетной записи
onMounted(() => {
  const existingData = accountStore.getAccountFormData(props.accountId)
  if (existingData) {
    formData.value = { ...existingData }
  }
})

// Пытаемся сохранить изменения только если вся форма валидна
const attemptSaveIfValid = () => {
  if (validateAccount(formData.value)) {
    updateAccount()
  }
}

// Обновляем состояние в хранилище при изменении типа
const handleTypeChange = () => {
  if (formData.value.type === 'LDAP') {
    formData.value.password = ''
  }
  attemptSaveIfValid()
}

const handleLabelBlur = () => {
  validateField('label', formData.value.labelText)
  attemptSaveIfValid()
}

const handleLoginBlur = () => {
  validateField('login', formData.value.login)
  attemptSaveIfValid()
}

const handlePasswordBlur = () => {
  validateField('password', formData.value.password, formData.value.type)
  attemptSaveIfValid()
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
    // Пользователь отменил действие — ничего не делаем
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

/* При LDAP логин занимает 2 колонки (логин+пароль) */
.login-wrapper.span-two {
  grid-column: 3 / span 2;
}

.error-message {
  color: #f56c6c;
  font-size: 12px;
  margin-top: 4px;
  line-height: 1.2;
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
