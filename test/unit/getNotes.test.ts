import { beforeEach, describe, expect, it, vi } from 'vitest'
import { useDatabase } from './nitro'
import getNotes from '../../server/api/todoapp/GetNotes.get'

function mockCollection(notes: unknown[] = []) {
  const toArray = vi.fn().mockResolvedValue(notes)
  const collection = vi.fn().mockReturnValue({
    find: vi.fn().mockReturnValue({ toArray }),
  })

  useDatabase.mockResolvedValue({ collection })

  return { collection, toArray }
}

describe('GET /api/todoapp/GetNotes', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    vi.spyOn(console, 'error').mockImplementation(() => {})
  })

  it('returns every note from the collection', async () => {
    const notes = [{ id: '1', desc: 'Buy milk' }]
    const { collection, toArray } = mockCollection(notes)

    await expect(getNotes({} as never)).resolves.toEqual(notes)
    expect(collection).toHaveBeenCalledWith('todocollectiuon')
    expect(toArray).toHaveBeenCalled()
  })

  it('throws a 500 error when the database fails', async () => {
    useDatabase.mockRejectedValue(new Error('no db'))

    await expect(getNotes({} as never)).rejects.toMatchObject({
      statusCode: 500,
      statusMessage: 'Internal Server Error',
    })
    expect(console.error).toHaveBeenCalled()
  })
})
