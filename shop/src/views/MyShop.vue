<template>
  <div class="container">
    <div class="header">
      <h1>商品管理中心</h1>
      <p>管理和上傳你的商品資訊</p>
    </div>

    <!-- 新增商品卡片 -->
    <div class="product-card new-product-card">
      <div class="card-header new-header">
        <span class="icon">➕</span>
        <h2>上傳新商品</h2>
      </div>

      <div class="card-body">
        <div class="content-wrapper">
          <!-- 左側 - 圖片上傳 -->
          <div class="image-section">
            <div class="image-upload-box" @click="$refs.newFileInput.click()">
              <img v-if="newProduct.preview" :src="newProduct.preview" alt="預覽" class="preview-img" />
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

            <div class="input-row">
              <input
                v-model.number="newProduct.price"
                type="number"
                placeholder="價格"
                class="input-field"
              />
              <input
                v-model.number="newProduct.stock"
                type="number"
                placeholder="庫存"
                class="input-field"
              />
            </div>
          </div>

          <!-- 右側 - 表單 -->
          <div class="form-section">
            <input
              v-model="newProduct.name"
              type="text"
              placeholder="商品名稱 *"
              class="input-field"
            />
            <textarea
              v-model="newProduct.description"
              placeholder="商品描述 *"
              class="input-field textarea-field"
            ></textarea>
            <input
              v-model="newProduct.colors"
              type="text"
              placeholder="顏色 (逗號分隔) *"
              class="input-field"
            />
            <div class="color-preview">
              <span v-for="(c, i) in parseColors(newProduct.colors)" :key="i" class="color-item">
                <span class="color-dot" :style="{ backgroundColor: c.hex }"></span>
                <span class="color-name">{{ c.name }}</span>
              </span>
            </div>
            <input
              v-model="newProduct.sizes"
              type="text"
              placeholder="尺寸 (逗號分隔) *"
              class="input-field"
            />
          </div>
        </div>

        <button class="btn btn-create" @click="createNewProduct">上傳新商品</button>
      </div>
    </div>

    <!-- 現有商品列表 -->
    <div class="products-list">
      <div v-for="product in products" :key="product.id" class="product-card">
        <div class="card-header">
          <h3>{{ product.name }}</h3>
          <span class="product-id">編號: {{ product.id }}</span>
        </div>

        <div class="card-body">
          <div class="content-wrapper">
            <!-- 左側 - 圖片 -->
            <div class="image-section">
              <div class="image-display">
                <img
                  :src="`http://localhost:8080/files/view/${product.image}`"
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
            </div>

            <!-- 右側 - 資訊 -->
            <div class="form-section">
              <textarea
                v-model="product.description"
                class="input-field textarea-field"
                placeholder="商品描述"
              ></textarea>

              <input
                v-model="product.colors"
                type="text"
                placeholder="顏色"
                class="input-field"
              />
              <div class="color-preview">
                <span v-for="(c, i) in parseColors(product.colors)" :key="i" class="color-item">
                  <span class="color-dot" :style="{ backgroundColor: c.hex }"></span>
                  <span class="color-name">{{ c.name }}</span>
                </span>
              </div>

              <input
                v-model="product.sizes"
                type="text"
                placeholder="尺寸"
                class="input-field"
              />

              <div class="input-row">
                <input
                  v-model.number="product.price"
                  type="number"
                  placeholder="價格"
                  class="input-field"
                />
                <input
                  v-model.number="product.stock"
                  type="number"
                  placeholder="庫存"
                  class="input-field"
                />
              </div>

              <p class="upload-time">上架時間: {{ product.uploadTime }}</p>
            </div>
          </div>

          <button class="btn btn-update" @click="updateExistingProduct(product)">更新商品資料</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive } from 'vue';

