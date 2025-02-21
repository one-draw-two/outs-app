export const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms))

export const wecl = (item: any, pre?: string) => watchEffect(() => console.log(pre ?? '', item?.value ?? item ?? 'WECL item N/A'))

export const getSanityUrl = (key: string) => `https://cdn.sanity.io/images/z39cg3sc/production/${key}-1024x1024.png`
