type HttpMethod = 'get' | 'GET' | 'post' | 'POST' | 'put' | 'PUT' | 'delete' | 'DELETE' | 'patch' | 'PATCH' | 'head' | 'HEAD' | 'connect' | 'CONNECT' | 'options' | 'OPTIONS' | 'trace' | 'TRACE'

export default function (url: string, target: string, method?: HttpMethod, body?: any, params?: any) {
  const config = useRuntimeConfig()
  return $fetch(`${target === 'auth' ? config.public.authUrl : config.public.baseUrl}/${url}`, {
    credentials: 'include',
    method: method ?? 'get',
    body,
    params,
    headers: {
      Accept: 'application/json', // Add this
      ...(body ? { 'Content-Type': 'application/json' } : {}), // Only add Content-Type when there's a body
    },
  }).catch((err: any) => {
    return { error: err }
  })
}
