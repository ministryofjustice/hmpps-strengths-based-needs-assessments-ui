/* eslint-disable no-param-reassign */
import nunjucks from 'nunjucks'
import express from 'express'
import * as pathModule from 'path'
import FormWizard, { FieldType } from 'hmpo-form-wizard'
import { initialiseName } from './utils'
import { AnswerDto } from '../services/strengthsBasedNeedsService'

const production = process.env.NODE_ENV === 'production'

export default function nunjucksSetup(app: express.Express, path: pathModule.PlatformPath): void {
  app.set('view engine', 'njk')

  app.locals.asset_path = '/assets/'
  app.locals.applicationName = 'Strengths and needs'

  // Cachebusting version string
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
      'node_modules/govuk-frontend/',
      'node_modules/govuk-frontend/components/',
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

  njkEnv.addFilter('toOptionDescription', function toOptionDescription(answer: AnswerDto): string {
    switch (answer.type) {
      case FieldType.Radio:
      case FieldType.Dropdown:
        return answer.options.find(option => option.value === answer.value)?.text || answer.value
      case FieldType.CheckBox:
        return (answer.values || [])
          .map(selected => answer.options.find(option => option.value === answer.value)?.text || selected)
          .join(', ')
      default:
        return answer.value || ''
    }
  })

  type ValidationError = { message: string; key: string }
  type ErrorSummaryItem = { text: string; href: string }

  njkEnv.addGlobal(
    'toErrorSummary',
    function toErrorSummary(errors: Record<string, ValidationError>): ErrorSummaryItem[] {
      return Object.entries(errors).map(([_, e]) => ({ text: e.message, href: `#${e.key}-error` }))
    },
  )

  njkEnv.addGlobal('answerIncludes', function answerIncludes(value: string, answer: Array<string> = []) {
    return answer.includes(value)
  })

  njkEnv.addGlobal('getLabelForOption', function getLabelForOption(field: FormWizard.Field, value: string) {
    const options = field.options || []
    const option = options
      .filter(o => o.kind === 'option')
      .find((o: FormWizard.Field.Option) => o.value === value) as FormWizard.Field.Option
    return option ? option.text : value
  })

  njkEnv.addGlobal('getSelectedAnswers', function getSelectedAnswers(field: FormWizard.Field) {
    const options = (field.options?.filter(o => o.kind === 'option') as Array<FormWizard.Field.Option>) || []
    return options
      .filter(o => o.checked)
      .map(o => o.text)
      .join()
  })

  njkEnv.addFilter('removeSectionCompleteFields', function removeSectionCompleteFields(fields: string[]): string[] {
    return fields.filter(it => !it.endsWith('_section_complete'))
  })
}
