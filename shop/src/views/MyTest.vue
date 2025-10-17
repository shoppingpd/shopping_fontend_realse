<template>
  <div>
    <input type="file" @change="uploadFile" />
    <img v-if="imgUrl" :src="imgUrl" alt="上傳圖片" style="max-width: 300px; margin-top: 10px;">
  </div>
</template>

<script>
export default {
  data() {
    return {
      imgUrl: null
    };
  },
  methods: {
    async uploadFile(event) {
      const file = event.target.files[0];
      const formData = new FormData();
      formData.append("file", file);

      const res = await fetch("http://localhost:8080/files/upload", {
        method: "POST",
        body: formData
      });

      const fileUrl = await res.text();
      this.imgUrl = "http://localhost:8080" + fileUrl;  // 直接用返回的 URL 顯示
    }
  }
}
</script>
