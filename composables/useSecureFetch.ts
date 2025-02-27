type HttpMethod = 'get' | 'GET' | 'post' | 'POST' | 'put' | 'PUT' | 'delete' | 'DELETE' | 'patch' | 'PATCH' | 'head' | 'HEAD' | 'connect' | 'CONNECT' | 'options' | 'OPTIONS' | 'trace' | 'TRACE'

export default function (url: string, target: string, method?: HttpMethod, body?: any, params?: any) {
  console.log('im here')
  console.log(useState<String>('accessToken').value)

  const config = useRuntimeConfig()
  const accessToken = useState<String>('accessToken').value
  return $fetch(`${target === 'auth' ? config.public.authUrl : config.public.baseUrl}/${url}`, {
    credentials: 'include',
    method: method ?? 'get',
    body,
    params,
    headers: { ...(accessToken ? { Authorization: `Bearer ${accessToken}` } : {}) },
  }).catch((err: any) => {
    return { error: err }
  })
}
