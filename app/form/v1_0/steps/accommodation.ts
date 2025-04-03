import FormWizard from 'hmpo-form-wizard'
import { setFieldToIncomplete, setFieldToCompleteWhenValid, nextWhen } from './common'
import accommodationFields from '../fields/accommodation'
import sections, { SectionConfig } from '../config/sections'
import templates from '../config/templates'

const section = sections.accommodation

const groups = {
  background: 'Accommodation background',
  summary: 'Summary',
  analysis: 'Analysis',
}

const stepUrls = {
  currentAccommodation: 'current-accommodation',
  settledAccommodation: 'settled-accommodation',
  temporaryAccommodation: 'temporary-accommodation',
  temporaryAccommodationCasAp: 'temporary-accommodation-cas-ap',
  noAccommodation: 'no-accommodation',
  summary: 'accommodation-summary',
  analysis: 'accommodation-analysis',
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

const sectionConfig: SectionConfig = {
  section,
  groups,
  steps: [
    {
      group: groups.background,
      url: stepUrls.currentAccommodation,
      fields: [
        accommodationTypeGroup,
        accommodationFields.isUserSubmitted(stepUrls.currentAccommodation),
        accommodationFields.sectionComplete(),
      ].flat(),
      next: [
        nextWhen(accommodationFields.currentAccommodation, 'SETTLED', stepUrls.settledAccommodation),
        nextWhen(accommodationFields.currentAccommodation, 'TEMPORARY', [
          nextWhen(accommodationFields.typeOfTemporaryAccommodation, 'SHORT_TERM', stepUrls.temporaryAccommodation),
          nextWhen(accommodationFields.typeOfTemporaryAccommodation, 'IMMIGRATION', stepUrls.temporaryAccommodation),
          stepUrls.temporaryAccommodationCasAp,
        ]),
        nextWhen(accommodationFields.currentAccommodation, 'NO_ACCOMMODATION', stepUrls.noAccommodation),
      ],
      sectionProgressRules: [setFieldToIncomplete(section.sectionCompleteField)],
      isSectionEntryPoint: true,
      isGroupEntryPoint: true,
    },
    {
      group: groups.background,
      url: stepUrls.settledAccommodation,
      fields: [
        livingWithGroup,
        suitableLocationGroup,
        suitableAccommodationGroup,
        accommodationFields.wantToMakeChanges(),
        accommodationFields.isUserSubmitted(stepUrls.settledAccommodation),
        accommodationFields.sectionComplete(),
      ].flat(),
      next: stepUrls.summary,
      sectionProgressRules: [setFieldToIncomplete(section.sectionCompleteField)],
    },
    {
      group: groups.background,
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
      next: stepUrls.summary,
      sectionProgressRules: [setFieldToIncomplete(section.sectionCompleteField)],
    },
    {
      group: groups.background,
      url: stepUrls.temporaryAccommodationCasAp,
      fields: [
        suitableLocationGroup,
        suitableAccommodationGroup,
        suitableHousingPlannedGroup,
        accommodationFields.wantToMakeChanges(),
        accommodationFields.isUserSubmitted(stepUrls.temporaryAccommodationCasAp),
        accommodationFields.sectionComplete(),
      ].flat(),
      next: stepUrls.summary,
      sectionProgressRules: [setFieldToIncomplete(section.sectionCompleteField)],
    },
    {
      group: groups.background,
      url: stepUrls.noAccommodation,
      fields: [
        noAccommodationGroup,
        suitableHousingPlannedGroup,
        accommodationFields.wantToMakeChanges(),
        accommodationFields.isUserSubmitted(stepUrls.noAccommodation),
        accommodationFields.sectionComplete(),
      ].flat(),
      next: stepUrls.summary,
      sectionProgressRules: [setFieldToIncomplete(section.sectionCompleteField)],
    },
    {
      group: groups.summary,
      url: stepUrls.summary,
      fields: [
        accommodationFields.practitionerAnalysis(),
        accommodationFields.isUserSubmitted(stepUrls.summary),
        accommodationFields.sectionComplete(),
      ].flat(),
      next: `${stepUrls.analysis}#practitioner-analysis`,
      template: templates.analysisIncomplete,
      sectionProgressRules: [setFieldToCompleteWhenValid(section.sectionCompleteField)],
    },
    {
      group: groups.analysis,
      url: stepUrls.analysis,
      template: templates.analysisComplete,
    },
  ],
}

export default sectionConfig
