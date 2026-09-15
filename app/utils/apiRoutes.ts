export const API_ROUTES = {
  notes: {
    get: '/api/todoapp/GetNotes',
    add: '/api/todoapp/AddNotes',
    delete: (id: string) => `/api/todoapp/DeleteNotes/${id}`,
  },
} as const
