<template>
  <main class="main">
    <section class="info card">
      <h2>會員資料</h2>

      <div class="form-row" v-for="(item, key) in bufuser" :key="key">
        <div
          class="form-row"
          v-if="
            key !== '帳號' &&
            key !== '性別' &&
            key !== '使用者編號' &&
            key !== '建立時間' &&
            key !== '密碼' &&
            key !== '電子郵件'
          "
        >
          <label>{{ key }}：</label>
          <div class="input-group">
            <input
              class="input-group-value"
              v-model="bufuser[key]"
              type="text"
              :placeholder="`請輸入 ${bufuser[key]}`"
            />
          </div>
        </div>
        <div class="form-row" v-if="key == '帳號'">
          <label>{{ key }}：</label>
          <span class="form-value">{{ bufuser[key] }}</span>
        </div>
        <div class="form-row" v-if="key == '電子郵件'">
          <label>{{ key }}：</label>
          <span class="form-value">{{ bufuser[key] }}</span>
        </div>
        <div class="form-row" v-if="key == '性別'">
          <label>{{ key }}：</label>
          <div class="input-group">
            <select v-model="bufuser[key]" required class="form-value" style="font-size: 1rem">
              <option value="男生">男生</option>
              <option value="女生">女生</option>
              <option value="其他" selected>其他</option>
            </select>
          </div>
        </div>
      </div>
      <button class="sub-button" @click="updateuser">確認變更</button>
    </section>

    <section class="info card password-container">
      <div class="password-header">
        <h2>變更密碼</h2>
      </div>
      <div class="password-form">
        <div class="password-form-row">
          <div class="form-row">
            <label>舊密碼：</label>
            <div class="input-group">
              <input
                :type="showPassword.old ? 'text' : 'password'"
                v-model="passwords.old"
                placeholder="請輸入舊密碼"
                class="input-group-value"
              />
              <button type="button" @click="togglePassword('old')">
                {{ showPassword ? '隱藏' : '顯示' }}
              </button>
            </div>
          </div>
          <div class="form-row">
            <label>新密碼：</label>
            <div class="input-group">
              <input
                :type="showPassword.new ? 'text' : 'password'"
                v-model="passwords.new"
                placeholder="請輸入新密碼"
                class="input-group-value"
              />
              <button type="button" @click="togglePassword('new')">
                {{ showPassword ? '隱藏' : '顯示' }}
              </button>
            </div>
          </div>
          <div class="form-row">
            <label>確認新密碼：</label>
            <div class="input-group">
              <input
                :type="showPassword.confirm ? 'text' : 'password'"
                v-model="passwords.confirm"
                placeholder="請重新輸入新密碼"
                class="input-group-value"
              />
              <button type="button" @click="togglePassword('confirm')">
                {{ showPassword ? '隱藏' : '顯示' }}
              </button>
            </div>
          </div>
        </div>
      </div>
      <button class="sub-button-password" @click="updatePassword">變更密碼</button>
    </section>
  </main>
</template>

<script setup>
  import { ref, onMounted } from 'vue';
  import { useUserStore } from '@/stores/user';
  import { useRouter } from 'vue-router';

  onMounted(() => {
    loadCartData();
  });
  // ----- 設定 -----
  const userStore = useUserStore();
  const myuser = ref(userStore.id);
  const user = ref({});
  const bufuser = ref({});
  async function loadCartData() {
    const userStore = useUserStore();
    myuser.value = userStore.id;
    if (myuser.value == null) {
      myuser.value = 1;
      console.log('使用者未登入，預設為使用者1');
    }
    try {
      const res = await fetch(`http://localhost:8080/user/${myuser.value}`);
      if (!res.ok) throw new Error('伺服器回應錯誤');

      // **重要：為從 API 來的數據添加前端需要的狀態（例如 `selected`）**
      // 預設將所有商品設置為選中狀態
      bufuser.value = await res.json();

      console.log('使用者數據加載成功:', user);
    } catch (err) {
      console.error('讀取使用者失敗：', err);
      user.value = []; // 如果加載失敗，清空陣列
    }
  }
  const passwords = ref({
    old: '',
    new: '',
    confirm: '',
  });

  async function updateuser() {
    try {
      const res = await fetch(`http://localhost:8080/user/${myuser.value}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' }, // ⚠️ 記得加 header
        body: JSON.stringify(bufuser.value),
      });

      if (!res.ok) {
        alert('資料更新失敗！');
        throw new Error('更新失敗');
      }

      const data = await res.json();

      console.log('更新成功：', data);
      alert('資料已更新成功！');
    } catch (err) {
      console.error('錯誤：', err);
    }
  }
  const router = useRouter();
  async function updatePassword() {
    if (!passwords.value.old) return alert('請輸入舊密碼！');
    if (!passwords.value.new) return alert('請輸入新密碼！');
    if (passwords.value.new !== passwords.value.confirm) return alert('新密碼與確認密碼不一致！');

    try {
      // 先驗證舊密碼
      const loginRes = await fetch('http://localhost:8080/user/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          使用者編號: myuser.value,
          帳號: bufuser.value.帳號,
          密碼: passwords.value.old,
        }),
      });
      const loginData = await loginRes.json();
      if (loginData <= 0) return alert('資料驗證失敗，請輸入正確舊密碼！');

      // 驗證成功後 PUT 新密碼
      const res = await fetch(`http://localhost:8080/user/changepsd`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 帳號: bufuser.value.帳號, 密碼: passwords.value.new }),
      });
      if (!res.ok) throw new Error('密碼更新失敗');

      alert('密碼更新成功！請重新登入');
      router.push({ name: 'login' });
    } catch (err) {
      console.error('錯誤：', err);
      alert('密碼更新失敗，請稍後再試！');
    }
  }

  // 每個欄位對應一個「是否顯示密碼」的布林值
  const showPassword = ref({
    old: false,
    new: false,
    confirm: false,
  });
  // 通用的切換函數，一行搞定所有欄位
  const togglePassword = (field) => {
    showPassword.value[field] = !showPassword.value[field];
  };
