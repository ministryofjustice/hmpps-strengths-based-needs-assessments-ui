import FormWizard, { FieldType } from 'hmpo-form-wizard'
import nunjucks from 'nunjucks'

export const formatForNunjucks = (str = '') => str.split('}').join('} ').trim() // Prevent nunjucks mistaking the braces when rendering the template

interface Locals {
  errors: unknown
  action: string
}

const renderConditionalQuestion = (
  allFields: FormWizard.Field[],
  thisField: FormWizard.Field,
  dependentFieldNodes: Node[],
  locals: Locals = { errors: {}, action: '/' },
  _nunjucks = nunjucks,
): FormWizard.Field => {
  const conditionalFields = dependentFieldNodes.map(({ id, dependents }) => {
    const [config] = allFields.filter(field => field.id === id)
    return { config, dependents }
  })

  const options = thisField.options.map(thisOption => {
    if (thisOption.kind === 'divider') {
      return thisOption
    }

    const fieldsDependentOnThisAnswer = conditionalFields.filter(
      field => field.config.dependent.value === thisOption.value,
    )

    if (fieldsDependentOnThisAnswer.length === 0) {
      return thisOption
    }

    const rendered = fieldsDependentOnThisAnswer.reduce((previouslyRenderedHtml, conditionalField) => {
      let field = conditionalField.config
      if (Array.isArray(conditionalField.dependents) && conditionalField.dependents.length > 0) {
        field = renderConditionalQuestion(allFields, field, conditionalField.dependents, locals)
      }

      const fieldString = formatForNunjucks(JSON.stringify(field))
      const errorString = formatForNunjucks(JSON.stringify(locals.errors))

      const template =
        '{% from "components/question/macro.njk" import renderQuestion %} \n' +
        `{{ renderQuestion(${fieldString}, ${errorString}, "${locals.action}") }}`

      const renderedHtml = _nunjucks.renderString(template, {}).replace(/(\r\n|\n|\r)\s+/gm, '')

      return [previouslyRenderedHtml, renderedHtml].join('')
    }, '')
    return { ...thisOption, conditional: { html: rendered } }
  })

  return { ...thisField, options }
}

export type FormErrors = { [code: string]: string }
type Node = { code: string; id: string; dependents?: Node[] }

export const compileConditionalFields = (fields: FormWizard.Field[], locals: Locals) => {
  const fieldsWithDependencies = fields.filter(field => field.dependent && field.dependent.displayInline)
  const fieldCodes = fieldsWithDependencies.map(field => field.id)

  const rootFieldsWithDependencies = fieldsWithDependencies
    .filter(field => !fieldCodes.includes(field.dependent.field))
    .map(field => field.dependent.field)
    .filter((fieldCode, index, otherFields) => otherFields.indexOf(fieldCode) === index)

  const buildNode = (parentFieldCode: string): Node[] =>
    fieldsWithDependencies
      .filter(field => field.dependent.field === parentFieldCode)
      .map(field => {
        const dependents = fieldsWithDependencies.filter(otherField => field.code === otherField.dependent.field)
        if (dependents.length > 0) {
          return { code: field.code, id: field.id, dependents: buildNode(field.code) }
        }
        return { code: field.code, id: field.id }
      })

  const dependencyTree = rootFieldsWithDependencies.map(questionCode => {
    return { code: questionCode, dependents: buildNode(questionCode) }
  })

  return dependencyTree.reduce(
    (otherFields, { code: fieldCode, dependents }) => {
      const [thisField] = otherFields.filter(field => field.code === fieldCode)

      const updatedField = renderConditionalQuestion(fields, thisField, dependents, locals)

      return otherFields.map(field => (field.code === updatedField.code ? updatedField : field))
    },
    [...fields],
  )
}

export const fieldsById = (otherFields: FormWizard.Fields, field: FormWizard.Field): FormWizard.Fields => ({
  ...otherFields,
  [field.id]: field,
})

const replaceWithValuesFrom = (replacementValues: { [key: string]: string }) => (token: string) => {
  const key = token.substring(1, token.length - 1)
  const value = replacementValues[key]

  return value || token
}

export const whereSelectable = (o: FormWizard.Field.Option | FormWizard.Field.Divider): o is FormWizard.Field.Option =>
  o.kind === 'option'

export const withPlaceholdersFrom = (replacementValues: { [key: string]: string }) => {
  const replacer = replaceWithValuesFrom(replacementValues)
  const placeholderPattern = /(\[\w+\])/g

  return (field: FormWizard.Field): FormWizard.Field => {
    const modifiedField = { ...field }

    modifiedField.text = field.text.replace(placeholderPattern, replacer)

    switch (field.hint?.kind) {
      case 'text':
        modifiedField.hint = { text: field.hint.text.replace(placeholderPattern, replacer), kind: 'text' }
        break
      case 'html':
        modifiedField.hint = { html: field.hint.html.replace(placeholderPattern, replacer), kind: 'html' }
        break
      default:
        break
    }

    if (field.options) {
      modifiedField.options = field.options.map(option => {
        return whereSelectable(option) ? { ...option, text: option.text.replace(placeholderPattern, replacer) } : option
      })
    }

    return modifiedField
  }
}

export const withValuesFrom =
  (answers: FormWizard.Answers = {}) =>
  (field: FormWizard.Field): FormWizard.Field => {
    switch (field.type) {
      case FieldType.Text:
      case FieldType.TextArea:
        return { ...field, value: answers[field.code] }
      case FieldType.Radio:
      case FieldType.Dropdown:
        return {
          ...field,
          options: field.options.map(option => {
            return whereSelectable(option)
              ? { ...option, checked: (answers[field.code] as string) === option.value }
              : option
          }),
        }
      case FieldType.CheckBox:
        return {
          ...field,
          options: field.options.map(option => {
            return whereSelectable(option)
              ? { ...option, checked: (answers[field.code] || []).includes(option.value) }
              : option
          }),
        }
      case FieldType.Date:
        return {
          ...field,
          value: answers[field.code] ? (answers[field.code] as string).split('-') : [],
        }
      default:
        return field
    }
  }

export const combineDateFields = (
  answers: FormWizard.Answers,
  preProcessedAnswers: FormWizard.Answers,
): FormWizard.Answers => {
  const dateFieldPattern = /-(day|month|year)$/
  const whereDateField = (key: string) => dateFieldPattern.test(key)

  const dateFields = Object.keys(answers)
    .filter(whereDateField)
    .map(key => key.replace(dateFieldPattern, ''))
    .filter((key, index, otherKeys) => otherKeys.indexOf(key) === index)

  const padDateComponent = (component: string) => component.padStart(2, '0')

  return dateFields.reduce((otherAnswers, key) => {
    const year = answers[`${key}-year`]
    const month = answers[`${key}-month`] as string
    const day = answers[`${key}-day`] as string

    if (!day || !month || !year) {
      return { ...otherAnswers, [key]: '' }
    }

    return { ...otherAnswers, [key]: `${year}-${padDateComponent(month)}-${padDateComponent(day)}` }
  }, preProcessedAnswers)
}
