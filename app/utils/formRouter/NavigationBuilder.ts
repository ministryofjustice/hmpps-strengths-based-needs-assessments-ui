import FormWizard from 'hmpo-form-wizard'
import { Section } from '../../form/v1_0/config/sections'

export type NavigationItem = {
  url: string
  section: string
  label: string
  active: boolean
  subsections?: Array<{ title: string; code: string; url?: string; active?: boolean }>
}

export const getLastStepOfSection = (steps: FormWizard.Steps, sectionName: string) =>
  Object.entries(steps).find(([_path, step]) => step.section === sectionName && step.isLastStep)[0]

const removeQueryParamsFrom = (urlWithParams: string) => {
  const [url] = urlWithParams.split('?')
  return url
}

function isCurrentRouteInSubsection(currentRoute: string, subsection: Section): boolean {
  if (!subsection?.stepUrls) return false
  const stepUrls = Object.values(subsection.stepUrls)
  return stepUrls.some(url => url === currentRoute.substring(1))
}

/*
 * Find out which subsection the current URL is in and then return the first step
 * in that subsection.
 */
export function getInitialStepUrlForSubsection(
  sections: Record<string, Section>,
  sectionName: string,
  subsectionName: string,
  steps: FormWizard.RenderedSteps,
): string {
  const section = sections[sectionName]
  const subsection = section?.subsections?.[subsectionName]
  const subsectionStepUrls = Object.values(subsection?.stepUrls || {})
  const initialStep = Object.entries(steps).find(
    ([stepUrl, step]) => step.initialStepInSection === true && subsectionStepUrls.includes(stepUrl.substring(1)),
  )
  return initialStep?.[1].route.substring(1) || subsectionStepUrls[0]
}

/**
 * Builds the sidebar navigation object for rendering at the frontend.
 *
 */
export function createNavigation(
  baseUrl: string,
  sections: Record<string, Section>,
  currentSectionName: string,
  steps: FormWizard.RenderedSteps,
  currentRoute: string,
  isInEditMode: boolean,
): Array<NavigationItem> {
  return Object.entries(sections)
    .filter(([_, section]) => section.navigationOrder)
    .sort(([_keyA, sectionA], [_keyB, sectionB]) => sectionA.navigationOrder - sectionB.navigationOrder)
    .map(([sectionKey, section]) =>
      createNavigationItem(
        section,
        isInEditMode,
        baseUrl,
        sections,
        sectionKey,
        steps,
        currentSectionName,
        currentRoute,
      ),
    )
}

function createNavigationItem(
  section: Section,
  isInEditMode: boolean,
  baseUrl: string,
  sections: Record<string, Section>,
  sectionKey: string,
  steps: FormWizard.RenderedSteps,
  currentSection: string,
  currentRoute: string,
) {
  let url = `${baseUrl}/${section.code}?action=resume`
  let subsections

  if (section.subsections) {
    subsections = Object.entries(section.subsections)
      .sort(([, subsectionA], [, subsectionB]) => subsectionA.navigationOrder - subsectionB.navigationOrder)
      .map(([subsectionKey, subsection]) => ({
        title: subsection.title,
        code: subsection.code,
        url: isInEditMode
          ? `${baseUrl}/${getInitialStepUrlForSubsection(sections, sectionKey, subsectionKey, steps)}?action=resume`
          : `${baseUrl}/${Object.values(subsection.stepUrls)[Object.values(subsection.stepUrls).length - 1]}`,
        active: isCurrentRouteInSubsection(currentRoute, subsection),
      }))

    url = `${baseUrl}/${section.code}-tasks`
  }

  return {
    url,
    code: section.code,
    section: section.code,
    label: section.title,
    active: section.code === currentSection,
    subsections,
  }
}

export const createSectionProgressRules = (
  steps: FormWizard.Steps,
): Array<{ sectionName: string; fieldCodes: string[] }> => {
  const sectionRules: Record<string, string[]> = Object.values(steps)
    .map((step): [string, Array<string>] => [step.section, (step.sectionProgressRules || []).map(it => it.fieldCode)])
    .filter(([sectionName]) => sectionName !== 'none')
    .reduce(
      (sectionsAcc, [sectionName, rules]) => ({
        ...sectionsAcc,
        [sectionName]: [...(sectionsAcc[sectionName] || []), ...rules],
      }),
      {} as Record<string, string[]>,
    )

  return Object.entries(sectionRules).map(([sectionName, fieldCodes]) => ({
    sectionName,
    fieldCodes: [...new Set(fieldCodes)],
  }))
}

export const getStepFrom = (steps: FormWizard.Steps, url: string): FormWizard.Step => steps[removeQueryParamsFrom(url)]
