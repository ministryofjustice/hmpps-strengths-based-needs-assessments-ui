import FormWizard from 'hmpo-form-wizard'
import nunjucks from 'nunjucks'

const formatForNunjucks = (str = '') =>
  str
    .replace('{{', '{ {') // Prevent nunjucks mistaking the braces when rendering the template
    .replace('}}', '} }')

const renderConditionalQuestion = (
  allFields: FormWizard.Field[],
  thisField: FormWizard.Field,
  dependentFieldNodes: Node[],
  errors: FormErrors = {},
  _nunjucks = nunjucks,
): FormWizard.Field => {
  const conditionalFields = dependentFieldNodes.map(({ code, dependents }) => {
    const [config] = allFields.filter(field => field.code === code)
    return { config, dependents }
  })

  const options = thisField.options.map(thisOption => {
    const fieldsDependentOnThisAnswer = conditionalFields.filter(
      field => field.config.dependent.value === thisOption.value,
    )

    if (fieldsDependentOnThisAnswer.length === 0) {
      return thisOption
    }

    const rendered = fieldsDependentOnThisAnswer.reduce((previouslyRenderedHtml, conditionalField) => {
      let field = conditionalField.config
      if (Array.isArray(conditionalField.dependents) && conditionalField.dependents.length > 0) {
        field = renderConditionalQuestion(allFields, field, conditionalField.dependents, errors)
      }

      const fieldString = formatForNunjucks(JSON.stringify(field))
      const errorString = formatForNunjucks(JSON.stringify(errors))

      const template =
        '{% from "components/question/macro.njk" import renderQuestion %} \n' +
        `{{ renderQuestion(${fieldString}, ${errorString}) }}`

      const renderedHtml = _nunjucks.renderString(template, {}).replace(/(\r\n|\n|\r)\s+/gm, '')

      return [previouslyRenderedHtml, renderedHtml].join('')
    }, '')
    return { ...thisOption, conditional: { html: rendered } }
  })

  return { ...thisField, options }
}

export type FormErrors = { [code: string]: string }
type Node = { code: string; dependents?: Node[] }

export const compileConditionalFields = (fields: FormWizard.Field[], errors: FormErrors) => {
  const fieldsWithDependencies = fields.filter(field => field.dependent)
  const fieldCodes = fieldsWithDependencies.map(field => field.code)

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
          return { code: field.code, deps: buildNode(field.code) }
        }
        return { code: field.code }
      })

  const dependencyTree = rootFieldsWithDependencies.map(questionCode => {
    return { code: questionCode, dependents: buildNode(questionCode) }
  })

  return dependencyTree.reduce(
    (otherFields, { code: fieldCode, dependents }) => {
      const [thisField] = otherFields.filter(field => field.code === fieldCode)

      const updatedQuestion = renderConditionalQuestion(fields, thisField, dependents, errors)

      return otherFields.map(field => (field.code === updatedQuestion.code ? updatedQuestion : field))
    },
    [...fields],
  )
}

export const fieldsByCode = (otherFields: FormWizard.Fields, field: FormWizard.Field): FormWizard.Fields => ({
  ...otherFields,
  [field.code]: field,
})

export const processReplacements = (
  fields: FormWizard.Field[],
  replacementValues: { [key: string]: string },
): FormWizard.Field[] => {
  return fields.map(field => {
    const text = field.text.replace(/(\[\w+\])/, (token: string) => {
      const key = token.substring(1, token.length - 1)
      const value = replacementValues[key]

      return value || token
    })

    return { ...field, text }
  })
}
