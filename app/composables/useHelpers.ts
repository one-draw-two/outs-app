export const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms))

export const wecl = (item: any, pre?: string) => watchEffect(() => ((v) => v && console.log(pre ?? '', v))(isRef(item) ? item.value : item))

export const getSanityUrl = (key: string, resString?: string) => (key ? `https://cdn.sanity.io/images/z39cg3sc/production/${key}-${resString ?? '1024x1024'}.png` : '')

export const getNestedValue = (obj: any, path: string): any => path.split('.').reduce((current, key) => (current && current[key] !== undefined ? current[key] : undefined), obj)
