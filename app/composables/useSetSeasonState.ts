export const useSeasonState = () => {
  const setSeason = async (seasonId: string) => {
    console.log('SETTING SEASON TO', seasonId)

    const season = useState<any>('season')
    if (!seasonId || season.value?.id === seasonId) return false

    const newSeason = (await usePopulatedSeason(seasonId)).data.value
    season.value = newSeason

    useHead({ meta: [{ name: 'theme-color', content: newSeason?.color || '#152038' }] })

    return true
  }

  return { setSeason }
}
