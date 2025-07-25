import FormWizard from 'hmpo-form-wizard'
import { FieldsFactory, utils } from './common'
import { FieldType, ValidationType } from '../../../../server/@types/hmpo-form-wizard/enums'
import sections from '../config/sections'
import { dependentOn } from './common/fieldUtils'

const alcoholUnitsHint = `
<details class="govuk-details" data-module="govuk-details">
  <summary class="govuk-details__summary">
    <span class="govuk-details__summary-text">
      Help with alcohol units
    </span>
  </summary>
  <div class="govuk-details__text">
    <table class="govuk-table">
      <thead class="govuk-table__head">
        <tr class="govuk-table__row">
          <th scope="col" class="govuk-table__header govuk-!-width-one-half">Type of drink</th>
          <th scope="col" class="govuk-table__header govuk-!-width-one-half govuk-table__header--numeric">Number of alcohol units</th>
        </tr>
      </thead>
      <tbody class="govuk-table__body">
        <tr class="govuk-table__row">
          <td class="govuk-table__cell">Single small shot of spirits<br>(25ml, ABV 40%)<br>For example, whisky or vodka.</td>
          <td class="govuk-table__cell govuk-table__cell--numeric">1 unit</td>
        </tr>
        <tr class="govuk-table__row">
          <td class="govuk-table__cell">Alcopop (275ml, ABV 5.5%)</td>
          <td class="govuk-table__cell govuk-table__cell--numeric">1.5 units</td>
        </tr>
        <tr class="govuk-table__row">
          <td class="govuk-table__cell">Small glass of red/white/rosé<br>wine (125ml, ABV 12%)</td>
          <td class="govuk-table__cell govuk-table__cell--numeric">1.5 units</td>
        </tr>
        <tr class="govuk-table__row">
          <td class="govuk-table__cell">Bottle of lager/beer/cider<br>(330ml, ABV 5%)</td>
          <td class="govuk-table__cell govuk-table__cell--numeric">1.7 units</td>
        </tr>
        <tr class="govuk-table__row">
          <td class="govuk-table__cell">Can of lager/beer/cider<br>(440ml, ABV 5.5%)</td>
          <td class="govuk-table__cell govuk-table__cell--numeric">2.4 units</td>
        </tr>
        <tr class="govuk-table__row">
          <td class="govuk-table__cell">Pint of lower-strength lager/<br>beer/cider (ABV 3.6%)</td>
          <td class="govuk-table__cell govuk-table__cell--numeric">2 units</td>
        </tr>
        <tr class="govuk-table__row">
          <td class="govuk-table__cell">Standard glass of red/white/rosé<br>wine (175ml, ABV 12%)</td>
          <td class="govuk-table__cell govuk-table__cell--numeric">2.1 units</td>
        </tr>
        <tr class="govuk-table__row">
          <td class="govuk-table__cell">Pint of higher-strength lager/<br>beer/cider (ABV 5.2%)</td>
          <td class="govuk-table__cell govuk-table__cell--numeric">3 units</td>
        </tr>
        <tr class="govuk-table__row">
          <td class="govuk-table__cell">Large glass of red/white/rosé<br>wine (250ml, ABV 12%)</td>
          <td class="govuk-table__cell govuk-table__cell--numeric">3 units</td>
        </tr>
      </tbody>
    </table>
  </div>
</details>
`

export function orNoImpactValidator() {
  const answers = this.values.alcohol_impact_of_use || []
  return !(answers.includes('NO_NEGATIVE_IMPACT') && answers.length > 1)
}

class AlcoholFieldsFactory extends FieldsFactory {
  alcoholUse: FormWizard.Field = {
    text: 'Has [subject] ever drunk alcohol?',
    code: 'alcohol_use',
    type: FieldType.Radio,
    validate: [{ type: ValidationType.Required, message: 'Select if they have ever drunk alcohol' }],
    options: [
      { text: 'Yes, including the last 3 months', value: 'YES_WITHIN_LAST_THREE_MONTHS', kind: 'option' },
      { text: 'Yes, but not in the last 3 months', value: 'YES_NOT_IN_LAST_THREE_MONTHS', kind: 'option' },
      { text: 'No', value: 'NO', kind: 'option' },
    ],
  }

