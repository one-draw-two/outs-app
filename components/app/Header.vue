<template>
  <div class="main-container flex gap-8 relative">
    <AppSeasonPicker />
    <AppStagePicker v-if="/(round|stage)/.test(useRoute().path)" />
    <AppUserButton />
  </div>
</template>

<script setup lang="ts"></script>
