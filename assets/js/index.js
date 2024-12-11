import * as govukFrontend from 'govuk-frontend'
import * as mojFrontend from '@ministryofjustice/frontend'
import accessibleAutocomplete from 'accessible-autocomplete'
import './save-on-exit'
import './modules'
import './appInsights'

govukFrontend.initAll()
mojFrontend.initAll()

document.addEventListener('DOMContentLoaded', function () {
  window.GOVUK.modules.start()

  document.querySelectorAll('select[data-accessible-autocomplete]')
    .forEach(it =>
      accessibleAutocomplete.enhanceSelectElement({ selectElement: it, showAllValues: false, confirmOnBlur: false, })
    )

  document.querySelectorAll('[data-browser-back]').forEach(it =>
    it.addEventListener('click', (e) => {
      e.preventDefault()
      history.back()
    })
  )

  document.querySelectorAll('[data-grow-wrap]').forEach(textarea => {
    const grower = document.createElement('div')
    grower.className = 'grow-wrap'
    textarea.parentNode.insertBefore(grower, textarea)
    grower.appendChild(textarea)
    textarea.addEventListener('input', () => {
      textarea.parentNode.dataset.replicatedValue = textarea.value
    })
    textarea.dispatchEvent(new Event('input', { bubbles: true }))
  })
})
