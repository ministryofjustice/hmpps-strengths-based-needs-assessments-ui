import * as govukFrontend from 'govuk-frontend'
import * as mojFrontend from '@ministryofjustice/frontend'
import accessibleAutocomplete from 'accessible-autocomplete'
import './save-on-exit'

govukFrontend.initAll()
mojFrontend.initAll()

document.querySelectorAll('select[data-accessible-autocomplete]')
    .forEach(it =>
        accessibleAutocomplete.enhanceSelectElement({ selectElement: it, showAllValues: false, confirmOnBlur: false, })
    )
