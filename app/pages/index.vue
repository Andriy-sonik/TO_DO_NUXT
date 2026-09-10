<script setup lang="ts">
const {
  message,
  notes,
  newNote,
  pending,
  error,
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

    <ul>
      <li v-for="note in notes" :key="note.id">
        {{ note.desc }}
        <button :disabled="pending" @click="deleteNotes(note.id)">
          delete
        </button>
      </li>
    </ul>

    <div class="actions">
      <input v-model="newNote" type="text" placeholder="New note">
      <button :disabled="pending" @click="getNotes">
        get notes
      </button>
      <button :disabled="pending" @click="addNotes">
        add notes
      </button>
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

input {
  flex: 1;
  padding: 0.5rem;
}

button {
  cursor: pointer;
}

button:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}
</style>
