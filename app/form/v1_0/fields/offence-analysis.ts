import FormWizard from 'hmpo-form-wizard'
import { FieldsFactory, utils } from './common'
import { FieldType, ValidationType } from '../../../../server/@types/hmpo-form-wizard/enums'
import sections from '../config/sections'
import { dependentOn, yesNoOptions } from './common/utils'
import characterLimits from '../config/characterLimits'

class OffenceAnalysisFieldsFactory extends FieldsFactory {
  offenceAnalysisDescriptionOfOffence: FormWizard.Field = {
    text: 'Enter a brief description of the current index offence(s)',
    code: 'offence_analysis_description_of_offence',
    type: FieldType.TextArea,
    validate: [
      { type: ValidationType.Required, message: 'Enter details' },
      {
        type: ValidationType.MaxLength,
        arguments: [characterLimits.c4000],
        message: `Details must be ${characterLimits.c4000} characters or less`,
      },
    ],
    labelClasses: utils.getMediumLabelClassFor(FieldType.TextArea),
  }

  offenceAnalysisElements: FormWizard.Field = {
    text: 'Did the current index offence(s) have any of the following elements?',
    code: 'offence_analysis_elements',
    hint: { text: 'Select all that apply.', kind: 'text' },
    type: FieldType.CheckBox,
    multiple: true,
    validate: [
      {
        type: ValidationType.Required,
        message: 'Select if the offence(s) had any of the elements',
      },
    ],
    options: [
      {
        text: 'Arson',
        value: 'ARSON',
        kind: 'option',
      },
      {
        text: 'Domestic abuse',
        value: 'DOMESTIC_ABUSE',
        kind: 'option',
      },
      {
        text: 'Excessive violence or sadistic violence',
        value: 'EXCESSIVE_OR_SADISTIC_VIOLENCE',
        kind: 'option',
      },
      {
        text: 'Hatred of identifiable groups',
        value: 'HATRED_OF_IDENTIFIABLE_GROUPS',
        kind: 'option',
      },
      {
        text: 'Physical damage to property',
        value: 'PHYSICAL_DAMAGE_TO_PROPERTY',
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
        text: 'Violence, or threat of violence or coercion',
        value: 'VIOLENCE_OR_COERCION',
        kind: 'option',
      },
      {
        text: 'Weapon',
        value: 'WEAPON',
        kind: 'option',
      },
      {
        text: 'None',
        value: 'NONE',
        kind: 'option',
        behaviour: 'exclusive',
      },
    ],
    labelClasses: utils.getMediumLabelClassFor(FieldType.CheckBox),
  }

  victimTargetedDetails: FormWizard.Field = FieldsFactory.detailsField({
    parentField: this.offenceAnalysisElements,
    dependentValue: 'VICTIM_TARGETED',
    required: true,
  })

  offenceAnalysisReason: FormWizard.Field = {
    text: 'Why did the current index offence(s) happen?',
    code: 'offence_analysis_reason',
    type: FieldType.TextArea,
    validate: [
      { type: ValidationType.Required, message: `Enter details` },
      {
        type: ValidationType.MaxLength,
        arguments: [characterLimits.c4000],
        message: `Details must be ${characterLimits.c4000} characters or less`,
      },
    ],
    labelClasses: utils.getMediumLabelClassFor(FieldType.TextArea),
  }

