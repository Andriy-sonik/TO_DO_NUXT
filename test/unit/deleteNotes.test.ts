import { beforeEach, describe, expect, it, vi } from 'vitest'
import { getRouterParam, useDatabase } from './nitro'
import deleteNotes from '../../server/api/todoapp/DeleteNotes/[id].delete'

function mockCollection(deletedCount: number) {
  const deleteOne = vi.fn().mockResolvedValue({ deletedCount })
  const collection = vi.fn().mockReturnValue({ deleteOne })

  useDatabase.mockResolvedValue({ collection })

  return { collection, deleteOne }
}

describe('DELETE /api/todoapp/DeleteNotes/:id', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    vi.spyOn(console, 'error').mockImplementation(() => {})
  })

  it('rejects a missing id', async () => {
    getRouterParam.mockReturnValue(undefined)

    await expect(deleteNotes({} as never)).rejects.toMatchObject({
      statusCode: 400,
      statusMessage: 'Note id is required',
    })
    expect(useDatabase).not.toHaveBeenCalled()
  })

  it('deletes a note by id', async () => {
    getRouterParam.mockReturnValue('7')
    const { collection, deleteOne } = mockCollection(1)

    await expect(deleteNotes({} as never)).resolves.toBe('Successfully deleted')
    expect(collection).toHaveBeenCalledWith('todocollectiuon')
    expect(deleteOne).toHaveBeenCalledWith({ id: '7' })
  })

  it('throws 404 when the note does not exist', async () => {
    getRouterParam.mockReturnValue('missing')
    mockCollection(0)

    await expect(deleteNotes({} as never)).rejects.toMatchObject({
      statusCode: 404,
      statusMessage: 'Note not found',
    })
  })

  it('throws a 500 error for unexpected failures', async () => {
    getRouterParam.mockReturnValue('7')
    useDatabase.mockRejectedValue(new Error('no db'))

    await expect(deleteNotes({} as never)).rejects.toMatchObject({
      statusCode: 500,
      statusMessage: 'Internal Server Error',
    })
    expect(console.error).toHaveBeenCalled()
  })
})
