type HttpMethod = 'get' | 'GET' | 'post' | 'POST' | 'put' | 'PUT' | 'delete' | 'DELETE' | 'patch' | 'PATCH' | 'head' | 'HEAD' | 'connect' | 'CONNECT' | 'options' | 'OPTIONS' | 'trace' | 'TRACE'

type ServiceType = 'auth' | 'base' | 'token' | 'settings'

export default function (url: string, service: ServiceType, method?: HttpMethod, body?: any, params?: any) {
  const config = useRuntimeConfig()
  const accessToken = useState<String>('accessToken').value

  const getServiceUrl = (type: ServiceType): string => {
    const serviceMap: Record<ServiceType, string> = {
      auth: config.public.authUrl,
      base: config.public.baseUrl,
      token: config.public.tokenUrl,
      settings: config.public.settingsUrl,
    }

    return serviceMap[type]
  }

  return $fetch(`${getServiceUrl(service)}/${url}`, {
    credentials: 'include',
    method: method ?? 'get',
    body,
    params,
    headers: { ...(accessToken ? { Authorization: `Bearer ${accessToken}` } : {}) },
  }).catch((err: any) => {
    return { error: err }
  })
}
