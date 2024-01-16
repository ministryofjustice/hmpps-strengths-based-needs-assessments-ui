;(function initialiseAutosave() {
  let formHasChangesToBePersisted = false

  function isSavable(element) {
    return element.name.length > 0 && element.name !== 'x-csrf-token'
  }

  const isTypeOf = elementType => element => element.type === elementType

  const isRadio = isTypeOf('radio')
  const isCheckbox = isTypeOf('checkbox')
  const isSelect = element => isTypeOf('select-one')(element) || isTypeOf('select-multiple')(element)

  function getForm() {
    return document.getElementById('form')
  }

  function getFormElements() {
    return getForm()?.elements
  }

  function hasFormOnPage() {
    return getForm() !== null
  }

  function getAssessmentId() {
    const assessmentInfo = document.querySelector('#assessment-info')
    return assessmentInfo?.dataset?.assessmentId || 'assessment-id'
  }

  function getKeyForLocalStorage() {
    const assessmentId = getAssessmentId()

    return assessmentId + window.location.pathname
  }

  function saveRadio(data, element) {
    if (element.checked) {
      data[element.name] = element.value
    }
  }

  function saveCheckbox(data, element) {
    const otherValues = data[element.name] || []
    if (element.checked) {
      otherValues.push(element.value)
    }
    data[element.name] = otherValues
  }

  function saveForm() {
    const formElements = getFormElements()
    const key = getKeyForLocalStorage()
    const data = {}

    console.log(`Saving local form data for: ${key}`)

    for (const element of formElements) {
      if (isSavable(element)) {
        if (isRadio(element)) {
          saveRadio(data, element)
        } else if (isCheckbox(element)) {
          saveCheckbox(data, element)
        } else {
          data[element.name] = element.value
        }
      }
    }

    localStorage.setItem(key, JSON.stringify(data))
  }

  function persistForm() {
    const form = getForm()
    const formData = new URLSearchParams(new FormData(form))
    const [formAction] = form?.getAttribute('action').split('#')
    const endpoint = `${formAction}?action=saveDraft&jsonResponse=true`

    return fetch(endpoint, {
      method: 'POST',
      body: formData,
      headers: {
        'x-csrf-token': document.getElementsByName('x-csrf-token')[0].value,
      },
    })
  }

  function removeUnusedLocalStorageEntries() {
    const assessmentId = getAssessmentId()
    let removedCount = 0

    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i)
      if (!key.startsWith(assessmentId)) {
        localStorage.removeItem(key)
        removedCount++
      }
    }

    console.log(`Removed ${removedCount} unused entries of local form data`)
  }

  function loadRadio(data, element) {
    const savedValue = data[element.name]
    element.value === savedValue ? element.setAttribute('checked', true) : element.removeAttribute('checked')
  }

  function loadCheckbox(data, element) {
    const savedValues = data[element.name] || []
    savedValues.includes(element.value) ? element.setAttribute('checked', true) : element.removeAttribute('checked')
  }

  function loadForm() {
    const formElements = getFormElements()
    const key = getKeyForLocalStorage()

    console.log(`Loading local form data for: ${key}`)

    const data = localStorage.getItem(key)

    if (data) {
      const parsedData = JSON.parse(data)

      for (const element of formElements) {
        if (isSavable(element)) {
          if (isRadio(element)) {
            loadRadio(parsedData, element)
          } else if (isCheckbox(element)) {
            loadCheckbox(parsedData, element)
          } else {
            element.value = parsedData[element.name]
          }
        }
      }
    }

    console.log(`Clearing local form data for: ${key}`)

    localStorage.removeItem(key)
  }

  function addListenersToFormElements() {
    const formElements = getFormElements()

    let timeoutHandle = null

    const handleEvent = () => {
      formHasChangesToBePersisted = true

      if (timeoutHandle) {
        clearTimeout(timeoutHandle)
      }

      console.log('Detected change - setting timeout')

      timeoutHandle = setTimeout(() => {
        persistForm()
          .then(response =>
            response.text().then(text => {
              console.log(`Form persisted: ${text}`)
              formHasChangesToBePersisted = false
            }),
          )
          .catch(e => console.error(`Failed to persist form: ${e.message}`))
      }, 5 * 1000)
    }

    document.addEventListener('keyup', handleEvent)

    for (const element of formElements) {
      if (isRadio(element) || isCheckbox(element) || isSelect(element)) {
        element.addEventListener('click', handleEvent)
      }
    }

    const links = document.getElementsByTagName('a')

    for (const link of links) {
      link.addEventListener('click', event => {
        event.preventDefault()
        if (formHasChangesToBePersisted) {
          return persistForm()
            .then(response =>
              response.text().then(text => {
                console.log(`Form persisted: ${text}`)
                window.location = link.href
              }),
            )
            .catch(e => console.error(`Failed to persist form: ${e.message}`))
        } else {
          window.location = link.href
        }
      })
    }
  }

  window.addEventListener('load', () => {
    if (hasFormOnPage()) {
      console.log(`Form detected, initialising autosave`)
      removeUnusedLocalStorageEntries()
      loadForm()
      addListenersToFormElements()
    }
  })

  window.addEventListener('beforeunload', () => {
    if (hasFormOnPage()) {
      saveForm()
    }

    return null
  })
})()
