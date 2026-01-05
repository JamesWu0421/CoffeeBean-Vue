<template>
  <header class="app-header">
    <nav class="nav-links">
      <router-link to="/country">國家管理</router-link>
      <router-link to="/process-method">處理法管理</router-link>
      <router-link to="/bean-merchant">豆商管理</router-link>
      <router-link to="/green-bean">生豆資訊</router-link>
      <router-link to="/stock">庫存管理</router-link>
      <router-link to="/roast">烘焙紀錄</router-link>
    </nav>
  </header>
</template>
<script setup>
</script>
<style scoped>
.app-header {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  z-index: 1000;
  background-color: rgb(36, 60, 82);
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 8px 35px 8px 12px;
  box-sizing: border-box;
}

.nav-links {
  display: flex;
  align-items: center;
  gap: 10px;
}

.nav-links a {
  font-weight: 300;
  letter-spacing: 0.1em;
  margin-left: 18px;
  text-decoration: none;
  color: #ffffff;
  background: none;
  border: none;
  cursor: pointer;
  font-size: 14px;
}

.nav-links a:hover {
  text-decoration: underline;
}
</style>
