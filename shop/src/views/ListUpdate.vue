<template>
  <main id="app">
    <h1 class="page-title">訂單查詢</h1>

    <!-- 遍歷所有訂單 -->
    <div class="order-card" v-for="order in orders" :key="order['訂單編號']">
      <!-- 動態顯示每個欄位，但略過使用者編號與購物車編號 -->
      <div v-for="(value, key) in order" :key="key">
        <div class="row" v-if="key !== '使用者編號' && key !== '購物車編號'">
          <div class="key">{{ key }}：</div>
          <div class="value">{{ value }}</div>
        </div>
      </div>
    </div>
  </main>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useUserStore } from '@/stores/user'

// 取得使用者資料
const userStore = useUserStore()

// 使用者編號（未登入則預設為1）
const myuser = ref(userStore.id || 1)

// 訂單資料陣列
const orders = ref([])

// 從後端讀取訂單資料
async function loadOrders() {
  try {
    const res = await fetch(`http://localhost:8080/list/user/${myuser.value}`)
    if (!res.ok) throw new Error('伺服器錯誤')
    orders.value = await res.json()
  } catch (err) {
    console.error('讀取訂單失敗：', err)
    orders.value = []
  }
}

// 頁面載入時執行
onMounted(() => {
  loadOrders()
})
</script>

<style scoped>
#app {
  min-height: 85vh;
}

/* 頁面標題 */
.page-title {
  font-size: 2.5rem;
  font-weight: bold;
  margin: 2rem 10rem 1rem;
  color: var(--c-heading);
  display: inline-block;
  border-bottom: 3px solid var(--c-primary);
  padding-bottom: 0.3rem;
}

/* 單筆訂單卡片 */
.order-card {
  background-color: var(--c-background-mute);
  width: 80%;
  border-radius: 16px;
  padding: 1.5rem 2rem;
  margin: 1.5rem auto;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
  transition:
    transform 0.25s ease,
    box-shadow 0.25s ease;
}

/* 滑過效果 */
.order-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 8px 18px rgba(0, 0, 0, 0.15);
}

/* 每一列排版 */
.row {
  display: flex;
  align-items: center;
  margin: 0.8rem 2rem;
  line-height: 1.6;
  border-bottom: 1px dashed rgba(0, 0, 0, 0.1);
  padding-bottom: 0.4rem;
}

/* 左邊欄位名稱 */
.key {
  width: 8rem; /* 固定寬度讓文字對齊 */
  font-weight: 700;
  color: var(--c-heading);
  font-size: 1.2rem;
}

/* 右邊值 */
.value {
  flex: 1;
  font-size: 1.2rem;
  color: var(--c-text);
  word-break: break-all;
}
</style>