</script>

<style scoped>
  :root {
    --c-background: #fff8e7;
    --c-background-soft: #fff2d9;
    --c-background-mute: #ffebc2;
    --c-border: rgba(0, 0, 0, 0.1);
    --c-border-hover: rgba(0, 0, 0, 0.25);
    --c-text: #333333;
    --c-heading: #683a25;
    --c-primary: #94390f;
    --c-accent: #ffebc2;
    --c-hover: #ed842f;
  }

  body {
    background: var(--c-background);
    font-family: 'Inter', 'Segoe UI', Roboto, sans-serif;
    color: var(--c-text);
  }

  .main {
    width: 80%;
    margin: 0.5rem auto;
    padding: 1.5rem;
    display: flex;
    gap: 2rem;
    flex-direction: row;
  }

  .card {
    background: var(--c-background-mute);
    padding: 0.5rem;
    border-radius: 16px;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
    border: 1px solid var(--c-border);
    backdrop-filter: blur(8px);
    transition:
      transform 0.25s ease,
      box-shadow 0.25s ease;

    display: flex;
    flex-direction: column;
  }

  .card:hover {
    transform: translateY(-4px);
    box-shadow: 0 8px 18px rgba(0, 0, 0, 0.15);
  }

  h2 {
    color: var(--c-heading);
    font-weight: 600;
    font-size: 1.7rem;
    border-bottom: 2px solid var(--c-primary);
    display: inline-block;
    padding-bottom: 1%;
  }
  .password-form-row {
    margin: 0.15rem 0;
    padding: 0 1rem;
    display: flex;
    flex-direction: column;
    align-items: flex-start; /* 👈 讓內容靠左對齊 */
    text-align: left; /* 👈 文字也靠左 */
    width: 100%; /* 確保整行都能靠左延展 */
    gap: 2rem;
  }
  .form-row {
    margin: 0.15rem 0;
    padding: 0 1rem;
    display: flex;
    flex-direction: column;
    align-items: flex-start; /* 👈 讓內容靠左對齊 */
    text-align: left; /* 👈 文字也靠左 */
    width: 100%; /* 確保整行都能靠左延展 */
  }

  .form-row label {
    width: 100%; /* 確保輸入框都能延展到整行 */
    flex: 1;
  }

  label {
    font-weight: 1000;
    color: var(--c-heading);
    margin-bottom: 0.4rem;
    font-size: 1.1rem;
  }

  .form-value {
    font-size: 0.8rem;
    padding: 0.3rem 0.6rem;
    background: var(--c-background-soft);
    border-radius: 6px;
    border: 1px solid var(--c-border);
    flex: 1;
    width: 100%;
  }
  .input-group-value {
    font-size: 1rem;
    padding: 0.3rem 0.6rem;
    background: var(--c-background-soft);
    border-radius: 6px;
    border: 1px solid var(--c-border);
    flex: 1;
    width: 100%;
  }

  .input-group {
    display: flex;
    flex: 10;
    flex-direction: row;
    align-items: flex-start; /* 👈 讓內容靠左對齊 */
    text-align: left; /* 👈 文字也靠左 */
    width: 100%; /* 確保整行都能靠左延展 */
  }
  .input-group button {
    padding: 0.3rem 1rem;
    margin: auto 0;
    margin-left: 1rem;
    font-size: 0.8rem;
  }

  input {
    flex: 1;
    padding: 0.6rem 0.8rem;
    border-radius: 8px;
    border: 1px solid var(--c-border);
    background-color: var(--c-background);
    transition:
      border-color 0.2s ease,
      box-shadow 0.2s ease;
  }

  input:focus {
    outline: none;
    border-color: var(--c-primary);
    box-shadow: 0 0 0 3px rgba(148, 57, 15, 0.2);
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
    background-color: var(--c-hover);
    transform: translateY(-2px);
  }
  .info {
    flex: 1;
    display: flex;
    align-items: center;
    justify-content: center;
  }
  .sub-button {
    padding: 0.6rem 3rem;
    margin-top: 2rem;
    margin-bottom: 1rem;
    font-size: 1.6rem;
  }
  .sub-button-password {
    padding: 0.6rem 3rem;
    margin: 0 auto 1.5rem auto;
    font-size: 1.6rem;
  }
  .password-container {
    display: flex; /* flex 才能排水平或垂直 */
    flex-direction: column; /* 上下排列 */
    width: 100%;
  }
  .password-header {
    width: 100%;
    flex: 8%;
    display: flex;
    align-items: center;
    justify-content: center;
  }
  .password-form {
    flex: 50%;
    margin: 6rem 0;
    padding: 0 1rem;
    display: flex;
    flex-direction: column;
    align-items: flex-start; /* 👈 讓內容靠左對齊 */
    text-align: left; /* 👈 文字也靠左 */
    width: 100%; /* 確保整行都能靠左延展 */
  }
</style>
