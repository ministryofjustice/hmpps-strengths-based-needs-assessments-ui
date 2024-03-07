/* eslint-disable no-param-reassign */
import nunjucks from 'nunjucks'
import express from 'express'
import * as pathModule from 'path'
import { initialiseName } from './utils'
import {
  answerIncludes,
  formatDateForDisplay,
  getLabelForOption,
  getSelectedAnswers,
  removeSectionCompleteFields,
  toErrorSummary,
  toOptionDescription,
} from './nunjucks.utils'
import getSummaryFields from './nunjucks.summaryFields'

const production = process.env.NODE_ENV === 'production'

export default function nunjucksSetup(app: express.Express, path: pathModule.PlatformPath): void {
  app.set('view engine', 'njk')

  app.locals.asset_path = '/assets/'
  app.locals.applicationName = 'Strengths and needs'

  // Cache busting version string
  if (production) {
    // Version only changes on reboot
    app.locals.version = Date.now().toString()
  } else {
    // Version changes every request
    app.use((req, res, next) => {
      res.locals.version = Date.now().toString()
      return next()
    })
  }

  const njkEnv = nunjucks.configure(
    [
      path.join(__dirname, '../../server/views'),
      'node_modules/govuk-frontend/dist/',
      'node_modules/govuk-frontend/dist/govuk/components/',
      'node_modules/@ministryofjustice/frontend/',
      'node_modules/@ministryofjustice/frontend/moj/components/',
    ],
    {
      autoescape: true,
      express: app,
    },
  )

  njkEnv.addFilter('initialiseName', initialiseName)

  njkEnv.addGlobal('getCsrf', function getCsrf() {
    const v = this.getVariables()
    return v?.['csrf-token'] || ''
  })

  njkEnv.addFilter('toOptionDescription', toOptionDescription)

  njkEnv.addGlobal('toErrorSummary', toErrorSummary)

  njkEnv.addGlobal('answerIncludes', answerIncludes)

  njkEnv.addGlobal('getLabelForOption', getLabelForOption)

  njkEnv.addGlobal('getSelectedAnswers', getSelectedAnswers)

  njkEnv.addFilter('removeSectionCompleteFields', removeSectionCompleteFields)

  njkEnv.addGlobal('getSummaryFields', function summaryFields() {
    return getSummaryFields(this.ctx)
  })

  njkEnv.addFilter('formatDateForDisplay', formatDateForDisplay)
}
