<template>
  <div class="container">
    <div class="header">
      <h1>{{ userStore.name }}的商品管理中心</h1>
    </div>

    <div class="product-card new-product-card">
      <div class="card-header new-header">
        <span class="icon">➕</span>
        <h2 style="font-size: 1.5rem">上傳新商品</h2>
      </div>

      <div class="card-body">
        <div class="content-wrapper">
          <div class="image-section">
            <div class="image-upload-box" @click="$refs.newFileInput.click()">
              <img
                v-if="newProduct.preview"
                :src="newProduct.preview"
                alt="預覽"
                class="preview-img"
              />
              <div v-else class="upload-placeholder">
                <span class="upload-icon">📤</span>
                <p>點擊上傳</p>
              </div>
              <input
                ref="newFileInput"
                type="file"
                accept="image/*"
                @change="handleFileUpload($event, newProduct)"
                style="display: none"
              />
            </div>

            <div class="input-row" style="flex-direction: row">
              <div>
                <div class="little-name">價格</div>
                <input
                  v-model.number="newProduct.價格"
                  type="number"
                  placeholder="價格"
                  class="input-field"
                />
              </div>
              <div>
                <div class="little-name">庫存</div>
                <input
                  v-model.number="newProduct.庫存數量"
                  type="number"
                  placeholder="庫存"
                  class="input-field"
                />
              </div>
            </div>
          </div>

          <div class="form-section">
            <div>
              <div class="little-name">商品名稱</div>
              <input
                v-model="newProduct.商品名稱"
                type="text"
                placeholder="商品名稱 *"
                class="input-field"
              />
            </div>
            <div>
              <div class="little-name">商品描述</div>
              <textarea
                v-model="newProduct.商品描述"
                placeholder="商品描述 *"
                class="input-field textarea-field"
              ></textarea>
            </div>
            <div>
              <div class="little-name">顏色 (逗號分隔)</div>
              <input
                v-model="newProduct.顏色總類"
                type="text"
                placeholder="顏色 (逗號分隔) *"
                class="input-field"
              />
              <div class="color-preview">
                <span
                  v-for="(c, i) in parseColors(newProduct.顏色總類)"
                  :key="i"
                  class="color-item"
                >
                  <span class="color-dot" :style="{ backgroundColor: c.hex }"></span>
                  <span class="color-name">{{ c.name }}</span>
                </span>
              </div>
            </div>
            <div>
              <div class="little-name">尺寸 (逗號分隔)</div>
              <input
                v-model="newProduct.尺寸總類"
                type="text"
                placeholder="尺寸 (逗號分隔) *"
                class="input-field"
              />
            </div>
          </div>
        </div>

        <button class="btn btn-create" style="" @click="createNewProduct">上傳新商品</button>
      </div>
    </div>

    <div class="products-list">
      <div v-for="product in products" :key="product.id" class="product-card">
        <div class="card-header">
          <h3>{{ product.商品名稱 }}</h3>
          <span class="product-id">編號: {{ product.商品編號 }}</span>
        </div>

        <div class="card-body">
          <div class="content-wrapper">
            <div class="image-section">
              <div class="image-display">
                <img
                  :src="product.preview || `http://localhost:8080/files/view/${product.商品圖片}`"
                  :alt="product.name"
                  class="preview-img"
                  @error="handleImageError"
                />
              </div>
              <label class="btn-change-image">
                更換圖片
                <input
                  type="file"
                  accept="image/*"
                  @change="(e) => handleFileUpload(e, product)"
                  style="display: none"
                />
              </label>
              <div class="input-row">
                <div>
                  <div class="little-name">價格</div>
                  <input
                    v-model.number="product.價格"
                    type="number"
                    placeholder="價格"
                    class="input-field"
                  />
                </div>
                <div>
                  <div class="little-name">庫存</div>
                  <input
                    v-model.number="product.庫存數量"
                    type="number"
                    placeholder="庫存"
                    class="input-field"
                  />
                </div>
              </div>
              <div class="input-row">
                <button class="btn-listwatch" @click="uprodlist(product)">查看商品訂單</button>
                <button class="btn-del" @click="deletepd(product)">刪除商品</button>
              </div>
            </div>

            <div class="form-section">
              <div>
                <div class="little-name">商品名稱</div>
                <input
                  v-model="product.商品名稱"
                  type="text"
                  placeholder="商品名稱 *"
                  class="input-field"
                />
              </div>
              <div class="little-name">商品描述</div>
              <textarea
                v-model="product.商品描述"
                class="input-field textarea-field"
                placeholder="商品描述"
              ></textarea>
              <div class="little-name">顏色</div>
              <input
                v-model="product.顏色總類"
                type="text"
                placeholder="顏色"
                class="input-field"
              />
              <div class="color-preview">
                <span v-for="(c, i) in parseColors(product.顏色總類)" :key="i" class="color-item">
                  <span class="color-dot" :style="{ backgroundColor: c.hex }"></span>
                  <span class="color-name">{{ c.name }}</span>
                </span>
              </div>
              <div class="little-name">尺寸</div>
              <input
                v-model="product.尺寸總類"
                type="text"
                placeholder="尺寸"
                class="input-field"
              />

              <p class="upload-time">上架時間: {{ product.上架時間 }}</p>
            </div>
          </div>

          <button class="btn btn-update" @click="updateExistingProduct(product)">
            更新商品資料
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
  import { ref, reactive, onMounted } from 'vue';
  import { useUserStore } from '@/stores/user';
  import { useRouter } from 'vue-router';
  const router = useRouter();
  const userStore = useUserStore();
  const myuser = ref(userStore.id);

  onMounted(() => {
    loadProducts();
  });
  const products = ref([
    // {
    //   id: 16,
    //   name: '女裝- BEAVER 短袖上衣',
    //   image: '女裝BEAVER 短袖上衣.jpg',
    //   description: '短袖上衣以撞色結合經典LOGO印花...',
    //   colors: '黑#000000,白#FFFFFF,粉紫#d27497,淺綠#90926F',
    //   sizes: 'XS,S,M,L',
    //   price: 1584,
    //   stock: 0,
    //   uploaderId: '1',
    //   uploadTime: '2025-10-04 14:58:00.0',
    //   file: null,
    //   preview: null,
    // },
    // // {
    // //   id: 19,
    // //   name: '女裝- ORIGINAL 連帽上衣',
    // //   image: '女裝ORIGINAL連帽上衣.jpg',
    // //   description: '連帽上衣是衣櫥必備的百搭單品...',
    // //   colors: '淺紫#c5bef9,粉紫#d27497,淺綠#90926F',
    // //   sizes: 'XS,S,M,L',
    // //   price: 1540,
    // //   stock: 20,
    // //   uploaderId: '1',
    // //   uploadTime: '2025-10-04 14:58:00.0',
    // //   file: null,
    // //   preview: null,
    // // },
  ]);
  async function loadProducts() {
    if (myuser.value == null) {
      myuser.value = 1;
      console.log('使用者未登入，預設為使用者1');
    }
    try {
      const res = await fetch(`http://localhost:8080/products/user/${myuser.value}`);
      if (!res.ok) throw new Error('伺服器回應錯誤');
      products.value = await res.json();
      console.log(products.value);
    } catch (err) {
      console.error('讀取失敗：', err);
    }
  }
  const newProduct = reactive({
    商品名稱: '',
    商品圖片: '',
    商品描述: '',
    顏色總類: '',
    尺寸總類: '',
    價格: null,
    庫存數量: null,
    上架者編號: myuser.value,
    file: null,
    preview: null,
  });

  const parseColors = (colorStr) => {
    if (!colorStr) return [];
    return colorStr.split(',').map((c) => {
      const parts = c.split('#');
      const name = parts[0].trim();
      const hex = parts.length > 1 ? '#' + parts[1].trim() : '#000000';
      return { name, hex };
    });
  };

  const handleFileUpload = (event, product) => {
    const file = event.target.files[0];
    if (file) {
      if (product.preview) {
        URL.revokeObjectURL(product.preview);
      }
      product.file = file;
      product.商品圖片 = file.name;
      product.preview = URL.createObjectURL(file);
    }
  };

  const validateProduct = (product, isNew = false) => {
    const requiredFields = [
      '商品名稱',
      '商品描述',
      '顏色總類',
      '尺寸總類',
      '價格',
      '庫存數量',
      '商品圖片',
    ];

    if (isNew && !product.商品圖片) {
      alert('請選擇圖片檔案！');
      return false;
    }

    for (const field of requiredFields) {
      const value = product[field];
      if (
        value === null ||
        value === undefined ||
        (typeof value === 'string' && value.trim() === '') ||
        (typeof value === 'number' && isNaN(value))
      ) {
        alert(`【${field}】不能為空！`);
        return false;
      }
    }

    if (product.價格 < 0 || product.庫存數量 < 0) {
      alert('價格和庫存不能小於零！');
      return false;
    }

    return true;
  };

  const createNewProduct = async () => {
    if (!validateProduct(newProduct, true)) return;
    await createNewphoto(newProduct);
    try {
      const response = await fetch('http://localhost:8080/products', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newProduct), // 只送第一筆暫存
      });

      if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);

      const data = await response.json();

      alert(`商品 ${newProduct.商品名稱} 上傳成功！`);
      console.log('POST 成功:', data);
      Object.assign(newProduct, {
        商品名稱: '',
        商品圖片: '',
        商品描述: '',
        顏色總類: '',
        尺寸總類: '',
        價格: null,
        庫存數量: null,
        上架者編號: myuser.value,
      });
      await loadProducts();
    } catch (error) {
      alert(`商品 ${newProduct.商品名稱} 上傳失敗！`);
      console.error('POST 失敗:', error);
    }
  };
  //圖片上傳
  const createNewphoto = async (buf_Product) => {
    if (!buf_Product.file) return;

    const formData = new FormData();
    formData.append('file', buf_Product.file);

    if (buf_Product.商品圖片) {
      formData.append('oldFileName', buf_Product.商品圖片);
    }

    const res = await fetch('http://localhost:8080/files/upload', {
      method: 'POST',
      body: formData,
    });

    const fileUrl = await res.text();

    // 儲存新檔名，以便下次替換
    buf_Product.商品圖片 = fileUrl;
    console.log('圖片上傳成功');
  };

  const updateExistingProduct = async (product) => {
    if (!validateProduct(product, false)) return;

    if (!validateProduct(product, true)) return;
    await createNewphoto(product);
    try {
      const response = await fetch(`http://localhost:8080/products/${product.商品編號}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(product),
      });

      if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);

      const data = await response.json();

      console.log('POST 成功:', data);
      alert(`商品 ${product.商品名稱} 已更新！`);
      await loadProducts();
    } catch (error) {
      alert(`商品 ${product.商品名稱} 上傳失敗！`);
      console.error('POST 失敗:', error);
    }
  };
  const deletepd = async (product) => {
    try {
      const response = await fetch(`http://localhost:8080/products/${product.商品編號}`, {
        method: 'DELETE',
      });

      if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);

      const data = await response.json();

      console.log('POST 成功:', data);
      alert(`商品 ${product.商品名稱} 已刪除！`);
      await loadProducts();
    } catch (error) {
      alert(`商品 ${product.商品名稱} 刪除失敗！`);
      console.error('POST 失敗:', error);
    }
  };
  const uprodlist = (product) => {
    router.push({
      path: '/prodlist',
      query: { id: product.商品編號 },
    });
  };

  const handleImageError = (e) => {
    e.target.style.display = 'none';
  };
