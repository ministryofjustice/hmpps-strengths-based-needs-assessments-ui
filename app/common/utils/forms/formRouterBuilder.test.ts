import FormWizard from 'hmpo-form-wizard'
import { createNavigation, createSectionProgressRules, getStepFrom } from './formRouterBuilder'

describe('common/utils/formRouterBuilder', () => {
  describe('getStepFrom', () => {
    const fooStep: FormWizard.Step = {
      pageTitle: 'Foo step',
      section: 'foo',
    }

    const barStep: FormWizard.Step = {
      pageTitle: 'Bar step',
      section: 'bar',
    }

    const steps: FormWizard.Steps = {
      '/foo': fooStep,
      '/bar': barStep,
    }

    it('returns a step for a given URL', () => {
      const result = getStepFrom(steps, '/foo')
      expect(result).toEqual(fooStep)
    })

    it('ignores query parameters', () => {
      const result = getStepFrom(steps, '/foo?bar=true&baz=false')
      expect(result).toEqual(fooStep)
    })

    it('does not throw when not found', () => {
      const result = getStepFrom(steps, '/baz')
      expect(result).toBeUndefined()
    })
  })

  describe('createSectionProgressRules', () => {
    const fooQuestionsComplete = 'foo_questions_complete'
    const fooSummaryComplete = 'foo_summary_complete'
    const barSectionComplete = 'bar_section_complete'

    const steps: FormWizard.Steps = {
      '/foo/questions/1': {
        pageTitle: 'First question page',
        section: 'foo',
        sectionProgressRules: [
          { fieldCode: fooQuestionsComplete, conditionFn: () => 'NO' },
          { fieldCode: fooSummaryComplete, conditionFn: () => 'NO' },
        ],
      },
      '/foo/questions/2': {
        pageTitle: 'Second question page',
        section: 'foo',
        sectionProgressRules: [{ fieldCode: fooQuestionsComplete, conditionFn: () => 'YES' }],
      },
      '/foo/summary': {
        pageTitle: 'Summary page',
        section: 'foo',
        sectionProgressRules: [{ fieldCode: fooSummaryComplete, conditionFn: () => 'YES' }],
      },
      '/bar': {
        pageTitle: 'Other section',
        section: 'bar',
        sectionProgressRules: [{ fieldCode: barSectionComplete, conditionFn: () => 'YES' }],
      },
    }

    it('returns a list of fields required to complete by section', () => {
      const result = createSectionProgressRules(steps)

      expect(result).toEqual([
        { sectionName: 'foo', fieldCodes: [fooQuestionsComplete, fooSummaryComplete] },
        { sectionName: 'bar', fieldCodes: [barSectionComplete] },
      ])
    })
  })

  describe('createNavigation', () => {
    const steps: FormWizard.Steps = {
      '/foo': {
        pageTitle: 'Foo step',
        section: 'foo',
        navigationOrder: 1,
      },
      '/baz': {
        pageTitle: 'Baz step',
        section: 'baz',
        navigationOrder: 3,
      },
      '/bar': {
        pageTitle: 'Bar step',
        section: 'bar',
        navigationOrder: 2,
      },
      '/bar/2': {
        pageTitle: 'Bar sub-step',
        section: 'bar',
      },
    }

    it('returns an array of navigation items from step config', () => {
      const result = createNavigation(steps, 'bar')

      expect(result).toEqual([
        { active: false, label: steps['/foo']?.pageTitle, section: steps['/foo']?.section, url: 'foo' },
        { active: true, label: steps['/bar']?.pageTitle, section: steps['/bar']?.section, url: 'bar' },
        { active: false, label: steps['/baz']?.pageTitle, section: steps['/baz']?.section, url: 'baz' },
      ])
    })
  })
})
