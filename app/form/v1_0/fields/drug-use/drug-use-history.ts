import FormWizard from 'hmpo-form-wizard'
import { utils } from '../common'
import { FieldType, ValidationType } from '../../../../../server/@types/hmpo-form-wizard/enums'
import characterLimits from '../../config/characterLimits'
import { fieldCodeWith } from '../common/fieldUtils'
import addDrugs from './add-drugs'
import { HandoverSubject } from '../../../../../server/services/arnsHandoverService'

const drugReasonsForUseHint = `
<p class="govuk-hint">Consider why they started using, their history, and any triggers.</p>
<p class="govuk-hint">Select all that apply.</p>
`

const drugsReasonsForUse: FormWizard.Field = {
  text: 'Why does [subject] use drugs?',
  hint: { html: drugReasonsForUseHint, kind: 'html' },
  code: 'drugs_reasons_for_use',
  type: FieldType.CheckBox,
  multiple: true,
  validate: [{ type: ValidationType.Required, message: 'Select why they use drugs' }],
  options: [
    { text: 'Cultural or religious practice', value: 'CULTURAL_OR_RELIGIOUS', kind: 'option' },
    { text: 'Curiosity or experimentation', value: 'CURIOSITY_OR_EXPERIMENTATION', kind: 'option' },
    { text: 'Enhance performance', value: 'ENHANCE_PERFORMANCE', kind: 'option' },
    { text: 'Escapism or avoidance', value: 'ESCAPISM_OR_AVOIDANCE', kind: 'option' },
    { text: 'Manage stress or emotional issues', value: 'MANAGING_EMOTIONAL_ISSUES', kind: 'option' },
    { text: 'Peer pressure or social influence', value: 'PEER_PRESSURE', kind: 'option' },
    { text: 'Recreation or pleasure', value: 'RECREATION_OR_PLEASURE', kind: 'option' },
    { text: 'Self-medication', value: 'SELF_MEDICATION', kind: 'option' },
    { text: 'Other', value: 'OTHER', kind: 'option' },
  ],
  labelClasses: utils.getMediumLabelClassFor(FieldType.CheckBox),
  transform(state): FormWizard.Field {
    const usedInTheLastSixMonths = addDrugs.drugLastUsedFields.some(field => state.answers[field.code] === 'LAST_SIX')

    if (usedInTheLastSixMonths) return this

    return {
      ...this,
      text: this.text.replace('does', 'did'),
      validate: this.validate.map((it: FormWizard.Validate) => ({
        ...it,
        message: 'type' in it && it.type === ValidationType.Required ? it.message.replace('use', 'used') : it.message,
      })),
    }
  },
}

const drugsReasonsForUseDetails: FormWizard.Field = {
  text: 'Give details (optional)',
  code: fieldCodeWith(drugsReasonsForUse.code, 'details'),
  type: FieldType.TextArea,
  validate: [
    {
      type: 'validateMaxLength',
      fn: utils.validateMaxLength,
      arguments: [characterLimits.default],
      message: `Details must be ${characterLimits.default} characters or less`,
    },
  ],
  transform(state): FormWizard.Field {
    const usedInTheLastSixMonths = addDrugs.drugLastUsedFields.some(field => state.answers[field.code] === 'LAST_SIX')
    const subject = state.session.subjectDetails as HandoverSubject
    return {
      ...this,
      summary: {
        text: `Details on why ${subject.givenName} ${usedInTheLastSixMonths ? 'uses' : 'used'} drugs`,
      },
    }
  },
}

const drugsAffectedTheirLife: FormWizard.Field = {
  text: "How has [subject]'s drug use affected their life?",
  hint: { text: 'Select all that apply.', kind: 'text' },
  code: 'drugs_affected_their_life',
  type: FieldType.CheckBox,
  multiple: true,
  validate: [{ type: ValidationType.Required, message: 'Select how their drug use has affected their life' }],
  options: [
    {
      text: 'Behaviour',
      hint: { text: 'Includes unemployment, disruption on education or lack of productivity.' },
      value: 'BEHAVIOUR',
      kind: 'option',
    },
    {
      text: 'Community',
      hint: { text: 'Includes limited opportunities or judgement from others.' },
      value: 'COMMUNITY',
      kind: 'option',
    },
    {
      text: 'Finances',
      hint: { text: 'Includes having no money.' },
      value: 'FINANCES',
      kind: 'option',
    },
    {
      text: 'Links to offending',
      value: 'LINKS_TO_OFFENDING',
      kind: 'option',
    },
    {
      text: 'Physical or mental health',
      hint: { text: 'Includes overdose.' },
      value: 'HEALTH',
      kind: 'option',
    },
    {
      text: 'Relationships',
      hint: { text: 'Includes isolation or neglecting responsibilities.' },
      value: 'RELATIONSHIPS',
      kind: 'option',
    },
    { text: 'Other', value: 'OTHER', kind: 'option' },
  ],
  labelClasses: utils.getMediumLabelClassFor(FieldType.CheckBox),
}

const drugsAffectedTheirLifeDetails: FormWizard.Field = {
  text: 'Give details (optional)',
  code: fieldCodeWith(drugsAffectedTheirLife.code, 'details'),
  type: FieldType.TextArea,
  validate: [
    {
      type: 'validateMaxLength',
      fn: utils.validateMaxLength,
      arguments: [characterLimits.default],
      message: `Details must be ${characterLimits.default} characters or less`,
    },
  ],
  transform(state): FormWizard.Field {
    const subject = state.session.subjectDetails as HandoverSubject
    return {
      ...this,
      summary: {
        text: `Details on how ${subject.givenName}'s drug use has affected their life`,
      },
    }
  },
}

const drugsAnythingHelpedStopOrReduceUse: FormWizard.Field = {
  text: 'Has anything helped [subject] stop or reduce their drug use? (optional)',
  hint: { text: 'Note any treatment or lifestyle changes that have helped them.', kind: 'text' },
  code: 'drugs_anything_helped_stop_or_reduce_use',
  type: FieldType.TextArea,
  validate: [
    {
      type: 'validateMaxLength',
      fn: utils.validateMaxLength,
      arguments: [characterLimits.default],
      message: `Details must be ${characterLimits.default} characters or less`,
    },
  ],
  labelClasses: utils.getMediumLabelClassFor(FieldType.TextArea),
}

const drugsWhatCouldHelpNotUseDrugsInFuture: FormWizard.Field = {
  text: 'What could help [subject] not use drugs in the future? (optional)',
  code: 'drugs_what_could_help_not_use_drugs_in_future',
  type: FieldType.TextArea,
  validate: [
    {
      type: 'validateMaxLength',
      fn: utils.validateMaxLength,
      arguments: [characterLimits.default],
      message: `Details must be ${characterLimits.default} characters or less`,
    },
  ],
  labelClasses: utils.getMediumLabelClassFor(FieldType.TextArea),
}

export default {
  drugsReasonsForUse,
  drugsReasonsForUseDetails,
  drugsAffectedTheirLife,
  drugsAffectedTheirLifeDetails,
  drugsAnythingHelpedStopOrReduceUse,
  drugsWhatCouldHelpNotUseDrugsInFuture,
}
