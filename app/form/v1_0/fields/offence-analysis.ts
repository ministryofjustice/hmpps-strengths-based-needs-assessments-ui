import FormWizard from 'hmpo-form-wizard'
import { FieldsFactory, utils } from './common'
import { formatDateForDisplay } from '../../../../server/utils/nunjucks.utils'
import { FieldType, ValidationType } from '../../../../server/@types/hmpo-form-wizard/enums'
import sections from '../config/sections'
import { dependentOn } from './common/utils'

const endDateSummaryDisplay = (value: string) => `\n${formatDateForDisplay(value) || 'Not provided'}`
const offenceAnalysisDetailsCharacterLimit4k = 4000
const offenceAnalysisDetailsCharacterLimit1k = 1000

class OffenceAnalysisFieldsFactory extends FieldsFactory {
  offenceAnalysisDescriptionOfOffence: FormWizard.Field = {
    text: 'Enter a brief description of the offence',
    code: 'offence_analysis_description_of_offence',
    type: FieldType.TextArea,
    validate: [
      { type: ValidationType.Required, message: 'Enter details' },
      {
        type: ValidationType.MaxLength,
        arguments: [offenceAnalysisDetailsCharacterLimit4k],
        message: `Details must be ${offenceAnalysisDetailsCharacterLimit4k} characters or less`,
      },
    ],
    characterCountMax: offenceAnalysisDetailsCharacterLimit4k,
    labelClasses: utils.getMediumLabelClassFor(FieldType.TextArea),
  }

  offenceAnalysisDate: FormWizard.Field = {
    text: 'When did the offence happen?',
    code: 'offence_analysis_date',
    type: FieldType.Date,
    validate: [
      { type: ValidationType.Required, message: 'Enter the date of the offence' },
      { fn: utils.validatePastDate, message: 'The date of the offence must be in the past' },
    ],
    summary: {
      displayFn: endDateSummaryDisplay,
      displayAlways: true,
    },
    labelClasses: utils.getMediumLabelClassFor(FieldType.Date),
  }

  offenceAnalysisElements: FormWizard.Field = {
    text: 'Did the offence have any of the following elements?',
    code: 'offence_analysis_elements',
    hint: { text: 'Select all that apply.', kind: 'text' },
    type: FieldType.CheckBox,
    multiple: true,
    validate: [
      {
        type: ValidationType.Required,
        message: 'Select if the offence had any of the elements, or select ‘Not applicable’',
      },
    ],
    options: [
      {
        text: 'Excessive violence or sadistic violence',
        value: 'EXCESSIVE_OR_SADISTIC_VIOLENCE',
        kind: 'option',
      },
      {
        text: 'Domestic abuse',
        value: 'DOMESTIC_ABUSE',
        kind: 'option',
      },
      {
        text: 'Sexual element',
        value: 'SEXUAL_ELEMENT',
        kind: 'option',
      },
      {
        text: 'Victim targeted',
        value: 'VICTIM_TARGETED',
        kind: 'option',
      },
      {
        text: 'Violence or threat of violence or coercion',
        value: 'VIOLENCE_OR_COERCION',
        kind: 'option',
      },
      utils.orDivider,
      {
        text: 'None',
        value: 'NONE',
        kind: 'option',
        behaviour: 'exclusive',
      },
    ],
    labelClasses: utils.getMediumLabelClassFor(FieldType.CheckBox),
  }

  victimTargetedDetails: FormWizard.Field = FieldsFactory.detailsFieldNew({
    parentField: this.offenceAnalysisElements,
    dependentValue: 'VICTIM_TARGETED',
    required: true,
  })

  offenceAnalysisReason: FormWizard.Field = {
    text: 'Why did the offence happen?',
    code: 'offence_analysis_reason',
    hint: { text: 'Consider any motivation and triggers.', kind: 'text' },
    type: FieldType.TextArea,
    validate: [
      {
        type: ValidationType.Required,
        message: `Enter details`,
      },
      {
        type: ValidationType.MaxLength,
        arguments: [offenceAnalysisDetailsCharacterLimit4k],
        message: `Details must be ${offenceAnalysisDetailsCharacterLimit4k} characters or less`,
      },
    ],
    labelClasses: utils.getMediumLabelClassFor(FieldType.TextArea),
    characterCountMax: offenceAnalysisDetailsCharacterLimit4k,
  }

