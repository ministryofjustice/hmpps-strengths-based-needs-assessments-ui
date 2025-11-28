/* eslint-disable no-param-reassign */
import nunjucks from 'nunjucks'
import express from 'express'
import * as pathModule from 'path'

import {
  display,
  displayDateForToday,
  getMaxCharacterCount,
  getRenderedFields,
  outdent,
  setProp,
  startsWith,
  toErrorSummary,
  urlSafe,
  safeStringify,
} from './nunjucks.utils'
import getSummaryFields from './nunjucks.summaryFields'
import generateDrugsSummary from './nunjucks.drugsSummary'
import getAnalysisSummaryFields from './nunjucks.analysisSummaryFields'
import FieldsFactory from '../../app/form/v1_0/fields/common/fieldsFactory'
import maintenanceMessage from './maintenanceMessage'
import { formatDateForDisplay, ordinalWordFromNumber } from '../../app/utils/formatters'
import config from '../config'

const production = process.env.NODE_ENV === 'production'

export default function nunjucksSetup(app: express.Express, path: pathModule.PlatformPath): void {
  app.set('view engine', 'njk')

  app.locals.asset_path = '/assets/'
  app.locals.applicationName = 'Strengths and needs'
  app.locals.deploymentName = config.deploymentName
  app.locals.spUrl = config.spUrl

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
      path.join(__dirname, 'server/views'),
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

  njkEnv.addGlobal('getCsrf', function getCsrf() {
    const v = this.getVariables()
    return v?.['csrf-token'] || ''
  })

  njkEnv.addGlobal('toErrorSummary', toErrorSummary)

  njkEnv.addGlobal('getRenderedFields', getRenderedFields)

  njkEnv.addGlobal('getUserSubmittedField', FieldsFactory.getUserSubmittedField)

  njkEnv.addFilter('startsWith', startsWith)

  njkEnv.addFilter('urlSafe', urlSafe)

  njkEnv.addFilter('outdent', outdent)

  njkEnv.addGlobal('getSummaryFields', getSummaryFields)

  njkEnv.addGlobal('generateDrugsSummary', generateDrugsSummary)

  njkEnv.addFilter('display', display)

  njkEnv.addGlobal('getAnalysisSummaryFields', getAnalysisSummaryFields)

  njkEnv.addGlobal('getMaxCharacterCount', getMaxCharacterCount)

  njkEnv.addFilter('setProp', setProp)

  njkEnv.addFilter('formatDateForDisplay', formatDateForDisplay)

  njkEnv.addFilter('ordinalWordFromNumber', ordinalWordFromNumber)

  njkEnv.addGlobal('displayDateForToday', displayDateForToday)

  njkEnv.addGlobal('getMaintenanceMessage', maintenanceMessage)

  njkEnv.addFilter('safeStringify', safeStringify)
}
