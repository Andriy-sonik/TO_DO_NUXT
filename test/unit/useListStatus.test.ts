import { describe, expect, it } from 'vitest'
import { ref } from 'vue'
import { LIST_STATUS, useListStatus } from '~/composables/useListStatus'

describe('useListStatus', () => {
  it('is pending while loading, even if items already exist', () => {
    const status = useListStatus(true, [{ id: '1' }])

    expect(status.value).toBe(LIST_STATUS.pending)
  })

  it('is empty when loading is finished and there are no items', () => {
    const status = useListStatus(false, [])

    expect(status.value).toBe(LIST_STATUS.empty)
  })

  it('is ready when loading is finished and there are items', () => {
    const status = useListStatus(ref(false), ref([{ id: '1' }]))

    expect(status.value).toBe(LIST_STATUS.ready)
  })

  it('reacts when pending or items change', () => {
    const pending = ref(true)
    const items = ref<unknown[]>([])
    const status = useListStatus(pending, items)

    expect(status.value).toBe(LIST_STATUS.pending)

    pending.value = false
    expect(status.value).toBe(LIST_STATUS.empty)

    items.value = [{ id: '1' }]
    expect(status.value).toBe(LIST_STATUS.ready)
  })
})