  offenceAnalysisMotivation: FormWizard.Field = {
    text: 'Did the current index offence(s) involve any of the following motivations?',
    code: 'offence_analysis_motivations',
    type: FieldType.CheckBox,
    hint: { text: 'Select all that apply.', kind: 'text' },
    multiple: true,
    validate: [
      { type: ValidationType.Required, message: 'Select if the offence(s) involved any of the following motivations' },
    ],
    options: [
      {
        text: 'Addictions or perceived needs',
        value: 'ADDICTIONS_OR_PERCEIVED_NEEDS',
        kind: 'option',
      },
      {
        text: 'Being pressurised or led into offending by others',
        value: 'PRESSURISED_BY_OTHERS',
        kind: 'option',
      },
      {
        text: 'Emotional state of [subject]',
        value: 'EMOTIONAL_STATE',
        kind: 'option',
      },
      {
        text: 'Financial motivation',
        value: 'FINANCIAL_MOTIVATION',
        kind: 'option',
      },
      {
        text: 'Hatred of identifiable groups',
        value: 'HATRED_OF_IDENTIFIABLE_GROUPS',
        kind: 'option',
      },
      {
        text: 'Seeking or exerting power',
        value: 'SEEKING_OR_EXERTING_POWER',
        kind: 'option',
      },
      {
        text: 'Sexual motivation',
        value: 'SEXUAL_MOTIVATION',
        kind: 'option',
      },
      {
        text: 'Thrill seeking',
        value: 'THRILL_SEEKING',
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

  otherOffenceMotivationDetails: FormWizard.Field = FieldsFactory.detailsField({
    parentField: this.offenceAnalysisMotivation,
    dependentValue: 'OTHER',
    required: true,
    maxChars: characterLimits.c128,
  })

  offenceAnalysisWhoWasTheOffenceCommittedAgainst: FormWizard.Field = {
    text: 'Who was the offence committed against?',
    code: 'offence_analysis_who_was_the_victim',
    hint: { text: 'Select all that apply.', kind: 'text' },
    type: FieldType.CheckBox,
    multiple: true,
    validate: [{ type: ValidationType.Required, message: 'Select who the offence was committed against' }],
    options: [
      {
        text: 'One or more people',
        value: 'ONE_OR_MORE_PERSON',
        kind: 'option',
      },
      {
        text: 'Other',
        value: 'OTHER',
        kind: 'option',
        hint: { text: 'For example, a business or the wider community.' },
      },
    ],
    labelClasses: utils.getMediumLabelClassFor(FieldType.CheckBox),
  }

  offenceAnalysisOtherVictimDetails: FormWizard.Field = FieldsFactory.detailsField({
    parentField: this.offenceAnalysisWhoWasTheOffenceCommittedAgainst,
    dependentValue: 'OTHER',
    required: true,
  })

  offenceAnalysisVictimRelationship: FormWizard.Field = {
    text: 'Who is the victim?',
    code: `offence_analysis_victim_relationship`,
    type: FieldType.Radio,
    validate: [
      {
        type: ValidationType.Required,
        message: 'Select who the victim is',
      },
    ],
    options: [
      {
        text: 'A stranger',
        value: 'STRANGER',
        kind: 'option',
      },
      {
        text: 'Criminal justice staff',
        value: 'CRIMINAL_JUSTICE_STAFF',
        kind: 'option',
      },
      {
        text: `[subject]'s parent or step-parent`,
        value: 'POP_PARENT_OR_STEP_PARENT',
        kind: 'option',
      },
      {
        text: `[subject]'s partner`,
        value: 'POP_PARTNER',
        kind: 'option',
      },
      {
        text: `[subject]'s ex-partner`,
        value: 'POP_EX_PARTNER',
        kind: 'option',
      },
      {
        text: `[subject]'s child or step-child`,
        value: 'POP_CHILD_OR_STEP_CHILD',
        kind: 'option',
      },
      {
        text: 'Other family member',
        value: 'OTHER_FAMILY_MEMBER',
        kind: 'option',
      },
      {
        text: 'Other',
        value: 'OTHER',
        kind: 'option',
      },
    ],
    labelClasses: utils.getMediumLabelClassFor(FieldType.Radio),
  }

  offenceAnalysisVictimRelationshipOtherDetails: FormWizard.Field = FieldsFactory.detailsField({
    parentField: this.offenceAnalysisVictimRelationship,
    dependentValue: 'OTHER',
  })

  offenceAnalysisVictimAge: FormWizard.Field = {
    text: `What is the victim's approximate age?`,
    code: `offence_analysis_victim_age`,
    type: FieldType.Radio,
    validate: [
      {
        type: ValidationType.Required,
        message: 'Select approximate age',
      },
    ],
    options: [
      {
        text: '0 to 4 years',
        value: 'AGE_0_TO_4_YEARS',
        kind: 'option',
      },
      {
        text: '5 to 11 years',
        value: 'AGE_5_TO_11_YEARS',
        kind: 'option',
      },
      {
        text: '12 to 15 years',
        value: 'AGE_12_TO_15_YEARS',
        kind: 'option',
      },
      {
        text: '16 to 17 years',
        value: 'AGE_16_TO_17_YEARS',
        kind: 'option',
      },
      {
        text: '18 to 20 years',
        value: 'AGE_18_TO_20_YEARS',
        kind: 'option',
      },
      {
        text: '21 to 25 years',
        value: 'AGE_21_TO_25_YEARS',
        kind: 'option',
      },
      {
        text: '26 to 49 years',
        value: 'AGE_26_TO_49_YEARS',
        kind: 'option',
      },
      {
        text: '50 to 64 years',
        value: 'AGE_50_TO_64_YEARS',
        kind: 'option',
      },
      {
        text: '65 years and over',
        value: 'AGE_65_AND_OVER',
        kind: 'option',
      },
    ],
    labelClasses: utils.getMediumLabelClassFor(FieldType.Radio),
  }

  offenceAnalysisVictimSex: FormWizard.Field = {
    text: `What is the victim's sex?`,
    code: `offence_analysis_victim_sex`,
    type: FieldType.Radio,
    validate: [
      {
        type: ValidationType.Required,
        message: 'Select sex',
      },
    ],
    options: [
      {
        text: 'Male',
        value: 'MALE',
        kind: 'option',
      },
      {
        text: 'Female',
        value: 'FEMALE',
        kind: 'option',
      },
      {
        text: 'Intersex',
        value: 'INTERSEX',
        kind: 'option',
      },
      {
        text: 'Unknown',
        value: 'UNKNOWN',
        kind: 'option',
      },
    ],
    labelClasses: utils.getMediumLabelClassFor(FieldType.Radio),
  }

  offenceAnalysisVictimRace: FormWizard.Field = {
    text: `What is the victim's race or ethnicity?`,
    code: `offence_analysis_victim_race`,
    type: FieldType.AutoComplete,
    hint: { text: 'Type in a race or ethnicity and a list of options will appear.', kind: 'text' },
    validate: [{ type: ValidationType.Required, message: 'Select race or ethnicity' }],
    options: [
      { text: '', value: '', kind: 'option' },
      {
        text: 'White - English, Welsh, Scottish, Northern Irish or British',
        value: 'WHITE_ENGLISH_WELSH_SCOTTISH_NORTHERN_IRISH_OR_BRITISH',
        kind: 'option',
      },
      { text: 'White - Irish', value: 'WHITE_IRISH', kind: 'option' },
      { text: 'White - Gypsy or Irish Traveller', value: 'WHITE_GYPSY_OR_IRISH_TRAVELLER', kind: 'option' },
      { text: 'White - Roma', value: 'WHITE_ROMA', kind: 'option' },
      { text: 'White - Any other White background', value: 'WHITE_ANY_OTHER_WHITE_BACKGROUND', kind: 'option' },
      { text: 'Mixed - White and Black Caribbean', value: 'MIXED_WHITE_AND_BLACK_CARIBBEAN', kind: 'option' },
      { text: 'Mixed - White and Black African', value: 'MIXED_WHITE_AND_BLACK_AFRICAN', kind: 'option' },
      { text: 'Mixed - White and Asian', value: 'MIXED_WHITE_AND_ASIAN', kind: 'option' },
      {
        text: 'Mixed - Any other mixed or multiple ethnic background background',
        value: 'MIXED_ANY_OTHER_MIXED_OR_MULTIPLE_ETHNIC_BACKGROUND_BACKGROUND',
        kind: 'option',
      },
      { text: 'Asian or Asian British - Indian', value: 'ASIAN_OR_ASIAN_BRITISH_INDIAN', kind: 'option' },
      { text: 'Asian or Asian British - Pakistani', value: 'ASIAN_OR_ASIAN_BRITISH_PAKISTANI', kind: 'option' },
      { text: 'Asian or Asian British - Bangladeshi', value: 'ASIAN_OR_ASIAN_BRITISH_BANGLADESHI', kind: 'option' },
      { text: 'Asian or Asian British - Chinese', value: 'ASIAN_OR_ASIAN_BRITISH_CHINESE', kind: 'option' },
      {
        text: 'Asian or Asian British - Any other Asian background',
        value: 'ASIAN_OR_ASIAN_BRITISH_ANY_OTHER_ASIAN_BACKGROUND',
        kind: 'option',
      },
      { text: 'Black or Black British - Caribbean', value: 'BLACK_OR_BLACK_BRITISH_CARIBBEAN', kind: 'option' },
      { text: 'Black or Black British - African', value: 'BLACK_OR_BLACK_BRITISH_AFRICAN', kind: 'option' },
      {
        text: 'Black or Black British - Any other Black background',
        value: 'BLACK_OR_BLACK_BRITISH_ANY_OTHER_BLACK_BACKGROUND',
        kind: 'option',
      },
      { text: 'Arab', value: 'ARAB', kind: 'option' },
      { text: 'Any other ethnic group', value: 'ANY_OTHER_ETHNIC_GROUP', kind: 'option' },
      { text: 'Not stated', value: 'NOT_STATED', kind: 'option' },
    ],
    labelClasses: utils.getMediumLabelClassFor(FieldType.AutoComplete),
  }

  offenceAnalysisVictimsCollection: FormWizard.Field = {
    text: 'Victims',
    code: 'offence_analysis_victims_collection',
    type: FieldType.Collection,
    collection: {
      fields: [
        this.offenceAnalysisVictimRelationship,
        this.offenceAnalysisVictimRelationshipOtherDetails,
        this.offenceAnalysisVictimAge,
        this.offenceAnalysisVictimSex,
        this.offenceAnalysisVictimRace,
      ],
      subject: 'victim',
      createUrl: 'offence-analysis-victim/create',
      updateUrl: 'offence-analysis-victim/edit',
      deleteUrl: 'offence-analysis-victim/delete',
      summaryUrl: 'offence-analysis-victim-details',
    },
    labelClasses: utils.getMediumLabelClassFor(FieldType.Collection),
    summary: { displayAlways: true },
  }

  offenceAnalysisHowManyInvolved: FormWizard.Field = {
    text: `How many other people were involved with committing the current index offence(s)?`,
    code: `offence_analysis_how_many_involved`,
    type: FieldType.Radio,
    validate: [
      {
        type: ValidationType.Required,
        message: 'Select how many other people were involved in the offence',
      },
    ],
    options: [
      {
        text: 'None',
        value: 'NONE',
        kind: 'option',
      },
      {
        text: '1',
        value: 'ONE',
        kind: 'option',
      },
      {
        text: '2',
        value: 'TWO',
        kind: 'option',
      },
      {
        text: '3',
        value: 'THREE',
        kind: 'option',
      },
      {
        text: '4',
        value: 'FOUR',
        kind: 'option',
      },
      {
        text: '5',
        value: 'FIVE',
        kind: 'option',
      },
      {
        text: '6 to 10',
        value: 'SIX_TO_10',
        kind: 'option',
      },
      {
        text: '11 to 15',
        value: 'ELEVEN_TO_15',
        kind: 'option',
      },
      {
        text: 'More than 15',
        value: 'MORE_THAN_15',
        kind: 'option',
      },
    ],
    labelClasses: utils.getMediumLabelClassFor(FieldType.Radio),
  }

  offenceAnalysisLeader: FormWizard.Field = {
    text: 'Was [subject] the leader in regard to committing the current index offence(s)?',
    code: 'offence_analysis_leader',
    type: FieldType.Radio,
    validate: [
      {
        type: ValidationType.Required,
        message: 'Select if they were the leader',
      },
    ],
    options: yesNoOptions,
    labelClasses: utils.getMediumLabelClassFor(FieldType.Radio),
  }

  offenceAnalysisLeaderYesDetails: FormWizard.Field = FieldsFactory.detailsField({
    parentField: this.offenceAnalysisLeader,
    dependentValue: 'YES',
    required: true,
    maxChars: characterLimits.c4000,
  })

  offenceAnalysisLeaderNoDetails: FormWizard.Field = FieldsFactory.detailsField({
    parentField: this.offenceAnalysisLeader,
    dependentValue: 'NO',
    maxChars: characterLimits.c4000,
  })

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
    options: yesNoOptions,
    labelClasses: utils.getMediumLabelClassFor(FieldType.Radio),
  }

  offenceAnalysisImpactOnVictimsDetails: FormWizard.Field[] = this.offenceAnalysisImpactOnVictims.options.map(
    FieldsFactory.detailsFieldWith({
      parentField: this.offenceAnalysisImpactOnVictims,
    }),
  )

  offenceAnalysisAcceptResponsibility: FormWizard.Field = {
    text: 'Does [subject] accept responsibility for the current index offence(s)?',
    code: 'offence_analysis_accept_responsibility',
    type: FieldType.Radio,
    validate: [
      {
        type: ValidationType.Required,
        message: 'Select if they accept responsibility for the current offence(s)',
      },
    ],
    options: yesNoOptions,
    labelClasses: utils.getMediumLabelClassFor(FieldType.Radio),
  }

  offenceAnalysisAcceptResponsibilityDetails: FormWizard.Field[] = this.offenceAnalysisAcceptResponsibility.options.map(
    FieldsFactory.detailsFieldWith({
      parentField: this.offenceAnalysisAcceptResponsibility,
      maxChars: characterLimits.c4000,
    }),
  )

  offenceAnalysisPatternsOfOffending: FormWizard.Field = {
    text: 'What are the patterns of offending?',
    code: 'offence_analysis_patterns_of_offending',
    hint: {
      text: 'Analyse whether the current index offence(s) are part of a wider pattern of offending and identify any established or emerging themes. It is not necessary to list all previous convictions here.',
      kind: 'text',
    },
    type: FieldType.TextArea,
    validate: [
      { type: ValidationType.Required, message: 'Enter details' },
      {
        type: ValidationType.MaxLength,
        arguments: [characterLimits.c2000],
        message: `Details must be ${characterLimits.c2000} characters or less`,
      },
    ],
    labelClasses: utils.getMediumLabelClassFor(FieldType.TextArea),
  }

  offenceAnalysisEscalation: FormWizard.Field = {
    text: 'Is the current index offence(s) an escalation in seriousness from previous offending?',
    code: 'offence_analysis_escalation',
    type: FieldType.Radio,
    validate: [
      {
        type: ValidationType.Required,
        message: `Select if the current offence(s) are an escalation in seriousness from previous offending`,
      },
    ],
    options: [
      { text: 'Yes', value: 'YES', kind: 'option' },
      { text: 'No', value: 'NO', kind: 'option' },
      { text: 'Not applicable', value: 'NOT_APPLICABLE', kind: 'option' },
    ],
    labelClasses: utils.getMediumLabelClassFor(FieldType.Radio),
  }

  offenceAnalysisEscalationDetails: FormWizard.Field[] = this.offenceAnalysisEscalation.options
    .filter(it => it.kind === 'option' && ['Yes', 'No'].includes(it.text))
    .map(FieldsFactory.detailsFieldWith({ parentField: this.offenceAnalysisEscalation }))

  offenceAnalysisRisk: FormWizard.Field = {
    text: 'Are the current or previous offences linked to risk of serious harm, risks to the individual or other risks?',
    code: 'offence_analysis_risk',
    type: FieldType.Radio,
    validate: [
      {
        type: ValidationType.Required,
        message: 'Select if the offence is linked to risk of serious harm, risks to the individual or other risks',
      },
    ],
    options: yesNoOptions,
    labelClasses: utils.getMediumLabelClassFor(FieldType.Radio),
  }

  offenceAnalysisRiskDetails: FormWizard.Field[] = this.offenceAnalysisRisk.options.map(
    FieldsFactory.detailsFieldWith({
      parentField: this.offenceAnalysisRisk,
      maxChars: characterLimits.c4000,
      required: true,
    }),
  )

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
    options: yesNoOptions,
    labelClasses: utils.getMediumLabelClassFor(FieldType.Radio),
  }

  offenceAnalysisPerpetratorOfDomesticAbuseType: FormWizard.Field = {
    text: 'Who was this committed against?',
    code: 'offence_analysis_perpetrator_of_domestic_abuse_type',
    type: FieldType.Radio,
    validate: [{ type: ValidationType.Required, message: 'Select an option' }],
    options: [
      { text: 'Family member', value: 'FAMILY_MEMBER', kind: 'option' },
      { text: 'Intimate partner', value: 'INTIMATE_PARTNER', kind: 'option' },
      { text: 'Family member and intimate partner', value: 'FAMILY_MEMBER_AND_INTIMATE_PARTNER', kind: 'option' },
    ],
    dependent: dependentOn(this.offenceAnalysisPerpetratorOfDomesticAbuse, 'YES'),
  }

  offenceAnalysisPerpetratorOfDomesticAbuseTypeDetails: FormWizard.Field[] =
    this.offenceAnalysisPerpetratorOfDomesticAbuseType.options.map(
      FieldsFactory.detailsFieldWith({
        parentField: this.offenceAnalysisPerpetratorOfDomesticAbuseType,
        required: true,
      }),
    )

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
    options: yesNoOptions,
    labelClasses: utils.getMediumLabelClassFor(FieldType.Radio),
  }

  offenceAnalysisVictimOfDomesticAbuseType: FormWizard.Field = {
    text: 'Who was this committed by?',
    code: 'offence_analysis_victim_of_domestic_abuse_type',
    type: FieldType.Radio,
    validate: [{ type: ValidationType.Required, message: 'Select an option' }],
    options: [
      { text: 'Family member', value: 'FAMILY_MEMBER', kind: 'option' },
      { text: 'Intimate partner', value: 'INTIMATE_PARTNER', kind: 'option' },
      { text: 'Family member and intimate partner', value: 'FAMILY_MEMBER_AND_INTIMATE_PARTNER', kind: 'option' },
    ],
    dependent: dependentOn(this.offenceAnalysisVictimOfDomesticAbuse, 'YES'),
  }

  offenceAnalysisVictimOfDomesticAbuseTypeDetails: FormWizard.Field[] =
    this.offenceAnalysisVictimOfDomesticAbuseType.options.map(
      FieldsFactory.detailsFieldWith({
        parentField: this.offenceAnalysisVictimOfDomesticAbuseType,
        required: true,
      }),
    )
}

export default new OffenceAnalysisFieldsFactory(sections.offenceAnalysis)
