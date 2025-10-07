import FormWizard from 'hmpo-form-wizard'
import { Request } from 'express'
import { createNavigation, createSectionProgressRules, getStepFrom, isInEditMode } from './formRouterBuilder'
import { HandoverPrincipal } from '../../server/services/arnsHandoverService'
import { Section } from '../form/v1_0/config/sections'

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
          { fieldCode: fooQuestionsComplete, conditionFn: () => false },
          { fieldCode: fooSummaryComplete, conditionFn: () => false },
        ],
      },
      '/foo/questions/2': {
        pageTitle: 'Second question page',
        section: 'foo',
        sectionProgressRules: [{ fieldCode: fooQuestionsComplete, conditionFn: () => true }],
      },
      '/foo/summary': {
        pageTitle: 'Summary page',
        section: 'foo',
        sectionProgressRules: [{ fieldCode: fooSummaryComplete, conditionFn: () => true }],
      },
      '/bar': {
        pageTitle: 'Other section',
        section: 'bar',
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
    const steps: FormWizard.RenderedSteps = {
      '/foo': {
        pageTitle: 'Foo step',
        section: 'foo',
        isLastStep: true,
      },
      '/baz': {
        pageTitle: 'Baz step',
        section: 'baz',
        isLastStep: true,
      },
      '/bar/2': {
        pageTitle: 'Bar summary',
        section: 'bar',
        isLastStep: true,
      },
      '/bar': {
        pageTitle: 'Bar step',
        section: 'bar',
      },
    }

    const sections: Record<string, Section> = {
      foo: {
        title: 'Foo section',
        code: 'foo-section',
        navigationOrder: 1,
      },
      bar: {
        title: 'Bar section',
        code: 'bar-section',
        navigationOrder: 2,
      },
      baz: {
        title: 'Baz section',
        code: 'baz-section',
        navigationOrder: 3,
      },
    }

    it('returns an array of navigation items from step config', () => {
      const userInEditMode = createNavigation('/form/1/0', sections, 'bar-section', steps, '/bar', true)

      expect(userInEditMode).toEqual([
        {
          active: false,
          code: 'foo-section',
          label: sections.foo?.title,
          section: sections.foo?.code,
          url: '/form/1/0/foo-section',
        },
        {
          active: true,
          code: 'bar-section',
          label: sections.bar?.title,
          section: sections.bar?.code,
          url: '/form/1/0/bar-section',
        },
        {
          active: false,
          code: 'baz-section',
          label: sections.baz?.title,
          section: sections.baz?.code,
          url: '/form/1/0/baz-section',
        },
      ])

      // const userInReadOnlyMode = createNavigation('/form/1/0', sections, 'bar-section', steps, '/bar', false)
      //
      // expect(userInReadOnlyMode).toEqual([
      //   { active: false, label: sections.foo?.title, section: steps['/foo']?.section, url: '/form/1/0/foo' },
      //   { active: true, label: sections.bar?.title, section: steps['/bar']?.section, url: '/form/1/0/bar/2' },
      //   { active: false, label: sections.baz?.title, section: steps['/baz']?.section, url: '/form/1/0/baz' },
      // ])
    })
  })

  describe('isInEditMode', () => {
    it('returns false when the user is in read-only mode', () => {
      expect(
        isInEditMode(
          {
            identifier: 'TEST_USER',
            displayName: 'Test user',
            accessMode: 'READ_ONLY',
          } as HandoverPrincipal,
          { params: { mode: 'view' } } as unknown as Request,
        ),
      ).toEqual(false)
    })

    it('returns false when the user has edit permissions but is in view mode', () => {
      expect(
        isInEditMode(
          {
            identifier: 'TEST_USER',
            displayName: 'Test user',
            accessMode: 'READ_WRITE',
          } as HandoverPrincipal,
          { params: { mode: 'view' } } as unknown as Request,
        ),
      ).toEqual(false)
    })

    it('returns true when the user is in edit mode', () => {
      expect(
        isInEditMode(
          {
            identifier: 'TEST_USER',
            displayName: 'Test user',
            accessMode: 'READ_WRITE',
          } as HandoverPrincipal,
          { params: { mode: 'edit' } } as unknown as Request,
        ),
      ).toEqual(true)
    })
  })
})