  offenceAnalysisGain: FormWizard.Field = {
    text: 'What was [subject] trying to gain from the offence?',
    code: 'offence_analysis_gain',
    type: FieldType.CheckBox,
    hint: { text: 'Select all that apply.', kind: 'text' },
    multiple: true,
    validate: [{ type: ValidationType.Required, message: 'Select what they were trying to gain from the offence' }],
    options: [
      {
        text: 'Exerting power',
        value: 'EXERTING_POWER',
        kind: 'option',
      },
      {
        text: 'Fulfilling specific sexual desires',
        value: 'SEXUAL_DESIRES',
        kind: 'option',
      },
      {
        text: 'Impressing friends/associates',
        value: 'IMPRESSING_PEOPLE',
        kind: 'option',
      },
      {
        text: 'Individual was in a highly emotional state that clouded judgement',
        value: 'EMOTIONS_CLOUDED_JUDGEMENT',
        kind: 'option',
      },
      {
        text: 'Meeting basic financial needs',
        value: 'BASIC_FINANCIAL_NEEDS',
        kind: 'option',
      },
      {
        text: 'Supporting drug use',
        value: 'SUPPORTING_DRUG_USE',
        kind: 'option',
      },
      {
        text: 'Supporting lifestyle beyond basic needs',
        value: 'SUPPORTING_LIFESTYLE',
        kind: 'option',
      },
      {
        text: 'The individual was pressurised or led into offending by others',
        value: 'PRESSURISED',
        kind: 'option',
      },
      {
        text: 'Other',
        value: 'OTHER',
        kind: 'option',
      },
    ],
    labelClasses: utils.getMediumLabelClassFor(FieldType.CheckBox),
  }

  otherOffenceGainDetails: FormWizard.Field = FieldsFactory.detailsFieldNew({
    parentField: this.offenceAnalysisGain,
    dependentValue: 'OTHER',
  })

  offenceAnalysisVictimDetails: FormWizard.Field = {
    text: 'Enter all victim details',
    code: 'offence_analysis_victim_details',
    hint: { text: 'Include things like age, sex, relationship to [subject] and impact.', kind: 'text' },
    type: FieldType.TextArea,
    validate: [
      {
        type: ValidationType.Required,
        message: `Enter details`,
      },
      {
        type: ValidationType.MaxLength,
        arguments: [offenceAnalysisDetailsCharacterLimit1k],
        message: `Details must be ${offenceAnalysisDetailsCharacterLimit1k} characters or less`,
      },
    ],
    characterCountMax: offenceAnalysisDetailsCharacterLimit1k,
    labelClasses: utils.getMediumLabelClassFor(FieldType.TextArea),
  }

  offenceAnalysisImpactOnVictims: FormWizard.Field = {
    text: 'Does [subject] recognise the impact or consequences on the victims or others and the wider community?',
    code: 'offence_analysis_impact_on_victims',
    type: FieldType.Radio,
    validate: [
      {
        type: ValidationType.Required,
        message: 'Select if they recognise the impact on the victim or consequences for others and the wider community',
      },
    ],
    options: [
      {
        text: 'Yes',
        value: 'YES',
        kind: 'option',
      },
      {
        text: 'No',
        value: 'NO',
        kind: 'option',
      },
    ],
    labelClasses: utils.getMediumLabelClassFor(FieldType.Radio),
  }

  yesImpactOnVictimsDetails: FormWizard.Field = FieldsFactory.detailsFieldNew({
    parentField: this.offenceAnalysisImpactOnVictims,
    dependentValue: 'YES',
  })

  noImpactOnVictimsDetails: FormWizard.Field = FieldsFactory.detailsFieldNew({
    parentField: this.offenceAnalysisImpactOnVictims,
    dependentValue: 'NO',
  })

  offenceAnalysisRisk: FormWizard.Field = {
    text: 'Is the offence linked to risk of serious harm, risks to the individual or other risks?',
    code: 'offence_analysis_risk',
    type: FieldType.Radio,
    validate: [
      {
        type: ValidationType.Required,
        message: 'Select if the offence is linked to risk of serious harm, risks to the individual or other risks',
      },
    ],
    options: [
      {
        text: 'Yes',
        value: 'YES',
        kind: 'option',
      },
      {
        text: 'No',
        value: 'NO',
        kind: 'option',
      },
    ],
    labelClasses: utils.getMediumLabelClassFor(FieldType.Radio),
  }

  yesOffenceRiskDetails: FormWizard.Field = FieldsFactory.detailsFieldNew({
    parentField: this.offenceAnalysisRisk,
    dependentValue: 'YES',
    required: true,
  })

  noOffenceRiskDetails: FormWizard.Field = FieldsFactory.detailsFieldNew({
    parentField: this.offenceAnalysisRisk,
    dependentValue: 'NO',
    required: true,
  })

  offenceAnalysisPatternsOfOffending: FormWizard.Field = {
    text: 'What are the patterns of offending?',
    code: 'offence_analysis_patterns_of_offending',
    hint: { text: 'Analyse previous convictions and offending behaviour.', kind: 'text' },
    type: FieldType.TextArea,
    validate: [
      { type: ValidationType.Required, message: 'Enter details' },
      {
        type: ValidationType.MaxLength,
        arguments: [offenceAnalysisDetailsCharacterLimit1k],
        message: `Details must be ${offenceAnalysisDetailsCharacterLimit1k} characters or less`,
      },
    ],
    characterCountMax: offenceAnalysisDetailsCharacterLimit1k,
    labelClasses: utils.getMediumLabelClassFor(FieldType.TextArea),
  }

