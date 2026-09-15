export const LIST_STATUS = {
  pending: 'pending',
  empty: 'empty',
  ready: 'ready',
} as const

export type ListStatus = typeof LIST_STATUS[keyof typeof LIST_STATUS]

export function useListStatus(
  pending: MaybeRefOrGetter<boolean>,
  items: MaybeRefOrGetter<readonly unknown[]>,
) {
  return computed<ListStatus>(() => {
    if (toValue(pending)) {
      return LIST_STATUS.pending
    }

    if (!toValue(items).length) {
      return LIST_STATUS.empty
    }

    return LIST_STATUS.ready
  })
}