</script>

<style scoped>
  :root {
    --c-bg: #fff8e7;
    --c-bg-mute: #ffebc2;
    --c-border: rgba(0, 0, 0, 0.1);
    --c-text: #333333;
    --c-heading: #683a25;
    --c-primary: #94390f;
    --c-hover: #ed842f;
    --c-success: #1a7e4b;
    --c-success-hover: #38a169;
    --c-white: #ffffff;
    --c-gray: #808080;
  }

  /* 基礎設定：建議在全域 CSS 中設定根字體大小，這裡假定瀏覽器預設為 16px */
  * {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
  }

  .container {
    min-height: 100vh;
    background: linear-gradient(135deg, #fff8e7 0%, #ffebc2 50%, #ffdbac 100%);
    /* 距離使用百分比 */
    padding: 1rem;
  }

  .header {
    /* 距離使用 rem/em */
    margin: 0 auto;
    width: 78%;

    color: var(--c-heading);
    text-align: left;
    white-space: nowrap;
  }

  .header h1 {
    /* 尺寸使用 rem */
    font-size: 2.5rem;
    font-weight: bold;
    background: var(--c-heading);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
    margin-bottom: 0.5rem;
    padding-right: 130vh;
    text-align: left;
  }

  .header p {
    color: #666;
    font-size: 0.875rem; /* 14px */
  }

  .product-card {
    /* 距離使用 rem */
    margin: 0 10rem 1.5rem 10rem;
    background: var(--c-white);
    /* 尺寸使用 rem */
    border-radius: 1rem;
    box-shadow: 0 0.25rem 0.9375rem rgba(0, 0, 0, 0.08); /* 4px 15px */
    overflow: hidden;
    transition: all 0.2s ease;
  }

  .product-card:hover {
    transform: translateY(-0.125rem); /* -2px */
    box-shadow: 0 0.375rem 1.5625rem rgba(0, 0, 0, 0.12); /* 6px 25px */
  }

  .new-product-card {
    /* 尺寸使用 rem */
    border: 0.125rem solid var(--c-primary);
    background-color: var(--c-bg-mute);
  }

  .card-header {
    display: flex;
    align-items: center;
    /* 距離使用 rem */
    gap: 0.75rem;
    padding: 0.5rem 1.5rem;
    background: linear-gradient(90deg, #d97706 0%, #b91c1c 100%);
    color: #f8fafc;
  }

  .new-header {
    background: linear-gradient(90deg, #16a34a 0%, #059669 100%);
    color: #f8fafc;
  }

  .card-header .icon {
    /* 尺寸使用 rem */
    font-size: 1.5rem;
  }

  .card-header h2 {
    /* 尺寸使用 rem */
    font-size: 1.25rem;
    font-weight: 700;
    margin: 0;
  }

  .card-header h3 {
    /* 尺寸使用 rem */
    font-size: 1.25rem;
    font-weight: 700;
    margin: 0;
  }

  .product-id {
    /* 尺寸使用 rem */
    font-size: 0.75rem;
    opacity: 0.9;
    margin-left: auto;
  }

  .card-body {
    /* 距離使用 rem */
    padding: 1rem;
    background-color: #fff8e7;
  }

  .content-wrapper {
    display: flex;
    /* 距離使用 rem */
    gap: 1.5rem;
    flex-wrap: wrap;
  }

  @media (max-width: 1024px) {
    .content-wrapper {
      flex-direction: column;
      /* 距離使用 rem */
      gap: 1.25rem;
    }
  }

  .image-section {
    /* 寬度使用 rem，在小螢幕上調整為 100% */
    flex: 1; /* 260px */
    display: flex;
    flex-direction: column;
    /* 距離使用 rem */
    gap: 1em;
  }

  @media (max-width: 1024px) {
    .image-section {
      flex: 0 0 auto;
      max-width: 100%;
    }
  }

  .image-upload-box {
    width: 100%;
    /* 尺寸使用 rem */
    height: 70%; /* 220px */
    flex: 30%;
    border: 0.125rem dashed #ccc;
    border-radius: 0.75rem; /* 12px */
    display: flex;
    align-items: center;
    justify-content: center;
    background: linear-gradient(135deg, #f9fafb 0%, #f3f4f6 100%);
    cursor: pointer;
    transition: all 0.2s ease;
    overflow: hidden;
  }

  .upload-placeholder {
    display: flex;
    flex-direction: column;
    align-items: center;
    /* 距離使用 rem */
    gap: 0.5rem;
    color: #999;
    text-align: center;
  }

  .upload-icon {
    /* 尺寸使用 rem */
    font-size: 2.25rem;
  }

  .upload-placeholder p {
    /* 尺寸使用 rem */
    font-size: 0.875rem;
  }

  .image-display {
    width: 100%;
    /* 尺寸使用 rem */
    height: 13.75rem;
    border-radius: 0.75rem;
    background: linear-gradient(135deg, #f9fafb 0%, #f3f4f6 100%);
    display: flex;
    align-items: center;
    justify-content: center;
    /* 尺寸使用 rem */
    border: 0.0625rem solid #e5e7eb;
  }

  .preview-img {
    max-width: 100%;
    max-height: 100%;
    height: 13.75rem;
    object-fit: contain;
    /* 尺寸使用 rem */
    border-radius: 0.5rem;
  }

  .btn-change-image {
    display: block;
    width: 100%;
    /* 距離使用 rem */
    padding: 0.625rem 0.75rem;
    background-color: #fed7aa;
    color: #9a3412;
    text-align: center;
    /* 尺寸使用 rem */
    border-radius: 0.5rem;
    cursor: pointer;
    font-weight: 600;
    /* 尺寸使用 rem */
    font-size: 0.8125rem; /* 13px */
    transition: all 0.2s ease;
    border: none;
  }

  .form-section {
    flex: 1;
    display: flex;
    flex-direction: column;
    /* 距離使用 rem */
    gap: 0.1rem;
  }

  .input-field {
    /* 距離使用 rem */
    padding: 0.625rem;
    width: 100%;
    /* 尺寸使用 rem */
    border: 0.0625rem solid #e5e7eb;
    border-radius: 0.5rem;
    font-size: 1.1rem; /* 14px */
    background-color: var(--c-bg);
    color: var(--c-text);
    transition: all 0.2s ease;
    font-family: inherit;
  }

  .input-field:focus {
    outline: none;
    border-color: var(--c-primary);
    box-shadow: 0 0 0 0.1875rem rgba(148, 57, 15, 0.1); /* 3px */
  }

  .input-field:read-only {
    background-color: #f3f4f6;
    cursor: default;
  }

  .textarea-field {
    resize: vertical;
    /* 尺寸使用 rem */
    min-height: 6.25rem;
  }

  .input-row {
    display: flex;
    flex: 10%;
    /* 距離使用 rem */
    gap: 0.75rem;
  }

  .input-row .input-field {
    flex: 1;
  }

  .color-preview {
    display: flex;
    /* 距離使用 rem */
    gap: 0.75rem;
    flex-wrap: wrap;
    align-items: center;
    /* 尺寸使用 rem */
    font-size: 0.75rem;
    color: var(--c-text);
    /* 距離使用 rem */
    padding: 0.5rem 0;
  }

  .color-item {
    display: flex;
    align-items: center;
    /* 距離使用 rem */
    gap: 0.375rem;
  }

  .color-dot {
    /* 尺寸使用 rem */
    width: 1.25rem;
    height: 1.25rem;
    border-radius: 50%;
    border: 0.125rem solid #fff;
    /* 尺寸使用 rem */
    outline: 0.0625rem solid rgba(0, 0, 0, 0.2);
    display: inline-block;
  }

  .color-name {
    /* 尺寸使用 rem */
    font-size: 0.75rem;
  }

  .upload-time {
    /* 尺寸使用 rem */
    font-size: 0.75rem;
    color: #666;
    /* 距離使用 rem */
    margin-top: 0.5rem;
  }

  .btn {
    width: 100%;
    /* 距離使用 rem */
    padding: 0.75rem 1rem;
    border: none;
    /* 尺寸使用 rem */
    border-radius: 0.5rem;
    font-weight: 700;
    font-size: 0.875rem; /* 14px */
    cursor: pointer;
    transition: all 0.2s ease;
    letter-spacing: 1px;
  }

  .btn-create {
    background: #147548;
    color: #f3f4f6;
    /* 距離使用 rem */
    margin-top: 0.5rem;
  }

  .btn-create:hover {
    background: linear-gradient(90deg, var(--c-hover) 0%, #0dc971 100%);
    box-shadow: 0 0.25rem 0.625rem rgba(26, 126, 75, 0.3); /* 4px 10px */
  }

  .btn-update {
    background: linear-gradient(90deg, var(--c-primary) 0%, #b9941c 100%);
    color: #ffffff;
    /* 距離使用 rem */
    margin-top: 1rem;
  }

  .btn-update:hover {
    background: linear-gradient(90deg, var(--c-hover) 0%, #ead360 100%);
    box-shadow: 0 0.25rem 0.625rem rgba(148, 57, 15, 0.3); /* 4px 10px */
  }
  .btn-listwatch {
    background: #1e8ec2;
    color: #ffffff;
    /* 距離使用 rem */
    margin: 0.5rem auto;
    width: 80%;
    /* 距離使用 rem */
    padding: 1rem 1rem;
    border: none;
    /* 尺寸使用 rem */
    border-radius: 0.5rem;
    font-weight: 800;
    font-size: 1.1rem; /* 14px */
    cursor: pointer;
    transition: all 0.2s ease;
    letter-spacing: 1px;
  }
  .btn-listwatch:hover {
    background: linear-gradient(90deg, var(--c-hover) 0%, #0ba3db 100%);
    box-shadow: 0 0.25rem 0.625rem rgba(148, 57, 15, 0.3); /* 4px 10px */
  }
  .little-name {
    font-size: 1.2rem;
    font-weight: bold;
  }
  .btn-del {
    background: #c2311e;
    color: #ffffff;
    /* 距離使用 rem */
    margin: 0.5rem auto;
    width: 80%;
    /* 距離使用 rem */
    padding: 1rem 1rem;
    border: none;
    /* 尺寸使用 rem */
    border-radius: 0.5rem;
    font-weight: 800;
    font-size: 1.1rem; /* 14px */
    cursor: pointer;
    transition: all 0.2s ease;
    letter-spacing: 1px;
  }
  .btn-del:hover {
    background: linear-gradient(90deg, var(--c-hover) 0%, #db3f0b 100%);
    box-shadow: 0 0.25rem 0.625rem rgba(148, 57, 15, 0.3); /* 4px 10px */
  }
</style>
