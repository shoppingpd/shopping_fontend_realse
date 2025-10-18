import { defineStore } from 'pinia';

export const useUserStore = defineStore('user', {
  state: () => ({
    id: null,
    name: null,
  }),
  actions: {
    setUser(data) {
      this.id = data.id;
      this.name = data.name;
    },
    clearUser() {
      this.id = null;
      this.name = 'root';
    },
  },
  persist: true, // ⚠️ persist 要放在這裡，不能放在 state 裡
});
