type HttpMethod = 'get' | 'GET' | 'post' | 'POST' | 'put' | 'PUT' | 'delete' | 'DELETE' | 'patch' | 'PATCH' | 'head' | 'HEAD' | 'connect' | 'CONNECT' | 'options' | 'OPTIONS' | 'trace' | 'TRACE'

export default function (url: string, method?: HttpMethod, body?: any, params?: any, isAuth?: boolean) {
  const config = useRuntimeConfig()
  return $fetch(`${isAuth ? config.public.authUrl : config.public.serverUrl}/${url}`, {
    credentials: 'include',
    method: method ?? 'get',
    body,
    params,
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
      Origin: 'capacitor://localhost',
    },
  }).catch((err: any) => {
    console.log('asd')
    console.log(err)

    return { error: err }
  })
}
