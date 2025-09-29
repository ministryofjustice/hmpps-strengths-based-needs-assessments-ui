import FormWizard from 'hmpo-form-wizard'
import { setFieldToCompleteWhenValid, nextWhen } from './common'
import accommodationFields from '../fields/accommodation'
import sections, { SectionConfig } from '../config/sections'
import templates from '../config/templates'

const section = sections.accommodation
const sectionBackground = section.subsections.background
const sectionPractitionerAnalysis = section.subsections.practitionerAnalysis

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
  steps: [
    {
      url: 'accommodation-tasks',
      template: templates.sectionTasks,
    },
    {
      url: sectionBackground.stepUrls.currentAccommodation,
      fields: [
        accommodationTypeGroup,
        accommodationFields.isUserSubmitted(sectionBackground.stepUrls.currentAccommodation),
        accommodationFields.backgroundSectionComplete(),
      ].flat(),
      next: [
        nextWhen(accommodationFields.currentAccommodation, 'SETTLED', sectionBackground.stepUrls.settledAccommodation),
        nextWhen(accommodationFields.currentAccommodation, 'TEMPORARY', [
          nextWhen(
            accommodationFields.typeOfTemporaryAccommodation,
            'SHORT_TERM',
            sectionBackground.stepUrls.temporaryAccommodation,
          ),
          nextWhen(
            accommodationFields.typeOfTemporaryAccommodation,
            'IMMIGRATION',
            sectionBackground.stepUrls.temporaryAccommodation,
          ),
          sectionBackground.stepUrls.temporaryAccommodationCasAp,
        ]),
        nextWhen(
          accommodationFields.currentAccommodation,
          'NO_ACCOMMODATION',
          sectionBackground.stepUrls.noAccommodation,
        ),
      ],
      initialStepInSection: true,
      sectionProgressRules: [],
    },
    {
      url: sectionBackground.stepUrls.settledAccommodation,
      fields: [
        livingWithGroup,
        suitableLocationGroup,
        suitableAccommodationGroup,
        accommodationFields.wantToMakeChanges(),
        accommodationFields.isUserSubmitted(sectionBackground.stepUrls.settledAccommodation),
        accommodationFields.backgroundSectionComplete(),
      ].flat(),
      next: sectionBackground.stepUrls.backgroundSummary,
      sectionProgressRules: [setFieldToCompleteWhenValid(sectionBackground.sectionCompleteField)],
    },
    {
      url: sectionBackground.stepUrls.temporaryAccommodation,
      fields: [
        livingWithGroup,
        suitableLocationGroup,
        suitableAccommodationGroup,
        suitableHousingPlannedGroup,
        accommodationFields.wantToMakeChanges(),
        accommodationFields.isUserSubmitted(sectionBackground.stepUrls.temporaryAccommodation),
        accommodationFields.backgroundSectionComplete(),
      ].flat(),
      next: sectionBackground.stepUrls.backgroundSummary,
      sectionProgressRules: [setFieldToCompleteWhenValid(sectionBackground.sectionCompleteField)],
    },
    {
      url: sectionBackground.stepUrls.temporaryAccommodationCasAp,
      fields: [
        suitableLocationGroup,
        suitableAccommodationGroup,
        suitableHousingPlannedGroup,
        accommodationFields.wantToMakeChanges(),
        accommodationFields.isUserSubmitted(sectionBackground.stepUrls.temporaryAccommodationCasAp),
        accommodationFields.backgroundSectionComplete(),
      ].flat(),
      next: sectionBackground.stepUrls.backgroundSummary,
      sectionProgressRules: [setFieldToCompleteWhenValid(sectionBackground.sectionCompleteField)],
    },
    {
      url: sectionBackground.stepUrls.noAccommodation,
      fields: [
        noAccommodationGroup,
        suitableHousingPlannedGroup,
        accommodationFields.wantToMakeChanges(),
        accommodationFields.isUserSubmitted(sectionBackground.stepUrls.noAccommodation),
        accommodationFields.backgroundSectionComplete(),
      ].flat(),
      next: sectionBackground.stepUrls.backgroundSummary,
      sectionProgressRules: [setFieldToCompleteWhenValid(sectionBackground.sectionCompleteField)],
    },
    {
      url: sectionBackground.stepUrls.backgroundSummary,
      template: templates.backgroundSummary,
      pageTitle: `${sectionBackground.title} summary`,
    },
    {
      url: sectionPractitionerAnalysis.stepUrls.analysis,
      fields: [
        accommodationFields.isUserSubmitted(sectionPractitionerAnalysis.stepUrls.analysis),
        accommodationFields.practitionerAnalysis(),
        accommodationFields.practitionerAnalysisSectionComplete(),
        accommodationFields.sectionComplete(),
      ].flat(),
      next: sectionPractitionerAnalysis.stepUrls.analysisSummary,
      template: templates.analysis,
      initialStepInSection: true,
      sectionProgressRules: [
        setFieldToCompleteWhenValid(sectionPractitionerAnalysis.sectionCompleteField),
        setFieldToCompleteWhenValid(section.sectionCompleteField),
      ],
    },
    {
      url: sectionPractitionerAnalysis.stepUrls.analysisSummary,
      template: templates.analysisSummary,
    },
  ],
}

export default sectionConfig
