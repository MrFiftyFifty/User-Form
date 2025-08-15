<template>
  <div class="accounts-view">
    <div class="header-section">
      <div class="header-content">
        <h1 class="page-title">Учетные записи</h1>
        <el-button 
          type="primary" 
          size="large"
          @click="handleAddAccount"
          :icon="Plus"
          circle
          class="add-button"
        />
      </div>
      
      <div class="help-text">
        <el-alert 
          type="info" 
          :closable="false"
          show-icon
          class="help-alert"
        >
          <template #title>
            <span>Для указания нескольких меток для одной учетной записи используйте разделитель ;</span>
          </template>
        </el-alert>
      </div>
    </div>

    <div class="accounts-section">
      <div class="field-labels">
        <div class="label-grid" :class="{ 'ldap-layout': !hasLocalAccounts }">
          <span>Метка</span>
          <span>Тип записи</span>
          <span>Логин</span>
          <span v-if="hasLocalAccounts">Пароль</span>
          <span></span>
        </div>
      </div>

      <div class="accounts-list">
        <transition-group name="account" tag="div">
          <AccountRow
            v-for="account in accountStore.accounts"
            :key="account.id"
            :account-id="account.id"
          />
        </transition-group>
        <div v-if="accountStore.accounts.length === 0" class="no-accounts">
          <el-empty description="Нет учетных записей. Нажмите + для добавления новой записи." />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { Plus } from '@element-plus/icons-vue'
import { useAccountStore } from '@/stores/accountStore'
import AccountRow from '@/components/AccountRow.vue'

const accountStore = useAccountStore()

const hasLocalAccounts = computed(() => {
  return accountStore.accounts.some(account => {
    const formData = accountStore.getAccountFormData(account.id)
    return formData?.type === 'Локальная'
  })
})

const handleAddAccount = () => {
  accountStore.addAccount()
}
</script>

<style scoped>
.accounts-view {
  max-width: 1000px;
  margin: 0 auto;
  padding: 20px;
}

.header-section {
  margin-bottom: 32px;
}

.header-content {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
}

.page-title {
  font-size: 24px;
  font-weight: 600;
  margin: 0;
  color: #303133;
}

.add-button {
  width: 48px;
  height: 48px;
}

.help-text {
  max-width: 600px;
}

.help-alert {
  border-radius: 8px;
}

.accounts-section {
  background: white;
  border-radius: 12px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.1);
  overflow: hidden;
}

.field-labels {
  background: #f5f7fa;
  padding: 16px;
  border-bottom: 1px solid #ebeef5;
}

.label-grid {
  display: grid;
  grid-template-columns: 1fr 150px 200px 200px 60px;
  gap: 16px;
  font-weight: 600;
  color: #606266;
  font-size: 14px;
}

.label-grid.ldap-layout {
  grid-template-columns: 1fr 150px 400px 60px;
}

.accounts-list {
  min-height: 200px;
}

.no-accounts {
  padding: 60px 20px;
}

/* Анимации переходов */
.account-enter-active,
.account-leave-active {
  transition: all 0.3s ease;
}

.account-enter-from {
  opacity: 0;
  transform: translateY(-20px);
}

.account-leave-to {
  opacity: 0;
  transform: translateX(100px);
}

.account-move {
  transition: transform 0.3s ease;
}

.add-button {
  transition: all 0.2s ease;
}

.add-button:hover {
  transform: scale(1.05);
  box-shadow: 0 4px 12px rgba(64, 158, 255, 0.3);
}

@media (max-width: 768px) {
  .accounts-view {
    padding: 16px;
  }
  
  .header-content {
    flex-direction: column;
    gap: 16px;
    align-items: flex-start;
  }
  
  .label-grid {
    grid-template-columns: 1fr;
    gap: 8px;
  }
  
  .label-grid span:not(:first-child) {
    display: none;
  }
}
</style>
