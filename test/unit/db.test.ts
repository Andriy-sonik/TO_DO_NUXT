import { beforeEach, describe, expect, it, vi } from 'vitest'
import { MongoClient } from 'mongodb'

vi.mock('mongodb', () => ({
  MongoClient: {
    connect: vi.fn(),
  },
}))

describe('useDatabase', () => {
  beforeEach(() => {
    vi.resetModules()
    vi.clearAllMocks()
  })

  it('throws when the MongoDB URI is missing', async () => {
    vi.stubGlobal('useRuntimeConfig', () => ({
      mongodbUri: '',
      mongodbDbName: 'to_do_app',
    }))

    const { useDatabase } = await import('../../../server/utils/db')

    await expect(useDatabase()).rejects.toMatchObject({
      statusCode: 500,
      statusMessage: 'MongoDB URI is not configured',
    })
    expect(MongoClient.connect).not.toHaveBeenCalled()
  })

  it('connects once and reuses the same database', async () => {
    const db = { collection: vi.fn() }
    vi.mocked(MongoClient.connect).mockResolvedValue({
      db: vi.fn().mockReturnValue(db),
    } as never)

    vi.stubGlobal('useRuntimeConfig', () => ({
      mongodbUri: 'mongodb://localhost:27017',
      mongodbDbName: 'to_do_app',
    }))

    const { useDatabase } = await import('../../../server/utils/db')

    await expect(useDatabase()).resolves.toBe(db)
    await expect(useDatabase()).resolves.toBe(db)
    expect(MongoClient.connect).toHaveBeenCalledTimes(1)
    expect(MongoClient.connect).toHaveBeenCalledWith('mongodb://localhost:27017')
  })
})
