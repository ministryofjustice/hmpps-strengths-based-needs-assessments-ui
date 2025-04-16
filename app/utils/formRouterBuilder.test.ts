import FormWizard from 'hmpo-form-wizard'
import { createNavigation, createSectionProgressRules, getStepFrom } from './formRouterBuilder'
import { SectionConfig } from '../form/v1_0/config/sections'

describe('common/utils/formRouterBuilder', () => {
  describe('getStepFrom', () => {
    const fooStep: FormWizard.Step = {
      pageTitle: 'Foo step',
      section: 'foo',
      group: 'Test group',
    }

    const barStep: FormWizard.Step = {
      pageTitle: 'Bar step',
      section: 'bar',
      group: 'Test group',
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
    const group = 'Test group'

    const steps: FormWizard.Steps = {
      '/foo/questions/1': {
        pageTitle: 'First question page',
        section: 'foo',
        group,
        sectionProgressRules: [
          { fieldCode: fooQuestionsComplete, conditionFn: () => false },
          { fieldCode: fooSummaryComplete, conditionFn: () => false },
        ],
      },
      '/foo/questions/2': {
        pageTitle: 'Second question page',
        section: 'foo',
        group,
        sectionProgressRules: [{ fieldCode: fooQuestionsComplete, conditionFn: () => true }],
      },
      '/foo/summary': {
        pageTitle: 'Summary page',
        section: 'foo',
        group,
        sectionProgressRules: [{ fieldCode: fooSummaryComplete, conditionFn: () => true }],
      },
      '/bar': {
        pageTitle: 'Other section',
        section: 'bar',
        group,
        sectionProgressRules: [{ fieldCode: barSectionComplete, conditionFn: () => true }],
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
    const basePath = '/wizard'
    function generateStep(url: string, group?: string, isSectionEntryPoint?: boolean, isGroupEntryPoint?: boolean) {
      return {
        url,
        group,
        isSectionEntryPoint,
        isGroupEntryPoint,
        pageTitle: `Page ${url}`,
      }
    }

    it('returns an empty array when no sections are provided', () => {
      const sections: SectionConfig[] = []
      const result = createNavigation(basePath, '/dummyPath', sections, '', false)
      expect(result).toEqual([])
    })

    it('filters out sections whose order = -1', () => {
      const sections = [
        {
          section: { code: 'secA', order: -1, title: 'Section A' },
          steps: [generateStep('step-1')],
          groups: {},
        },
        {
          section: { code: 'secB', order: 1, title: 'Section B' },
          steps: [generateStep('step-2')],
          groups: {},
        },
      ]

      const result = createNavigation(basePath, '/step-2', sections, 'secB', false)
      expect(result).toHaveLength(1)
      expect(result[0]).toMatchObject({
        type: 'section',
        section: 'secB',
        label: 'Section B',
        url: '/wizard/step-2',
      })
    })

    it('sorts sections by their order', () => {
      const sections = [
        {
          section: { code: 'secC', order: 2, title: 'Section C' },
          steps: [generateStep('step-c')],
          groups: {},
        },
        {
          section: { code: 'secA', order: 1, title: 'Section A' },
          steps: [generateStep('step-a')],
          groups: {},
        },
        {
          section: { code: 'secB', order: 3, title: 'Section B' },
          steps: [generateStep('step-b')],
          groups: {},
        },
      ]

      const result = createNavigation(basePath, '/step-a', sections, 'secA', false)
      expect(result.map(item => item.section)).toEqual(['secA', 'secC', 'secB'])
    })

    it('uses the final step’s URL if not in edit mode', () => {
      const steps = [generateStep('step-1'), generateStep('step-2'), generateStep('step-3')]
      const sections = [
        {
          section: { code: 'secA', order: 1, title: 'Section A' },
          steps,
          groups: {},
        },
      ]

      const result = createNavigation(basePath, '/step-2', sections, 'secA', false)
      expect(result).toHaveLength(1)
      expect(result[0].url).toBe('/wizard/step-3')
    })

    it('uses the *section-entry-point* step’s URL + ?action=resume if in edit mode', () => {
      const steps = [generateStep('step-1'), generateStep('step-2', undefined, true), generateStep('step-3')]
      const sections = [
        {
          section: { code: 'secA', order: 1, title: 'Section A' },
          steps,
          groups: {},
        },
      ]

      const result = createNavigation(basePath, '/step-1', sections, 'secA', true)
      expect(result).toHaveLength(1)
      expect(result[0].url).toBe('/wizard/step-2?action=resume')
    })

    it('marks the current section as active', () => {
      const sections = [
        {
          section: { code: 'secA', order: 1, title: 'Section A' },
          steps: [generateStep('step-1')],
          groups: {},
        },
        {
          section: { code: 'secB', order: 2, title: 'Section B' },
          steps: [generateStep('step-2')],
          groups: {},
        },
      ]

      const result = createNavigation(basePath, '/step-2', sections, 'secB', false)
      expect(result[0].active).toBe(false)
      expect(result[1].active).toBe(true)
    })

    it('creates sub-navigation items for groups in the current section', () => {
      const steps = [
        generateStep('step-1', 'Group One', true, true),
        generateStep('step-2', 'Group One'),
        generateStep('step-3', 'Group Two', false, true),
        generateStep('step-4', 'Group Two'),
      ]

      const sections = [
        {
          section: { code: 'secA', order: 1, title: 'Section A' },
          steps,
          groups: {
            groupOne: 'Group One',
            groupTwo: 'Group Two',
          },
        },
        {
          section: { code: 'secB', order: 2, title: 'Section B' },
          steps: [generateStep('step-5')],
          groups: {},
        },
      ]

      const result = createNavigation(basePath, '/step-4', sections, 'secA', false)

      expect(result).toHaveLength(4)

      expect(result[0]).toMatchObject({
        type: 'section',
        section: 'secA',
        label: 'Section A',
        active: true,
      })

      const groupItems = result.slice(1)
      const [groupOne, groupTwo] = groupItems

      expect(groupOne).toMatchObject({
        type: 'group',
        label: 'Group One',
        active: false,
        url: '/wizard/step-2',
      })

      expect(groupTwo).toMatchObject({
        type: 'group',
        label: 'Group Two',
        active: true,
        url: '/wizard/step-4',
      })
    })

    it('uses ?action=resume for group entry point if in edit mode and multiple steps in group', () => {
      const steps = [generateStep('step-1', 'Group One', true, true), generateStep('step-2', 'Group One')]
      const sections = [
        {
          section: { code: 'secA', order: 1, title: 'Section A' },
          steps,
          groups: {
            groupOne: 'Group One',
          },
        },
      ]

      const result = createNavigation(basePath, '/step-2', sections, 'secA', true)

      expect(result).toHaveLength(2)

      const [sectionItem, groupItem] = result
      expect(sectionItem).toMatchObject({
        type: 'section',
        active: true,
        label: 'Section A',
        url: '/wizard/step-1?action=resume',
      })

      expect(groupItem).toMatchObject({
        type: 'group',
        label: 'Group One',
        url: '/wizard/step-1?action=resume',
        active: true,
      })
    })

    it('does not create sub-navigation items for sections that are not current', () => {
      const steps = [generateStep('step-1', 'Group One'), generateStep('step-2', 'Group Two')]
      const sections = [
        {
          section: { code: 'secA', order: 1, title: 'Section A' },
          steps,
          groups: {
            groupOne: 'Group One',
            groupTwo: 'Group Two',
          },
        },
        {
          section: { code: 'secB', order: 2, title: 'Section B' },
          steps: [generateStep('secB-step-1')],
          groups: {},
        },
      ]

      const result = createNavigation(basePath, '/secB-step-1', sections, 'secB', false)

      expect(result).toHaveLength(2)

      expect(result[0]).toMatchObject({
        type: 'section',
        section: 'secA',
        active: false,
        label: 'Section A',
      })

      expect(result[1]).toMatchObject({
        type: 'section',
        section: 'secB',
        active: true,
        label: 'Section B',
      })
    })
  })
})