  offenceAnalysisPerpetratorOfDomesticAbuse: FormWizard.Field = {
    text: 'Is there evidence that [subject] has ever been a perpetrator of domestic abuse?',
    code: 'offence_analysis_perpetrator_of_domestic_abuse',
    type: FieldType.Radio,
    validate: [
      {
        type: ValidationType.Required,
        message: 'Select if there is any evidence that they have ever been perpetrator of domestic abuse',
      },
    ],
    options: [
      { text: 'Yes', value: 'YES', kind: 'option' },
      { text: 'No', value: 'NO', kind: 'option' },
    ],
    labelClasses: utils.getMediumLabelClassFor(FieldType.Radio),
  }

  domesticAbusePerpetratorType: FormWizard.Field = {
    text: 'Who was this committed against?',
    code: 'domestic_abuse_perpetrator_type',
    type: FieldType.Radio,
    validate: [{ type: ValidationType.Required, message: 'Select an option' }],
    options: [
      { text: 'Family member', value: 'FAMILY_MEMBER', kind: 'option' },
      { text: 'Intimate partner', value: 'INTIMATE_PARTNER', kind: 'option' },
      { text: 'Family member and intimate partner', value: 'FAMILY_MEMBER_AND_INTIMATE_PARTNER', kind: 'option' },
    ],
    dependent: dependentOn(this.offenceAnalysisPerpetratorOfDomesticAbuse, 'YES'),
  }

  perpetratorFamilyMemberDomesticAbuseDetails: FormWizard.Field = FieldsFactory.detailsFieldNew({
    parentField: this.domesticAbusePerpetratorType,
    dependentValue: 'FAMILY_MEMBER',
    required: true,
  })

  perpetratorIntimatePartnerDomesticAbuseDetails: FormWizard.Field = FieldsFactory.detailsFieldNew({
    parentField: this.domesticAbusePerpetratorType,
    dependentValue: 'INTIMATE_PARTNER',
    required: true,
  })

  perpetratorFamilyAndIntimatePartnerDomesticAbuseDetails: FormWizard.Field = FieldsFactory.detailsFieldNew({
    parentField: this.domesticAbusePerpetratorType,
    dependentValue: 'FAMILY_MEMBER_AND_INTIMATE_PARTNER',
    required: true,
  })

  offenceAnalysisVictimOfDomesticAbuse: FormWizard.Field = {
    text: 'Is there evidence that [subject] has ever been a victim of domestic abuse?',
    code: 'offence_analysis_victim_of_domestic_abuse',
    type: FieldType.Radio,
    validate: [
      {
        type: ValidationType.Required,
        message: 'Select if there is evidence that they have ever been victim of domestic abuse',
      },
    ],
    options: [
      { text: 'Yes', value: 'YES', kind: 'option' },
      { text: 'No', value: 'NO', kind: 'option' },
    ],
    labelClasses: utils.getMediumLabelClassFor(FieldType.Radio),
  }

  domesticAbuseVictimType: FormWizard.Field = {
    text: 'Who was this committed by?',
    code: 'domestic_abuse_victim_type',
    type: FieldType.Radio,
    validate: [{ type: ValidationType.Required, message: 'Select an option' }],
    options: [
      { text: 'Family member', value: 'FAMILY_MEMBER', kind: 'option' },
      { text: 'Intimate partner', value: 'INTIMATE_PARTNER', kind: 'option' },
      { text: 'Family member and intimate partner', value: 'FAMILY_MEMBER_AND_INTIMATE_PARTNER', kind: 'option' },
    ],
    dependent: dependentOn(this.offenceAnalysisVictimOfDomesticAbuse, 'YES'),
    labelClasses: utils.visuallyHidden,
  }

  victimFamilyMemberDomesticAbuseDetails: FormWizard.Field = FieldsFactory.detailsFieldNew({
    parentField: this.domesticAbuseVictimType,
    dependentValue: 'FAMILY_MEMBER',
    required: true,
  })

  victimIntimatePartnerDomesticAbuseDetails: FormWizard.Field = FieldsFactory.detailsFieldNew({
    parentField: this.domesticAbuseVictimType,
    dependentValue: 'INTIMATE_PARTNER',
    required: true,
  })

  victimFamilyAndIntimatePartnerDomesticAbuseDetails: FormWizard.Field = FieldsFactory.detailsFieldNew({
    parentField: this.domesticAbuseVictimType,
    dependentValue: 'FAMILY_MEMBER_AND_INTIMATE_PARTNER',
    required: true,
  })
}

export default new OffenceAnalysisFieldsFactory(sections.offenceAnalysis)
