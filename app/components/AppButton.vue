<script setup lang="ts">
const props = withDefaults(defineProps<{
  disabled?: boolean
  loading?: boolean
  type?: 'button' | 'submit' | 'reset'
}>(), {
  type: 'button',
})

const isDisabled = computed(() => props.disabled || props.loading)
</script>

<template>
  <button
    class="app-button"
    :type="type"
    :disabled="isDisabled"
    :aria-busy="loading"
  >
    <AppSpinner v-if="loading" size="sm" />
    <span class="app-button__label">
      <slot />
    </span>
  </button>
</template>

<style scoped>
.app-button {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 0.4rem;
  cursor: pointer;
}

.app-button:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}
</style>
