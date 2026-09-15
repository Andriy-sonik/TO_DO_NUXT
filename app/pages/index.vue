<script setup lang="ts">
import { LIST_STATUS } from '~/composables/useListStatus'

const {
  message,
  notes,
  newNote,
  error,
  getPending,
  addPending,
  deletePending,
  listStatus,
  getNotes,
  addNotes,
  deleteNotes,
} = useNotes()

onMounted(() => {
  getNotes()
})
</script>

<template>
  <div class="todo-app">
    <h1>{{ message }}</h1>

    <p v-if="error" class="error">
      {{ error }}
    </p>

    <p v-if="listStatus === LIST_STATUS.pending" class="list-loading">
      <AppSpinner />
    </p>
    <p v-else-if="listStatus === LIST_STATUS.empty">
      No notes yet.
    </p>
    <ul v-else>
      <li v-for="note in notes" :key="note.id">
        {{ note.desc }}
        <AppButton :loading="deletePending" @click="deleteNotes(note.id)">
          delete
        </AppButton>
      </li>
    </ul>

    <div class="actions">
      <AppInput v-model="newNote" placeholder="New note" />
      <AppButton :loading="getPending" @click="getNotes">
        get notes
      </AppButton>
      <AppButton :loading="addPending" @click="addNotes">
        add notes
      </AppButton>
    </div>
  </div>
</template>

<style scoped>
.todo-app {
  max-width: 640px;
  margin: 2rem auto;
  padding: 0 1rem;
  font-family: system-ui, sans-serif;
}

.error {
  color: #b00020;
}

ul {
  list-style: none;
  padding: 0;
}

li {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1rem;
  padding: 0.75rem 0;
  border-bottom: 1px solid #e5e5e5;
}

.actions {
  display: flex;
  gap: 0.5rem;
  margin-top: 1rem;
}

.list-loading {
  display: flex;
  justify-content: center;
  padding: 1.5rem 0;
}
</style>
