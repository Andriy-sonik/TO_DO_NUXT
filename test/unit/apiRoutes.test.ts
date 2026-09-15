import { describe, expect, it } from 'vitest'
import { API_ROUTES } from '~/utils/apiRoutes'

describe('API_ROUTES', () => {
  it('points to the notes endpoints', () => {
    expect(API_ROUTES.notes.get).toBe('/api/todoapp/GetNotes')
    expect(API_ROUTES.notes.add).toBe('/api/todoapp/AddNotes')
    expect(API_ROUTES.notes.delete('42')).toBe('/api/todoapp/DeleteNotes/42')
  })
})
