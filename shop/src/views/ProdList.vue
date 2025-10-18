<template>
  <main id="app">
    <h1 class="page-title">訂單查詢</h1>

    <div class="order-card" v-for="order in orders" :key="order['訂單編號']">
      <div v-for="(value, key) in order" :key="key">
        <div class="row" v-if="key !== '使用者編號' && key !== '購物車編號' && key !== '狀態'">
          <div class="key">{{ key }}：</div>
          <div class="value">{{ value }}</div>
        </div>

        <div class="row" v-if="key == '狀態'">
          <div class="key">{{ key }}：</div>
          <select v-model="order[key]" required class="value-input">
            <option v-for="status in statusOptions" :key="status" :value="status">
              {{ status }}
            </option>
          </select>
        </div>
      </div>
      <div>
        <button class="sub-button" @click="updatelist(order)">確認變更</button>
      </div>
    </div>
  </main>
</template>

<script setup>
  import { ref, onMounted } from 'vue';
  import { useRoute } from 'vue-router';
  const route = useRoute();

  // 訂單資料陣列
  const orders = ref([]);
  const statusOptions = ['未出貨', '已出貨', '完成', '取消'];

  // 從後端讀取訂單資料
  async function loadOrders() {
    try {
      const res = await fetch(`http://localhost:8080/list/prod/${route.query.id}`);
      //   const res = await fetch(`http://localhost:8080/list/prod/16`);
      if (!res.ok) throw new Error('伺服器錯誤');
      orders.value = await res.json();
    } catch (err) {
      console.error('讀取訂單失敗：', err);
      orders.value = [];
    }
  }
  async function updatelist(order) {
    console.log(order);
    try {
      const response = await fetch(`http://localhost:8080/list/${order.訂單編號}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(order),
      });

      if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);

      const data = await response.json();

      console.log('POST 成功:', data);
      alert(`商品 ${order.訂單編號} 已更新！`);
    } catch (error) {
      alert(`商品 ${order.訂單編號} 更新失敗！`);
      console.error('POST 失敗:', error);
    }
  }

  // 頁面載入時執行
  onMounted(() => {
    loadOrders();
  });
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
  .value-input {
    padding: 0.3rem 0.6rem;
    background: var(--c-background-soft);
    border-radius: 6px;
    border: 1px solid var(--c-border);
    font-size: 1rem;
  }
  .sub-button {
    padding: 0.6rem 3rem;
    margin-top: 2rem;
    margin-bottom: 1rem;
    font-size: 1.6rem;
    width: 100%;
  }
  button {
    background-color: var(--c-primary);
    color: #fff;
    border: none;

    border-radius: 8px;
    cursor: pointer;
    font-weight: 1000;
    transition:
      background-color 0.3s ease,
      transform 0.15s ease;
  }

  button:hover {
    background: linear-gradient(90deg, var(--c-hover) 0%, var(--c-primary) 100%);
    transform: translateY(-2px);
  }
</style>
