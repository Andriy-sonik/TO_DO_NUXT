import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { apiFetch } from '~/utils/apiFetch'

describe('apiFetch', () => {
  const $fetch = vi.fn()

  beforeEach(() => {
    vi.stubGlobal('$fetch', $fetch)
    vi.spyOn(console, 'error').mockImplementation(() => {})
  })

  afterEach(() => {
    $fetch.mockReset()
    vi.restoreAllMocks()
  })

  it('returns data when the request succeeds', async () => {
    $fetch.mockResolvedValue([{ id: '1', desc: 'Buy milk' }])

    const result = await apiFetch('/api/todoapp/GetNotes')

    expect($fetch).toHaveBeenCalledWith('/api/todoapp/GetNotes', undefined)
    expect(result).toEqual({
      data: [{ id: '1', desc: 'Buy milk' }],
      error: null,
    })
  })

  it('returns a fallback error when the request fails', async () => {
    $fetch.mockRejectedValue(new Error('network down'))

    const result = await apiFetch('/api/todoapp/GetNotes', undefined, 'Failed to load notes')

    expect(console.error).toHaveBeenCalled()
    expect(result).toEqual({
      data: null,
      error: 'Failed to load notes',
    })
  })

  it('uses a default error message when none is provided', async () => {
    $fetch.mockRejectedValue(new Error('network down'))

    const result = await apiFetch('/broken')

    expect(result.error).toBe('Request failed')
  })
})
