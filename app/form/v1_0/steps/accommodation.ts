import FormWizard from 'hmpo-form-wizard'
import { setFieldToIncomplete, setFieldToCompleteWhenValid } from './common'
import accommodationFields from '../fields/accommodation'
import sections, { SectionConfig } from '../config/sections'
import templates from '../config/templates'

const section = sections.accommodation
const stepUrls = {
  accommodation: 'accommodation',
  settledAccommodation: 'settled-accommodation',
  temporaryAccommodation: 'temporary-accommodation',
  temporaryAccommodation2: 'temporary-accommodation-2',
  noAccommodation: 'no-accommodation',
  analysis: 'accommodation-analysis',
  analysisComplete: 'accommodation-analysis-complete',
}

const accommodationTypeGroup: FormWizard.Field[] = [
  accommodationFields.currentAccommodation,
  accommodationFields.typeOfSettledAccommodation,
  accommodationFields.typeOfTemporaryAccommodation,
  accommodationFields.shortTermAccommodationEndDate,
  accommodationFields.approvedPremisesEndDate,
  accommodationFields.cas2EndDate,
  accommodationFields.cas3EndDate,
  accommodationFields.immigrationAccommodationEndDate,
  accommodationFields.typeOfNoAccommodation,
]

const livingWithGroup: FormWizard.Field[] = [
  accommodationFields.livingWith,
  accommodationFields.livingWithDetailsGroup,
].flat()

const suitableLocationGroup: FormWizard.Field[] = [
  accommodationFields.suitableHousingLocation,
  accommodationFields.suitableHousingLocationConcerns,
  accommodationFields.suitableHousingLocationConcernsDetails,
]

const suitableAccommodationGroup: FormWizard.Field[] = [
  accommodationFields.suitableHousing,
  accommodationFields.suitableHousingConcerns,
  accommodationFields.suitableHousingConcernsDetails,
  accommodationFields.unsuitableHousingConcerns,
  accommodationFields.unsuitableHousingConcernsDetails,
]

const suitableHousingPlannedGroup: FormWizard.Field[] = [
  accommodationFields.suitableHousingPlanned,
  accommodationFields.futureAccommodationType,
  accommodationFields.futureAccommodationTypeDetailsGroup,
].flat()

const noAccommodationGroup: FormWizard.Field[] = [
  accommodationFields.noAccommodationReason,
  accommodationFields.noAccommodationReasonDetails,
  accommodationFields.pastAccommodationDetails,
]

export const nextWhen = (
  field: FormWizard.Field,
  option: string | string[],
  next: FormWizard.Step.NextStep,
): FormWizard.Step.NextStep => {
  const optionArray = Array.isArray(option) ? option : [option]

  const includesOption = (requiredOption: string) =>
    field.options.findIndex(o => o.kind === 'option' && o.value === requiredOption) !== -1

  if (!Array.isArray(field.options) || !optionArray.every(includesOption)) {
    throw Error(`Failed to create next route, target field "${field.code}" does not contain the option "${option}"`)
  }

  const nextStep: FormWizard.Step.NextStep = {
    field: field.code,
    value: option,
    next,
  }

  if (optionArray.length > 1) {
    nextStep.op = 'in'
  }

  return nextStep
}

const sectionConfig: SectionConfig = {
  section,
  steps: [
    {
      url: stepUrls.accommodation,
      fields: [
        accommodationTypeGroup,
        accommodationFields.isUserSubmitted(stepUrls.accommodation),
        accommodationFields.sectionComplete(),
      ].flat(),
      next: [
        nextWhen(accommodationFields.currentAccommodation, 'SETTLED', stepUrls.settledAccommodation),
        nextWhen(accommodationFields.currentAccommodation, 'TEMPORARY', [
          nextWhen(accommodationFields.typeOfTemporaryAccommodation, 'SHORT_TERM', stepUrls.temporaryAccommodation),
          nextWhen(accommodationFields.typeOfTemporaryAccommodation, 'IMMIGRATION', stepUrls.temporaryAccommodation),
          stepUrls.temporaryAccommodation2,
        ]),
        nextWhen(accommodationFields.currentAccommodation, 'NO_ACCOMMODATION', stepUrls.noAccommodation),
      ],
      navigationOrder: 1,
      sectionProgressRules: [setFieldToIncomplete(section.sectionCompleteField)],
    },
    {
      url: stepUrls.settledAccommodation,
      fields: [
        livingWithGroup,
        suitableLocationGroup,
        suitableAccommodationGroup,
        accommodationFields.wantToMakeChanges(),
        accommodationFields.isUserSubmitted(stepUrls.settledAccommodation),
        accommodationFields.sectionComplete(),
      ].flat(),
      next: stepUrls.analysis,
      backLink: stepUrls.accommodation,
      sectionProgressRules: [setFieldToIncomplete(section.sectionCompleteField)],
    },
    {
      url: stepUrls.temporaryAccommodation,
      fields: [
        livingWithGroup,
        suitableLocationGroup,
        suitableAccommodationGroup,
        suitableHousingPlannedGroup,
        accommodationFields.wantToMakeChanges(),
        accommodationFields.isUserSubmitted(stepUrls.temporaryAccommodation),
        accommodationFields.sectionComplete(),
      ].flat(),
      next: stepUrls.analysis,
      backLink: stepUrls.accommodation,
      sectionProgressRules: [setFieldToIncomplete(section.sectionCompleteField)],
    },
    {
      url: stepUrls.temporaryAccommodation2,
      fields: [
        suitableAccommodationGroup,
        suitableHousingPlannedGroup,
        accommodationFields.wantToMakeChanges(),
        accommodationFields.isUserSubmitted(stepUrls.temporaryAccommodation2),
        accommodationFields.sectionComplete(),
      ].flat(),
      next: stepUrls.analysis,
      backLink: stepUrls.accommodation,
      sectionProgressRules: [setFieldToIncomplete(section.sectionCompleteField)],
    },
    {
      url: stepUrls.noAccommodation,
      fields: [
        noAccommodationGroup,
        suitableHousingPlannedGroup,
        accommodationFields.wantToMakeChanges(),
        accommodationFields.isUserSubmitted(stepUrls.noAccommodation),
        accommodationFields.sectionComplete(),
      ].flat(),
      next: stepUrls.analysis,
      backLink: stepUrls.accommodation,
      sectionProgressRules: [setFieldToIncomplete(section.sectionCompleteField)],
    },
    {
      url: stepUrls.analysis,
      fields: [
        accommodationFields.practitionerAnalysis(),
        accommodationFields.isUserSubmitted(stepUrls.analysis),
        accommodationFields.sectionComplete(),
      ].flat(),
      next: `${stepUrls.analysisComplete}#practitioner-analysis`,
      template: templates.analysisIncomplete,
      sectionProgressRules: [setFieldToCompleteWhenValid(section.sectionCompleteField)],
    },
    {
      url: stepUrls.analysisComplete,
      template: templates.analysisComplete,
    },
  ],
}

export default sectionConfig