  alcoholEvidenceOfExcessDrinking: FormWizard.Field = {
    text: 'Has [subject] shown evidence of binge drinking or excessive alcohol use in the last 6 months?',
    code: 'alcohol_evidence_of_excess_drinking',
    type: FieldType.Radio,
    validate: [
      {
        type: ValidationType.Required,
        message: "Select if there's evidence of binge drinking or excessive alcohol use in the last 6 months",
      },
    ],
    options: [
      { text: 'No evidence of binge drinking or excessive alcohol use', value: 'NO_EVIDENCE', kind: 'option' },
      {
        text: 'Some evidence of binge drinking or excessive alcohol use',
        hint: { text: 'There is a pattern of alcohol use but has not caused any serious problems.' },
        value: 'YES_WITH_SOME_EVIDENCE',
        kind: 'option',
      },
      {
        text: 'Evidence of binge drinking or excessive alcohol use',
        hint: {
          text: 'There is a detrimental effect on other areas of their life and is often directly related to offending.',
        },
        value: 'YES_WITH_EVIDENCE',
        kind: 'option',
      },
    ],
    labelClasses: utils.getMediumLabelClassFor(FieldType.Radio),
  }

  alcoholPastIssues: FormWizard.Field = {
    text: 'Does [subject] have any past issues with alcohol?',
    code: 'alcohol_past_issues',
    type: FieldType.Radio,
    validate: [{ type: ValidationType.Required, message: 'Select if they have any past issues with alcohol' }],
    options: utils.yesNoOptions,
    labelClasses: utils.getMediumLabelClassFor(FieldType.Radio),
  }

  alcoholPastIssuesDetails: FormWizard.Field = FieldsFactory.detailsField({
    parentField: this.alcoholPastIssues,
    dependentValue: 'YES',
    required: true,
  })

  alcoholReasonsForUse: FormWizard.Field = {
    text: 'Why does [subject] drink alcohol?',
    hint: { text: 'Select all that apply.', kind: 'text' },
    code: 'alcohol_reasons_for_use',
    type: FieldType.CheckBox,
    multiple: true,
    validate: [{ type: ValidationType.Required, message: 'Select why they drink alcohol' }],
    options: [
      { text: 'Cultural or religious practice', value: 'CULTURAL_OR_RELIGIOUS', kind: 'option' },
      { text: 'Curiosity or experimentation', value: 'CURIOSITY_OR_EXPERIMENTATION', kind: 'option' },
      { text: 'Enjoyment', value: 'ENJOYMENT', kind: 'option' },
      { text: 'Manage stress or emotional issues', value: 'MANAGING_EMOTIONAL_ISSUES', kind: 'option' },
      { text: 'On special occasions', value: 'SPECIAL_OCCASIONS', kind: 'option' },
      { text: 'Peer pressure or social influence', value: 'PEER_PRESSURE', kind: 'option' },
      {
        text: 'Self-medication or mood altering',
        hint: { text: 'Includes pain management or emotional regulation.' },
        value: 'SELF_MEDICATION',
        kind: 'option',
      },
      { text: 'Socially', value: 'SOCIAL', kind: 'option' },
      { text: 'Other', value: 'OTHER', kind: 'option' },
    ],
    labelClasses: utils.getMediumLabelClassFor(FieldType.CheckBox),
  }

  alcoholReasonsForUseOtherDetails: FormWizard.Field = FieldsFactory.detailsField({
    parentField: this.alcoholReasonsForUse,
    dependentValue: 'OTHER',
  })

  alcoholImpactOfUse: FormWizard.Field = {
    text: "What's the impact of [subject] drinking alcohol?",
    hint: { text: 'Select all that apply.', kind: 'text' },
    code: 'alcohol_impact_of_use',
    type: FieldType.CheckBox,
    multiple: true,
    validate: [
      {
        type: ValidationType.Required,
        message: "Select the impact of them drinking alcohol, or select 'No impact'",
      },
      {
        fn: orNoImpactValidator,
        message: "Select the impact of them drinking alcohol, or select 'No impact'",
      },
    ],
    options: [
      {
        text: 'Behavioural',
        hint: { text: 'Includes unemployment, disruption on education or lack of productivity.' },
        value: 'BEHAVIOURAL',
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
        hint: { text: 'Includes having no money or difficulties.' },
        value: 'FINANCES',
        kind: 'option',
      },
      { text: 'Links to offending', value: 'LINKS_TO_REOFFENDING', kind: 'option' },
      {
        text: 'Physical or mental health',
        hint: { text: 'Includes overdose.' },
        value: 'PHYSICAL_OR_MENTAL_HEALTH',
        kind: 'option',
      },
      {
        text: 'Relationships',
        hint: { text: 'Includes isolation or neglecting responsibilities.' },
        value: 'RELATIONSHIPS',
        kind: 'option',
      },
      { text: 'Other', value: 'OTHER', kind: 'option' },
      utils.orDivider,
      { text: 'No impact', value: 'NO_NEGATIVE_IMPACT', kind: 'option', behaviour: 'exclusive' },
    ],
    labelClasses: utils.getMediumLabelClassFor(FieldType.CheckBox),
  }

