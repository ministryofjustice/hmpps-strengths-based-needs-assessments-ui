import FormWizard, { FieldType } from 'hmpo-form-wizard'
import { AnswerDto } from '../../server/services/strengthsBasedNeedsService'
import { Field, FieldDependencyTreeBuilder } from '../utils/fieldDependencyTreeBuilder'
import { buildRequestBody, flattenAnswers, toAnswerDtoOption } from './saveAndContinue.utils'

jest.mock('../utils/fieldDependencyTreeBuilder')

describe('saveAndContinue.utils', () => {
  describe('flattenAnswers', () => {
    it('transforms persisted answers in to simple key/value pairs', () => {
      const persistedAnswers: Record<string, AnswerDto> = {
        single_value_field: { description: 'Single value field', type: FieldType.Text, value: 'FOO' },
        multiple_value_field: {
          description: 'Multiple value field',
          type: FieldType.CheckBox,
          values: ['FOO', 'BAR', 'BAZ'],
        },
      }

      const result = flattenAnswers(persistedAnswers)

      expect(result).toEqual({
        single_value_field: 'FOO',
        multiple_value_field: ['FOO', 'BAR', 'BAZ'],
      })
    })
  })

  describe('buildRequestBody', () => {
    const options: FormWizard.Field.Options = [
      { text: 'Foo', value: 'FOO', kind: 'option' },
      { text: 'Bar', value: 'BAR', kind: 'option' },
      { text: 'Bar', value: 'BAZ', kind: 'option' },
    ]

    const fieldsInCurrentStepWithDependenciesMet: FormWizard.Fields = {
      fooText: {
        id: 'fooText',
        text: 'Foo Text',
        code: 'fooText',
        type: FieldType.Text,
      },
      fooRadio: {
        id: 'fooRadio',
        text: 'Foo Radio',
        code: 'fooRadio',
        type: FieldType.Radio,
        options,
      },
      fooCheckbox: {
        id: 'fooCheckbox',
        text: 'Foo Checkbox',
        code: 'fooCheckbox',
        type: FieldType.CheckBox,
        options,
      },
    }

    const currentStepFields = {
      ...fieldsInCurrentStepWithDependenciesMet,
      fieldInCurrentStepWithDependencyNotMet: {
        id: 'fieldInCurrentStepWithDependencyNotMet',
        text: 'Foo Text',
        code: 'fieldInCurrentStepWithDependencyNotMet',
        type: FieldType.Text,
      },
    }

    const formOptions: FormWizard.FormOptions = {
      fields: currentStepFields,
      section: 'currentSection',
      steps: {
        currentStep: {
          section: 'currentSection',
          fields: currentStepFields,
        },
        anotherStepInCurrentSection: {
          section: 'currentSection',
          fields: {
            fieldInAnotherStepInCurrentSectionWithDependencyNotMet: {
              id: 'fieldInAnotherStepInCurrentSectionWithDependencyNotMet',
              code: 'fieldInAnotherStepInCurrentSectionWithDependencyNotMet',
            },
          },
        },
        stepInAnotherSection: {
          section: 'anotherSection',
          fields: {
            fieldInAnotherSection: {
              id: 'fieldInAnotherSection',
              code: 'fieldInAnotherSection',
            },
          },
        },
      },
    } as unknown as FormWizard.FormOptions

    const answers: FormWizard.Answers = {
      fooText: 'bar',
      fooRadio: 'FOO',
      fooCheckbox: ['FOO', 'BAR'],
      fieldInAnotherSection: 'test',
      fieldInAnotherStepInCurrentSectionWithDependencyMet: 'test',
      fieldInAnotherStepInCurrentSectionWithDependencyNotMet: 'test',
      fieldInCurrentStepWithDependencyNotMet: 'test',
    }

    const mockFlattenedFields: Field[] = [
      ...Object.values(fieldsInCurrentStepWithDependenciesMet).map(
        (field: FormWizard.Field) => ({ field }) as unknown as Field,
      ),
      {
        field: {
          id: 'fieldInAnotherStepInCurrentSectionWithDependencyMet',
          text: '',
          code: 'fieldInAnotherStepInCurrentSectionWithDependencyMet',
          type: FieldType.Text,
        } as unknown as FormWizard.Field,
      } as unknown as Field,
    ]

    const mockBuildAndFlatten = jest
      .spyOn(FieldDependencyTreeBuilder.prototype, 'buildAndFlatten')
      .mockImplementation(() => mockFlattenedFields)

    it('returns expected answersToAdd and answersToRemove', () => {
      const result = buildRequestBody(formOptions, answers)

      expect(FieldDependencyTreeBuilder).toHaveBeenCalledTimes(1)
      expect(FieldDependencyTreeBuilder).toHaveBeenCalledWith(formOptions, answers)

      expect(mockBuildAndFlatten).toHaveBeenCalledTimes(1)

      const expectedOptions = [
        { text: 'Foo', value: 'FOO' },
        { text: 'Bar', value: 'BAR' },
        { text: 'Bar', value: 'BAZ' },
      ]

      expect(result.answersToAdd).toEqual({
        fooText: { description: 'Foo Text', type: FieldType.Text, value: 'bar' },
        fooRadio: { description: 'Foo Radio', type: FieldType.Radio, options: expectedOptions, value: 'FOO' },
        fooCheckbox: {
          description: 'Foo Checkbox',
          type: FieldType.CheckBox,
          options: expectedOptions,
          values: ['FOO', 'BAR'],
        },
      })

      expect(result.answersToRemove).toEqual([
        'fieldInAnotherStepInCurrentSectionWithDependencyNotMet',
        'fieldInCurrentStepWithDependencyNotMet',
      ])
    })
  })
  describe('toAnswerDtoOption', () => {
    it('converts a form wizard option to an answer DTO option', () => {
      expect(
        toAnswerDtoOption({
          value: 'FOO',
          text: 'Foo',
          kind: 'option',
          hint: { text: 'Some hint' },
          summary: { displayFn: (_a: string, _b: string) => 'Foo summary' },
          behaviour: 'exclusive',
          checked: true,
        }),
      ).toEqual({ value: 'FOO', text: 'Foo' })
    })
  })
})
