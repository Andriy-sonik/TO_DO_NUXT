import type { Note } from '~/types/note'
import { API_ROUTES } from '~/utils/apiRoutes'
import { apiFetch } from '~/utils/apiFetch'
import { useListStatus } from './useListStatus'

export function useNotes() {
  const message = ref('Hello Vue! 111')
  const notes = ref<Note[]>([])
  const newNote = ref('test111111')
  const error = ref<string | null>(null)

  const getPending = ref(true)
  const addPending = ref(false)
  const deletePending = ref(false)

  const listStatus = useListStatus(getPending, notes)

  const getNotes = async () => {
    getPending.value = true

    try {
      const result = await apiFetch<Note[]>(
        API_ROUTES.notes.get,
        undefined,
        'Failed to load notes',
      )

      if (result.error) {
        error.value = result.error
        return
      }

      notes.value = result.data ?? []
      error.value = null
    }
    finally {
      getPending.value = false
    }
  }

  const addNotes = async () => {
    addPending.value = true

    try {
      const formData = new FormData()
      formData.append('newNotes', newNote.value)

      const result = await apiFetch<Note>(
        API_ROUTES.notes.add,
        {
          method: 'POST',
          body: formData,
        },
        'Failed to add note',
      )

      if (result.error) {
        error.value = result.error
        return
      }

      if (result.data) {
        notes.value.push(result.data)
      }

      newNote.value = ''
      error.value = null
    }
    finally {
      addPending.value = false
    }
  }

  const deleteNotes = async (id: string) => {
    deletePending.value = true

    try {
      const result = await apiFetch(
        API_ROUTES.notes.delete(id),
        { method: 'DELETE' },
        'Failed to delete note',
      )

      if (result.error) {
        error.value = result.error
        return
      }

      notes.value = notes.value.filter(note => note.id !== id)
      error.value = null
    }
    finally {
      deletePending.value = false
    }
  }

  return {
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
  }
}
