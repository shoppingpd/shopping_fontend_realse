<template>
  <div>
    <input type="file" @change="replaceFile" />
    <img v-if="imgUrl" :src="imgUrl" alt="上傳圖片" style="max-width: 300px; margin-top: 10px" />
  </div>
</template>

<script>
  export default {
    data() {
      return {
        imgUrl: null,
        oldFileName: null,
      };
    },
    methods: {
      async replaceFile(event) {
        const file = event.target.files[0];
        if (!file) return;

        const formData = new FormData();
        formData.append('file', file);
        if (this.oldFileName) formData.append('oldFileName', this.oldFileName);

        const res = await fetch('http://localhost:8080/files/upload', {
          method: 'POST',
          body: formData,
        });

        const fileUrl = await res.text();
        this.imgUrl = 'http://localhost:8080' + fileUrl;

        // 儲存新檔名，以便下次替換
        this.oldFileName = fileUrl.split('/').pop();
      },
    },
  };
</script>
