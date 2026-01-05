<template>
  <div class="app-root">
    <AppHeader />

    <main class="app-main">
      <router-view />
    </main>
  </div>

</template>

<script setup>
import AppHeader from './layout/Header.vue'
</script>

<style>
.app-root 
{
    min-height: 100vh;
}

.app-main 
{
  flex: 1;
  max-width: 1200px;
  margin: 0 auto;
  padding: 16px;
  padding-top: 80px;
}
</style>