const products = ref([
  {
    id: 16,
    name: '女裝- BEAVER 短袖上衣',
    image: '女裝BEAVER 短袖上衣.jpg',
    description: '短袖上衣以撞色結合經典LOGO印花...',
    colors: '黑#000000,白#FFFFFF,粉紫#d27497,淺綠#90926F',
    sizes: 'XS,S,M,L',
    price: 1584,
    stock: 0,
    uploaderId: '1',
    uploadTime: '2025-10-04 14:58:00.0',
    file: null,
    preview: null,
  },
  {
    id: 19,
    name: '女裝- ORIGINAL 連帽上衣',
    image: '女裝ORIGINAL連帽上衣.jpg',
    description: '連帽上衣是衣櫥必備的百搭單品...',
    colors: '淺紫#c5bef9,粉紫#d27497,淺綠#90926F',
    sizes: 'XS,S,M,L',
    price: 1540,
    stock: 20,
    uploaderId: '1',
    uploadTime: '2025-10-04 14:58:00.0',
    file: null,
    preview: null,
  },
]);

const newProduct = reactive({
  name: '',
  image: '',
  description: '',
  colors: '',
  sizes: '',
  price: null,
  stock: null,
  uploaderId: '1',
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
    product.image = file.name;
    product.preview = URL.createObjectURL(file);
  }
};

