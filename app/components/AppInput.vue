<script setup lang="ts">
const model = defineModel<string>({ default: '' })

withDefaults(defineProps<{
  type?: string
  placeholder?: string
  disabled?: boolean
}>(), {
  type: 'text',
})
</script>

<template>
  <input
    v-model="model"
    class="app-input"
    :type="type"
    :placeholder="placeholder"
    :disabled="disabled"
  >
</template>

<style scoped>
.app-input {
  flex: 1;
  padding: 0.5rem;
}
</style>
