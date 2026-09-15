<script setup lang="ts">
withDefaults(defineProps<{
  size?: 'sm' | 'md'
}>(), {
  size: 'md',
})
</script>

<template>
  <span
    class="app-spinner"
    :class="`app-spinner--${size}`"
    role="status"
    aria-label="Loading"
  />
</template>

<style scoped>
.app-spinner {
  display: inline-block;
  flex-shrink: 0;
  border-radius: 50%;
  border-style: solid;
  border-color: currentColor;
  border-right-color: transparent;
  animation: app-spinner-rotate 0.6s linear infinite;
}

.app-spinner--sm {
  width: 0.85rem;
  height: 0.85rem;
  border-width: 2px;
}

.app-spinner--md {
  width: 1.25rem;
  height: 1.25rem;
  border-width: 2px;
}

@keyframes app-spinner-rotate {
  to {
    transform: rotate(360deg);
  }
}
</style>
