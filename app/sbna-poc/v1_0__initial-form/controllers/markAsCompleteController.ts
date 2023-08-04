import { Response, NextFunction } from 'express'
import FormWizard from 'hmpo-form-wizard'
import BaseController from '../../../common/controllers/baseController'
import StrengthsBasedNeedsAssessmentsApiService from '../../../../server/services/strengthsBasedNeedsService'

// flag type
let markAsComplete = false

// markAsComplete = true -> readOnlyPage (answers saved)
// markAsComplete = false -> editPage    (answers unsaved)

function pageType(): void {
  // void - doesn't return a value
  const editPage: HTMLElement = document.getElementById('editPage')!
  const readOnlyPage: HTMLElement = document.getElementById('readOnlyPage'!)

  if (markAsComplete) {
    editPage.style.display = 'block' // visible
    readOnlyPage.style.display = 'none' // hidden
  } else {
    editPage.style.display = 'none'
    readOnlyPage.style.display = 'block'
  }
}

function saveButtonOnClick(): void {
  markAsComplete = true
  pageType()
}

// event listener
const markAsCompleteButton: HTMLButtonElement = document.getElementById('markAsCompleteButton') as HTMLButtonElement
markAsCompleteButton.addEventListener('click', saveButtonOnClick)

pageType()
