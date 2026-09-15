import { describe, expect, it } from 'vitest'
import { mountSuspended } from '@nuxt/test-utils/runtime'
import AppButton from '~/components/AppButton.vue'

describe('AppButton', () => {
  it('renders the slot content', async () => {
    const wrapper = await mountSuspended(AppButton, {
      slots: { default: () => 'Save' },
    })

    expect(wrapper.get('button').text()).toContain('Save')
    expect(wrapper.get('button').attributes('type')).toBe('button')
  })

  it('disables the button when loading', async () => {
    const wrapper = await mountSuspended(AppButton, {
      props: { loading: true },
      slots: { default: () => 'Save' },
    })

    expect(wrapper.get('button').attributes('disabled')).toBeDefined()
    expect(wrapper.get('button').attributes('aria-busy')).toBe('true')
    expect(wrapper.get('[role="status"]').exists()).toBe(true)
  })

  it('disables the button when disabled is set', async () => {
    const wrapper = await mountSuspended(AppButton, {
      props: { disabled: true },
    })

    expect(wrapper.get('button').attributes('disabled')).toBeDefined()
  })
})
