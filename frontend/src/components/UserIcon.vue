<template>
  <div class="user-icon-container" @click="toggleDropdown">
    <img src="@/assets/user-icon.png" alt="User Icon" class="user-icon" />
    <img src="@/assets/down-arrow.png" alt="Dropdown Arrow" class="dropdown-arrow" />
    <div v-if="showDropdown" class="dropdown">
      <button @click="logout">Logout</button>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      showDropdown: false
    };
  },
  methods: {
    toggleDropdown() {
      this.showDropdown = !this.showDropdown;
    },
    logout() {
      localStorage.removeItem('isAuthenticated');
      this.$router.push('/');
    }
  }
};
</script>

<style scoped>
.user-icon-container {
  position: relative;
  display: flex;
  align-items: center;
  cursor: pointer;
}

.user-icon {
  width: 40px;
  height: 40px;
  border-radius: 50%;
}

.dropdown-arrow {
  width: 12px;
  margin-left: 4px;
}

.dropdown {
  position: absolute;
  right: 0;
  top: 50px;
  background-color: rgb(30, 31, 45)white;
  border: 1px solid rgb(122, 137, 159);
  border-radius: 5px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  padding: 10px;
  z-index: 100;
}

.dropdown button {
  background-color: rgb(30, 31, 45); 
  color: white;
  border: none;
  cursor: pointer;
}
</style>
