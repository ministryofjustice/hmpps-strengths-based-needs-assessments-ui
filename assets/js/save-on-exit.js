;(function initialiseAutosave() {
  const assessmentInfo = document.querySelector('#assessment-info')
  const assessmentId = assessmentInfo.dataset.assessmentId || 'assessment-id'

  function shouldSave(element) {
    return element.name.length > 0 && element.name !== 'x-csrf-token'
  }

  function isRadio(element) {
    return element.type === 'radio'
  }

  function isCheckbox(element) {
    return element.type === 'checkbox'
  }

  function getFormElements() {
    const form = document.getElementById('form')
    return form.elements
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
    const key = assessmentId + window.location.pathname
    const data = {}

    console.log(`saving local form data for: ${key}`)

    for (const element of formElements) {
      if (shouldSave(element)) {
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

  function removeOldData() {
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

  function notifyUserOfUnsavedChanges(formElements, savedState) {
    const initialState = {}

    for (const element of formElements) {
      if (shouldSave(element)) {
        if (isRadio(element)) {
          saveRadio(initialState, element)
        } else if (isCheckbox(element)) {
          saveCheckbox(initialState, element)
        } else {
          initialState[element.name] = element.value
        }
      }
    }

    const notificationBanner = document.getElementById('unsaved-data-notification')

    if (savedState && JSON.stringify(initialState) != savedState) {
      console.log('Notifying user of unsaved changes')
      notificationBanner?.classList?.remove('govuk-visually-hidden')
    } else {
      notificationBanner?.classList?.add('govuk-visually-hidden')
    }
  }

  function loadForm() {
    const formElements = getFormElements()
    const key = assessmentId + window.location.pathname

    console.log(`loading local form data for: ${key}`)

    const data = localStorage.getItem(key)

    notifyUserOfUnsavedChanges(formElements, data)

    if (data) {
      const parsedData = JSON.parse(data)

      for (const element of formElements) {
        if (shouldSave(element)) {
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

    localStorage.removeItem(key)
  }

  function removeLocalData() {
    const page = window.location.pathname

    console.log(`clearing local form data for: ${page}`)

    localStorage.removeItem(page)
  }

  window.addEventListener('load', () => {
    removeOldData()
    loadForm()
  })

  window.addEventListener('beforeunload', () => {
    saveForm()

    return null
  })

  const form = document.getElementById('form')

  form.addEventListener('submit', () => {
    removeLocalData()
  })
})()
