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
    :class="{ 'app-button--loading': loading }"
    :type="type"
    :disabled="isDisabled"
    :aria-busy="loading"
  >
    <span v-if="loading" class="app-button__spinner">
      <AppSpinner size="sm" />
    </span>
    <span class="app-button__label">
      <slot />
    </span>
  </button>
</template>

<style scoped>
.app-button {
  position: relative;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  box-sizing: border-box;
  cursor: pointer;
}

.app-button__spinner {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
}

.app-button--loading .app-button__label {
  visibility: hidden;
}

.app-button:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}
</style>
