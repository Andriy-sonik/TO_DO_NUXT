import { beforeEach, describe, expect, it, vi } from 'vitest'
import { API_ROUTES } from '~/utils/apiRoutes'
import { apiFetch } from '~/utils/apiFetch'
import { LIST_STATUS } from '~/composables/useListStatus'
import { useNotes } from '~/composables/useNotes'

vi.mock('~/utils/apiFetch', () => ({
  apiFetch: vi.fn(),
}))

const mockedApiFetch = vi.mocked(apiFetch)

describe('useNotes', () => {
  beforeEach(() => {
    mockedApiFetch.mockReset()
  })

  it('loads notes and clears the error on success', async () => {
    mockedApiFetch.mockResolvedValue({
      data: [{ id: '1', desc: 'Buy milk' }],
      error: null,
    })

    const { notes, error, getPending, listStatus, getNotes } = useNotes()

    expect(getPending.value).toBe(true)
    expect(listStatus.value).toBe(LIST_STATUS.pending)

    const request = getNotes()
    expect(getPending.value).toBe(true)

    await request

    expect(mockedApiFetch).toHaveBeenCalledWith(
      API_ROUTES.notes.get,
      undefined,
      'Failed to load notes',
    )
    expect(notes.value).toEqual([{ id: '1', desc: 'Buy milk' }])
    expect(error.value).toBeNull()
    expect(getPending.value).toBe(false)
    expect(listStatus.value).toBe(LIST_STATUS.ready)
  })

  it('treats a successful empty payload as no notes', async () => {
    mockedApiFetch.mockResolvedValue({
      data: null,
      error: null,
    })

    const { notes, error, listStatus, getNotes } = useNotes()

    await getNotes()

    expect(notes.value).toEqual([])
    expect(error.value).toBeNull()
    expect(listStatus.value).toBe(LIST_STATUS.empty)
  })

  it('keeps existing notes and stores an error when loading fails', async () => {
    mockedApiFetch.mockResolvedValue({
      data: null,
      error: 'Failed to load notes',
    })

    const { notes, error, getPending, listStatus, getNotes } = useNotes()
    notes.value = [{ id: '1', desc: 'Keep me' }]

    await getNotes()

    expect(notes.value).toEqual([{ id: '1', desc: 'Keep me' }])
    expect(error.value).toBe('Failed to load notes')
    expect(getPending.value).toBe(false)
    expect(listStatus.value).toBe(LIST_STATUS.ready)
  })

  it('clears pending even when the request throws', async () => {
    mockedApiFetch.mockRejectedValue(new Error('boom'))

    const { getPending, getNotes } = useNotes()

    await expect(getNotes()).rejects.toThrow('boom')
    expect(getPending.value).toBe(false)
  })

  it('adds a note, clears the input, and reloads the list', async () => {
    mockedApiFetch
      .mockResolvedValueOnce({ data: 'Successfully added', error: null })
      .mockResolvedValueOnce({
        data: [{ id: '1', desc: 'New note' }],
        error: null,
      })

    const { newNote, addPending, error, notes, addNotes } = useNotes()
    newNote.value = 'New note'

    await addNotes()

    expect(mockedApiFetch).toHaveBeenNthCalledWith(
      1,
      API_ROUTES.notes.add,
      expect.objectContaining({ method: 'POST' }),
      'Failed to add note',
    )

    const addCall = mockedApiFetch.mock.calls[0]
    const body = addCall[1]?.body as FormData
    expect(body.get('newNotes')).toBe('New note')

    expect(newNote.value).toBe('')
    expect(error.value).toBeNull()
    expect(addPending.value).toBe(false)
    expect(notes.value).toEqual([{ id: '1', desc: 'New note' }])
  })

  it('does not clear the input when adding a note fails', async () => {
    mockedApiFetch.mockResolvedValue({
      data: null,
      error: 'Failed to add note',
    })

    const { newNote, addNotes, error } = useNotes()
    newNote.value = 'Keep this text'

    await addNotes()

    expect(newNote.value).toBe('Keep this text')
    expect(error.value).toBe('Failed to add note')
    expect(mockedApiFetch).toHaveBeenCalledTimes(1)
  })

  it('deletes a note and reloads the list', async () => {
    mockedApiFetch
      .mockResolvedValueOnce({ data: 'Successfully deleted', error: null })
      .mockResolvedValueOnce({ data: [], error: null })

    const { notes, deletePending, listStatus, deleteNotes } = useNotes()

    await deleteNotes('1')

    expect(mockedApiFetch).toHaveBeenNthCalledWith(
      1,
      API_ROUTES.notes.delete('1'),
      { method: 'DELETE' },
      'Failed to delete note',
    )
    expect(notes.value).toEqual([])
    expect(deletePending.value).toBe(false)
    expect(listStatus.value).toBe(LIST_STATUS.empty)
  })

  it('stores an error when deleting a note fails', async () => {
    mockedApiFetch.mockResolvedValue({
      data: null,
      error: 'Failed to delete note',
    })

    const { error, deleteNotes } = useNotes()

    await deleteNotes('missing')

    expect(error.value).toBe('Failed to delete note')
    expect(mockedApiFetch).toHaveBeenCalledTimes(1)
  })
})
