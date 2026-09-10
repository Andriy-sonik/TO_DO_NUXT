import type { Note } from '~/types/note'

export function useNotes() {
  const message = ref('Hello Vue! 111')
  const notes = ref<Note[]>([])
  const newNote = ref('test111111')
  const pending = ref(false)
  const error = ref<string | null>(null)

  const getNotes = async () => {
    pending.value = true
    error.value = null

    try {
      notes.value = await $fetch<Note[]>('/api/todoapp/GetNotes')
    }
    catch (err) {
      error.value = 'Failed to load notes'
      console.error(err)
    }
    finally {
      pending.value = false
    }
  }

  const addNotes = async () => {
    pending.value = true
    error.value = null

    try {
      const formData = new FormData()
      formData.append('newNotes', newNote.value)
      await $fetch('/api/todoapp/AddNotes', {
        method: 'POST',
        body: formData,
      })
      await getNotes()
    }
    catch (err) {
      error.value = 'Failed to add note'
      console.error(err)
    }
    finally {
      pending.value = false
    }
  }

  const deleteNotes = async (id: string) => {
    pending.value = true
    error.value = null

    try {
      await $fetch(`/api/todoapp/DeleteNotes/${id}`, {
        method: 'DELETE',
      })
      await getNotes()
    }
    catch (err) {
      error.value = 'Failed to delete note'
      console.error(err)
    }
    finally {
      pending.value = false
    }
  }

  return {
    message,
    notes,
    newNote,
    pending,
    error,
    getNotes,
    addNotes,
    deleteNotes,
  }
}