const validateProduct = (product, isNew = false) => {
  const requiredFields = ['name', 'description', 'colors', 'sizes', 'price', 'stock'];

  if (isNew && !product.file) {
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

  if (product.price < 0 || product.stock < 0) {
    alert('價格和庫存不能小於零！');
    return false;
  }

  return true;
};

const createNewProduct = () => {
  if (!validateProduct(newProduct, true)) return;

  const newId = Math.max(...products.value.map((p) => p.id)) + 1;
  const now = new Date().toLocaleString();

  const productToAdd = {
    ...newProduct,
    id: newId,
    uploadTime: now,
    file: null,
    preview: null,
  };

  products.value.unshift(productToAdd);

  Object.assign(newProduct, {
    name: '',
    image: '',
    description: '',
    colors: '',
    sizes: '',
    price: null,
    stock: null,
    uploaderId: '1',
    file: null,
    preview: null,
  });

  alert(`商品 ${productToAdd.name} (編號: ${newId}) 上傳成功！`);
};

const updateExistingProduct = (product) => {
  if (!validateProduct(product, false)) return;

  product.file = null;
  product.preview = null;

  alert(`商品 ${product.name} (編號: ${product.id}) 已更新！`);
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

* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

.container {
  min-height: 100vh;
  background: linear-gradient(135deg, #fff8e7 0%, #ffebc2 50%, #ffdbac 100%);
  padding: 24px 16px;
}

.header {
  max-width: 1200px;
  margin: 0 auto 32px;
  text-align: left;
}

.header h1 {
  font-size: 32px;
  font-weight: 700;
  background: linear-gradient(90deg, #d97706 0%, #b91c1c 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  margin-bottom: 8px;
}

.header p {
  color: #666;
  font-size: 14px;
}

.product-card {
  max-width: 1200px;
  margin: 0 auto 24px;
  background: var(--c-white);
  border-radius: 16px;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.08);
  overflow: hidden;
  transition: all 0.2s ease;
}

.product-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 25px rgba(0, 0, 0, 0.12);
}

.new-product-card {
  border: 2px solid var(--c-primary);
  background-color: var(--c-bg-mute);
}

.card-header {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 20px 24px;
  background: linear-gradient(90deg, #d97706 0%, #b91c1c 100%);
  color: var(--c-white);
}

.new-header {
  background: linear-gradient(90deg, #16a34a 0%, #059669 100%);
}

.card-header .icon {
  font-size: 24px;
}

.card-header h2 {
  font-size: 20px;
  font-weight: 700;
  margin: 0;
}

.card-header h3 {
  font-size: 20px;
  font-weight: 700;
  margin: 0;
}

.product-id {
  font-size: 12px;
  opacity: 0.9;
  margin-left: auto;
}

.card-body {
  padding: 24px;
}

.content-wrapper {
  display: flex;
  gap: 24px;
  margin-bottom: 20px;
  flex-wrap: wrap;
}

@media (max-width: 1024px) {
  .content-wrapper {
    flex-direction: column;
  }
}

.image-section {
  flex: 0 0 260px;
  display: flex;
  flex-direction: column;
  gap: 12px;
}

@media (max-width: 1024px) {
  .image-section {
    flex: 0 0 auto;
    max-width: 100%;
  }
}

.image-upload-box {
  width: 100%;
  height: 220px;
  border: 2px dashed #ccc;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #f9fafb 0%, #f3f4f6 100%);
  cursor: pointer;
  transition: all 0.2s ease;
  overflow: hidden;
}

.image-upload-box:hover {
  border-color: var(--c-hover);
  background: linear-gradient(135deg, #fef3c7 0%, #fee2b5 100%);
}

.upload-placeholder {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
  color: #999;
  text-align: center;
}

.upload-icon {
  font-size: 36px;
}

.upload-placeholder p {
  font-size: 14px;
}

.image-display {
  width: 100%;
  height: 220px;
  border-radius: 12px;
  background: linear-gradient(135deg, #f9fafb 0%, #f3f4f6 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  border: 1px solid #e5e7eb;
}

.preview-img {
  max-width: 100%;
  max-height: 100%;
  object-fit: contain;
  border-radius: 8px;
}

.btn-change-image {
  display: block;
  width: 100%;
  padding: 10px 12px;
  background-color: #fed7aa;
  color: #9a3412;
  text-align: center;
  border-radius: 8px;
  cursor: pointer;
  font-weight: 600;
  font-size: 13px;
  transition: all 0.2s ease;
  border: none;
}

.btn-change-image:hover {
  background-color: var(--c-hover);
  color: var(--c-white);
}

.form-section {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.input-field {
  padding: 10px 12px;
  border: 1px solid #e5e7eb;
  border-radius: 8px;
  font-size: 14px;
  background-color: var(--c-bg);
  color: var(--c-text);
  transition: all 0.2s ease;
  font-family: inherit;
}

.input-field:focus {
  outline: none;
  border-color: var(--c-primary);
  box-shadow: 0 0 0 3px rgba(148, 57, 15, 0.1);
}

.input-field:read-only {
  background-color: #f3f4f6;
  cursor: default;
}

.textarea-field {
  resize: vertical;
  min-height: 100px;
}

.input-row {
  display: flex;
  gap: 12px;
}

.input-row .input-field {
  flex: 1;
}

.color-preview {
  display: flex;
  gap: 12px;
  flex-wrap: wrap;
  align-items: center;
  font-size: 12px;
  color: var(--c-text);
  padding: 8px 0;
}

.color-item {
  display: flex;
  align-items: center;
  gap: 6px;
}

.color-dot {
  width: 20px;
  height: 20px;
  border-radius: 50%;
  border: 2px solid #fff;
  outline: 1px solid rgba(0, 0, 0, 0.2);
  display: inline-block;
}

.color-name {
  font-size: 12px;
}

.upload-time {
  font-size: 12px;
  color: #666;
  margin-top: 8px;
}

.btn {
  width: 100%;
  padding: 12px 16px;
  border: none;
  border-radius: 8px;
  font-weight: 700;
  font-size: 14px;
  cursor: pointer;
  transition: all 0.2s ease;
  letter-spacing: 1px;
}

.btn-create {
  background: linear-gradient(90deg, var(--c-success) 0%, #10b981 100%);
  color: var(--c-white);
  margin-top: 16px;
}

.btn-create:hover {
  background: linear-gradient(90deg, var(--c-success-hover) 0%, #059669 100%);
  box-shadow: 0 4px 10px rgba(26, 126, 75, 0.3);
}

.btn-update {
  background: linear-gradient(90deg, var(--c-primary) 0%, #b91c1c 100%);
  color: var(--c-white);
  margin-top: 16px;
}

.btn-update:hover {
  background: linear-gradient(90deg, var(--c-hover) 0%, #b45309 100%);
  box-shadow: 0 4px 10px rgba(148, 57, 15, 0.3);
}

.products-list {
  max-width: 1200px;
  margin: 0 auto;
}
</style>
