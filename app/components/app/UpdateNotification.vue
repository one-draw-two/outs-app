<template>
  <div v-if="updateAvailable" class="update-notification">
    <div class="update-content">
      <div class="update-icon">
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <path d="M21 2v6h-6"></path>
          <path d="M3 12a9 9 0 0 1 15-6.7L21 8"></path>
          <path d="M3 12a9 9 0 0 0 6.7 15L13 21"></path>
          <path d="M14 18H8"></path>
          <path d="M18 14v6"></path>
        </svg>
      </div>
      <div class="update-message">
        <strong>Update Available</strong>
        <p>A new version ({{ swVersion }}) is available</p>
      </div>
      <button @click="applyUpdate" class="update-button">Update Now</button>
    </div>
  </div>
</template>

<script setup lang="ts">
const { swVersion, updateAvailable, applyUpdate } = useAppVersion()
</script>

<style scoped>
.update-notification {
  position: fixed;
  bottom: 20px;
  left: 20px;
  z-index: 9999;
  background-color: #2563eb;
  color: white;
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  max-width: 320px;
  overflow: hidden;
  animation: slide-in 0.3s ease-out;
}

@keyframes slide-in {
  from {
    transform: translateY(100px);
    opacity: 0;
  }
  to {
    transform: translateY(0);
    opacity: 1;
  }
}

.update-content {
  display: flex;
  align-items: center;
  padding: 12px 16px;
}

.update-icon {
  margin-right: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.update-message {
  flex: 1;
}

.update-message strong {
  display: block;
  font-size: 14px;
  margin-bottom: 2px;
}

.update-message p {
  margin: 0;
  font-size: 12px;
  opacity: 0.9;
}

.update-button {
  background-color: white;
  color: #2563eb;
  border: none;
  border-radius: 4px;
  padding: 6px 12px;
  font-size: 12px;
  font-weight: 500;
  cursor: pointer;
  margin-left: 8px;
  transition: background-color 0.2s;
}

.update-button:hover {
  background-color: #f8fafc;
}
</style>
