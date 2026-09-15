import { describe, expect, it } from 'vitest'
import { mountSuspended } from '@nuxt/test-utils/runtime'
import AppSpinner from '~/components/AppSpinner.vue'

describe('AppSpinner', () => {
  it('exposes a loading status for assistive tech', async () => {
    const wrapper = await mountSuspended(AppSpinner)

    expect(wrapper.get('[role="status"]').attributes('aria-label')).toBe('Loading')
    expect(wrapper.classes()).toContain('app-spinner--md')
  })

  it('supports a small size', async () => {
    const wrapper = await mountSuspended(AppSpinner, {
      props: { size: 'sm' },
    })

    expect(wrapper.classes()).toContain('app-spinner--sm')
  })
})
