import { describe, expect, it } from 'vitest'
import { mountSuspended } from '@nuxt/test-utils/runtime'
import AppInput from '~/components/AppInput.vue'

describe('AppInput', () => {
  it('binds v-model and the placeholder', async () => {
    const wrapper = await mountSuspended(AppInput, {
      props: {
        modelValue: 'Buy milk',
        placeholder: 'New note',
      },
    })

    const input = wrapper.get('input')
    expect(input.element.value).toBe('Buy milk')
    expect(input.attributes('placeholder')).toBe('New note')

    await input.setValue('Walk the dog')
    expect(wrapper.emitted('update:modelValue')?.[0]).toEqual(['Walk the dog'])
  })

  it('can be disabled', async () => {
    const wrapper = await mountSuspended(AppInput, {
      props: { disabled: true },
    })

    expect(wrapper.get('input').attributes('disabled')).toBeDefined()
  })
})
