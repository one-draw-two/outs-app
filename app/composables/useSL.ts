export default function (to: string) {
  // useSL => useSeasonLink
  return `/season/${useRuntimeConfig().public.cBPSsn}/${to}`
}
