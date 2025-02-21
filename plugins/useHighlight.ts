import type { Directive, DirectiveBinding } from 'vue'
import type { WithPSChange } from '~/composables/usePSUtils'

interface HighlightOptions {
  classes?: {
    insert?: string | string[]
    update?: string | string[]
    delete?: string | string[]
  }
}

const defaultClasses = {
  insert: ['bg-blue-300'],
  update: ['bg-green-700', 'text-white'],
  delete: ['bg-red-300'],
}

const vHighlight: Directive<HTMLElement, WithPSChange> = {
  mounted(el, binding: DirectiveBinding<WithPSChange>) {
    updateHighlight(el, binding)
  },
  updated(el, binding: DirectiveBinding<WithPSChange>) {
    updateHighlight(el, binding)
  },
}

const updateHighlight = (el: HTMLElement, binding: DirectiveBinding<WithPSChange>) => {
  const value = binding.value
  const options = (binding.arg as HighlightOptions) || {}
  const classes = {
    insert: [...defaultClasses.insert, ...(Array.isArray(options?.classes?.insert) ? options.classes.insert : [options?.classes?.insert].filter(Boolean))],
    update: [...defaultClasses.update, ...(Array.isArray(options?.classes?.update) ? options.classes.update : [options?.classes?.update].filter(Boolean))],
    delete: [...defaultClasses.delete, ...(Array.isArray(options?.classes?.delete) ? options.classes.delete : [options?.classes?.delete].filter(Boolean))],
  }

  // Remove existing highlight classes
  Object.values(classes)
    .flat()
    .filter((cls): cls is string => typeof cls === 'string')
    .forEach((cls) => el.classList.remove(cls))

  // Only add highlight if there's a change and it's not old
  if (value?.$psChange && !value.$psChange.isOld && value.$psChange.type) {
    const changeType = value.$psChange.type as keyof typeof classes
    const highlightClasses = classes[changeType]
    if (highlightClasses) highlightClasses.filter((cls): cls is string => typeof cls === 'string').forEach((cls) => el.classList.add(cls))
  }
}

export default defineNuxtPlugin((nuxtApp) => {
  nuxtApp.vueApp.directive('highlight', vHighlight)
})
