import FormWizard from 'hmpo-form-wizard'
import { setFieldToIncomplete, setFieldToCompleteWhenValid, nextWhen } from './common'
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
      url: sectionBackground.stepUrls.currentAccommodation,
      fields: [
        accommodationTypeGroup,
        accommodationFields.isUserSubmitted(sectionBackground.stepUrls.currentAccommodation),
        accommodationFields.sectionComplete(),
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
      navigationOrder: 1,
      sectionProgressRules: [setFieldToIncomplete(sectionBackground.sectionCompleteField)],
    },
    {
      url: sectionBackground.stepUrls.settledAccommodation,
      fields: [
        livingWithGroup,
        suitableLocationGroup,
        suitableAccommodationGroup,
        accommodationFields.wantToMakeChanges(),
        accommodationFields.isUserSubmitted(sectionBackground.stepUrls.settledAccommodation),
        accommodationFields.sectionComplete(),
      ].flat(),
      next: sectionBackground.stepUrls.backgroundSummary,
      sectionProgressRules: [setFieldToIncomplete(sectionBackground.sectionCompleteField)],
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
        accommodationFields.sectionComplete(),
      ].flat(),
      next: sectionBackground.stepUrls.backgroundSummary,
      sectionProgressRules: [setFieldToIncomplete(sectionBackground.sectionCompleteField)],
    },
    {
      url: sectionBackground.stepUrls.temporaryAccommodationCasAp,
      fields: [
        suitableLocationGroup,
        suitableAccommodationGroup,
        suitableHousingPlannedGroup,
        accommodationFields.wantToMakeChanges(),
        accommodationFields.isUserSubmitted(sectionBackground.stepUrls.temporaryAccommodationCasAp),
        accommodationFields.sectionComplete(),
      ].flat(),
      next: sectionBackground.stepUrls.backgroundSummary,
      sectionProgressRules: [setFieldToIncomplete(sectionBackground.sectionCompleteField)],
    },
    {
      url: sectionBackground.stepUrls.noAccommodation,
      fields: [
        noAccommodationGroup,
        suitableHousingPlannedGroup,
        accommodationFields.wantToMakeChanges(),
        accommodationFields.isUserSubmitted(sectionBackground.stepUrls.noAccommodation),
        accommodationFields.sectionComplete(),
      ].flat(),
      next: sectionBackground.stepUrls.backgroundSummary,
      sectionProgressRules: [setFieldToIncomplete(sectionBackground.sectionCompleteField)],
    },
    {
      url: sectionBackground.stepUrls.backgroundSummary,
      fields: [
        accommodationFields.isUserSubmitted(sectionBackground.stepUrls.backgroundSummary),
        accommodationFields.sectionComplete(),
      ].flat(),
      next: sectionPractitionerAnalysis.stepUrls.analysis,
      template: templates.analysisIncomplete,
      sectionProgressRules: [setFieldToCompleteWhenValid(sectionBackground.sectionCompleteField)],
    },
    {
      url: sectionPractitionerAnalysis.stepUrls.analysis,
      fields: [
        accommodationFields.practitionerAnalysis(),
        accommodationFields.isUserSubmitted(sectionPractitionerAnalysis.stepUrls.analysis),
        accommodationFields.sectionComplete(),
      ].flat(),
      next: sectionPractitionerAnalysis.stepUrls.analysisSummary,
      template: templates.analysisIncomplete,
      sectionProgressRules: [setFieldToIncomplete(sectionPractitionerAnalysis.sectionCompleteField)],
    },
    {
      url: sectionPractitionerAnalysis.stepUrls.analysisSummary,
      fields: [
        accommodationFields.isUserSubmitted(sectionPractitionerAnalysis.stepUrls.analysisSummary),
        accommodationFields.sectionComplete(),
      ].flat(),
      template: templates.analysisComplete,
      sectionProgressRules: [setFieldToCompleteWhenValid(sectionPractitionerAnalysis.sectionCompleteField)],
    },
  ],
}

export default sectionConfig
