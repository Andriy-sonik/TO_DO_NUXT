import { createError } from 'h3'
import { vi } from 'vitest'

export const useDatabase = vi.fn()
export const readFormData = vi.fn()
export const getRouterParam = vi.fn()

vi.stubGlobal('defineEventHandler', (handler: unknown) => handler)
vi.stubGlobal('createError', createError)
vi.stubGlobal('readFormData', readFormData)
vi.stubGlobal('getRouterParam', getRouterParam)
vi.stubGlobal('useDatabase', useDatabase)
