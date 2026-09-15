export type ApiResult<T> = {
  data: T | null
  error: string | null
}

export async function apiFetch<T>(
  url: string,
  options?: Parameters<typeof $fetch>[1],
  fallbackMessage = 'Request failed',
): Promise<ApiResult<T>> {
  try {
    const data = await $fetch<T>(url, options as Parameters<typeof $fetch<T>>[1]) as T
    return { data, error: null }
  }
  catch (err) {
    console.error(err)
    return { data: null, error: fallbackMessage }
  }
}
