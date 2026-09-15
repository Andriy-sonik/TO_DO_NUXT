import { beforeEach, describe, expect, it, vi } from 'vitest'
import { flushPromises } from '@vue/test-utils'
import { mountSuspended } from '@nuxt/test-utils/runtime'
import { apiFetch } from '~/utils/apiFetch'
import IndexPage from '~/pages/index.vue'

vi.mock('~/utils/apiFetch', () => ({
  apiFetch: vi.fn(),
}))

const mockedApiFetch = vi.mocked(apiFetch)

describe('index page', () => {
  beforeEach(() => {
    mockedApiFetch.mockReset()
  })

  it('shows a spinner while notes are loading', async () => {
    mockedApiFetch.mockReturnValue(new Promise(() => {}))

    const wrapper = await mountSuspended(IndexPage)

    expect(wrapper.get('.list-loading').exists()).toBe(true)
    expect(wrapper.get('[role="status"]').exists()).toBe(true)
  })

  it('shows an empty state when there are no notes', async () => {
    mockedApiFetch.mockResolvedValue({ data: [], error: null })

    const wrapper = await mountSuspended(IndexPage)
    await flushPromises()

    expect(wrapper.text()).toContain('No notes yet.')
  })

  it('renders notes and can delete one', async () => {
    mockedApiFetch
      .mockResolvedValueOnce({
        data: [{ id: '1', desc: 'Buy milk' }],
        error: null,
      })
      .mockResolvedValueOnce({ data: 'Successfully deleted', error: null })
      .mockResolvedValueOnce({ data: [], error: null })

    const wrapper = await mountSuspended(IndexPage)
    await flushPromises()

    expect(wrapper.text()).toContain('Buy milk')

    await wrapper.get('li button').trigger('click')
    await flushPromises()

    expect(wrapper.text()).toContain('No notes yet.')
  })

  it('shows an error when loading fails', async () => {
    mockedApiFetch.mockResolvedValue({
      data: null,
      error: 'Failed to load notes',
    })

    const wrapper = await mountSuspended(IndexPage)
    await flushPromises()

    expect(wrapper.get('.error').text()).toBe('Failed to load notes')
  })

  it('adds a note from the input', async () => {
    mockedApiFetch
      .mockResolvedValueOnce({ data: [], error: null })
      .mockResolvedValueOnce({ data: 'Successfully added', error: null })
      .mockResolvedValueOnce({
        data: [{ id: '1', desc: 'Walk the dog' }],
        error: null,
      })

    const wrapper = await mountSuspended(IndexPage)
    await flushPromises()

    await wrapper.get('input').setValue('Walk the dog')
    const buttons = wrapper.findAll('.actions button')
    await buttons[1].trigger('click')
    await flushPromises()

    expect(wrapper.text()).toContain('Walk the dog')
  })
})
