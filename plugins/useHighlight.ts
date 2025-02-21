import type { Directive, DirectiveBinding } from 'vue'
import type { WithPSChange } from '~/composables/usePSUtils'

interface HighlightOptions {
  classes?: {
    insert?: string
    update?: string
    delete?: string
  }
}

const defaultClasses = { insert: 'bg-green-300', update: 'bg-blue-300', delete: 'bg-red-300' }

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
  const classes = { ...defaultClasses, ...(options?.classes || {}) }

  // Remove existing highlight classes
  Object.values(classes).forEach((cls) => el.classList.remove(cls))

  // Only add highlight if there's a change and it's not old
  if (value?.$psChange && !value.$psChange.isOld) {
    const highlightClass = classes[value.$psChange.type]
    if (highlightClass) el.classList.add(highlightClass)
  }
}

export default defineNuxtPlugin((nuxtApp) => {
  nuxtApp.vueApp.directive('highlight', vHighlight)
})