  alcoholImpactOfUseOtherDetails: FormWizard.Field = FieldsFactory.detailsField({
    parentField: this.alcoholImpactOfUse,
    dependentValue: 'OTHER',
    textHint: 'Consider impact on themselves or others.',
  })

  alcoholStoppedOrReduced: FormWizard.Field = {
    text: 'Has anything helped [subject] to stop or reduce drinking alcohol in the past?',
    hint: { text: 'Consider strategies, people or support networks that may have helped.', kind: 'text' },
    code: 'alcohol_stopped_or_reduced',
    type: FieldType.Radio,
    validate: [
      {
        type: ValidationType.Required,
        message: 'Select if anything has helped them to stop or reduce drinking alcohol in the past',
      },
    ],
    options: utils.yesNoOptions,
    labelClasses: utils.getMediumLabelClassFor(FieldType.Radio),
  }

  alcoholStoppedOrReducedDetails: FormWizard.Field = FieldsFactory.detailsField({
    parentField: this.alcoholStoppedOrReduced,
    dependentValue: 'YES',
    required: true,
  })

  alcoholFrequency: FormWizard.Field = {
    text: 'How often has [subject] drunk alcohol in the last 3 months?',
    code: 'alcohol_frequency',
    type: FieldType.Radio,
    validate: [{ type: ValidationType.Required, message: 'Select how often they drunk alcohol in the last 3 months' }],
    options: [
      { text: 'Once a month or less', value: 'ONCE_A_MONTH_OR_LESS', kind: 'option' },
      { text: '2 to 4 times a month', value: 'MULTIPLE_TIMES_A_MONTH', kind: 'option' },
      { text: '2 to 3 times a week', value: 'LESS_THAN_4_TIMES_A_WEEK', kind: 'option' },
      { text: 'More than 4 times a week', value: 'MORE_THAN_4_TIMES_A_WEEK', kind: 'option' },
    ],
    labelClasses: utils.getMediumLabelClassFor(FieldType.Radio),
  }

  alcoholUnits: FormWizard.Field = {
    text: 'How many units of alcohol does [subject] have on a typical day of drinking?',
    hint: { html: alcoholUnitsHint, kind: 'html' },
    code: 'alcohol_units',
    type: FieldType.Radio,
    validate: [
      {
        type: ValidationType.Required,
        message: 'Select how many units of alcohol they have on a typical day of drinking',
      },
    ],
    options: [
      { text: '1 to 2 units', value: 'UNITS_1_TO_2', kind: 'option' },
      { text: '3 to 4 units', value: 'UNITS_3_TO_4', kind: 'option' },
      { text: '5 to 6 units', value: 'UNITS_5_TO_6', kind: 'option' },
      { text: '7 to 9 units', value: 'UNITS_7_TO_9', kind: 'option' },
      { text: '10 or more units', value: 'UNITS_10_OR_MORE', kind: 'option' },
    ],
    labelClasses: utils.getMediumLabelClassFor(FieldType.Radio),
  }

  alcoholBingeDrinking: FormWizard.Field = {
    text: 'Has [subject] had [alcohol_units] or more units within a single day of drinking in the last 3 months?',
    code: 'alcohol_binge_drinking',
    type: FieldType.Radio,
    validate: [
      {
        type: ValidationType.Required,
        message: 'Select if they had 6 or more units within a single day of drinking in the last 3 months',
      },
    ],
    options: utils.yesNoOptions,
    labelClasses: utils.getMediumLabelClassFor(FieldType.Radio),
  }

  alcoholBingeDrinkingFrequency: FormWizard.Field = {
    text: 'Select how often',
    code: 'alcohol_binge_drinking_frequency',
    type: FieldType.Radio,
    validate: [{ type: ValidationType.Required, message: 'Select how often' }],
    options: [
      { text: 'Less than a month', value: 'LESS_THAN_A_MONTH', kind: 'option' },
      { text: 'Monthly', value: 'MONTHLY', kind: 'option' },
      { text: 'Weekly', value: 'WEEKLY', kind: 'option' },
      { text: 'Daily or almost daily', value: 'DAILY', kind: 'option' },
    ],
    dependent: dependentOn(this.alcoholBingeDrinking, 'YES'),
  }
}

export default new AlcoholFieldsFactory(sections.alcohol)
