import { beforeEach, describe, expect, it, vi } from 'vitest'
import { readFormData, useDatabase } from './nitro'
import addNotes from '../../server/api/todoapp/AddNotes.post'

function mockCollection(overrides: Record<string, unknown> = {}) {
  const collectionApi = {
    countDocuments: vi.fn().mockResolvedValue(2),
    insertOne: vi.fn().mockResolvedValue({ insertedId: 'abc' }),
    ...overrides,
  }
  const collection = vi.fn().mockReturnValue(collectionApi)

  useDatabase.mockResolvedValue({ collection })

  return { collection, collectionApi }
}

describe('POST /api/todoapp/AddNotes', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    vi.spyOn(console, 'error').mockImplementation(() => {})
  })

  it('rejects an empty note', async () => {
    const formData = new FormData()
    formData.append('newNotes', '   ')
    readFormData.mockResolvedValue(formData)

    await expect(addNotes({} as never)).rejects.toMatchObject({
      statusCode: 400,
      statusMessage: 'newNotes is required',
    })
    expect(useDatabase).not.toHaveBeenCalled()
  })

  it('inserts a note with the next numeric id', async () => {
    const formData = new FormData()
    formData.append('newNotes', 'Buy milk')
    readFormData.mockResolvedValue(formData)
    const { collection, collectionApi } = mockCollection()

    await expect(addNotes({} as never)).resolves.toBe('Successfully added')
    expect(collection).toHaveBeenCalledWith('todocollectiuon')
    expect(collectionApi.countDocuments).toHaveBeenCalled()
    expect(collectionApi.insertOne).toHaveBeenCalledWith({
      id: '3',
      desc: 'Buy milk',
    })
  })

  it('throws a 500 error for unexpected failures', async () => {
    const formData = new FormData()
    formData.append('newNotes', 'Buy milk')
    readFormData.mockResolvedValue(formData)
    useDatabase.mockRejectedValue(new Error('no db'))

    await expect(addNotes({} as never)).rejects.toMatchObject({
      statusCode: 500,
      statusMessage: 'Internal Server Error',
    })
    expect(console.error).toHaveBeenCalled()
  })
})
