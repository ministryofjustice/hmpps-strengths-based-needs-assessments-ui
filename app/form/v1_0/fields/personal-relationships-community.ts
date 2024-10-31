import FormWizard from 'hmpo-form-wizard'
import { FieldType, ValidationType } from '../../../../server/@types/hmpo-form-wizard/enums'
import { FieldsFactory, utils } from './common'
import sections from '../config/sections'
import { dependentOn } from './common/utils'

const childrenInformationHint = `
<p class="govuk-hint">This refers to any children (under 18 years) [subject] has regular contact with, even if they do not have parental responsibility.</p>
<p class="govuk-hint">Select all that apply.</p>
`

class PersonalRelationshipsFieldsFactory extends FieldsFactory {
  personalRelationshipsCommunityChildrenInformation: FormWizard.Field = {
    text: "Are there any children in [subject]'s life?",
    hint: { html: childrenInformationHint, kind: 'html' },
    code: 'personal_relationships_community_children_details',
    type: FieldType.CheckBox,
    multiple: true,
    validate: [{ type: ValidationType.Required, message: 'Select at least one option' }],
    options: [
      {
        text: 'Yes, children that live with them',
        value: 'YES_CHILDREN_LIVING_WITH_POP',
        kind: 'option',
      },
      {
        text: 'Yes, children that do not live with them',
        value: 'YES_CHILDREN_NOT_LIVING_WITH_POP',
        kind: 'option',
      },
      { text: 'Yes, children that visit them regularly', value: 'YES_CHILDREN_VISITING', kind: 'option' },
      { text: "No, there are no children in [subject]'s life", value: 'NO_CHILDREN', kind: 'option' },
    ],
    labelClasses: utils.getMediumLabelClassFor(FieldType.CheckBox),
  }

  personalRelationshipsCommunityLivingWithChildrenDetails: FormWizard.Field = {
    text: 'Include the name, age and sex of any children, and their relationship to [subject].',
    code: 'yes_children_living_with_pop_details',
    type: FieldType.TextArea,
    validate: [
      { type: ValidationType.Required, message: 'Enter details of any children that live them' },
      {
        type: ValidationType.MaxLength,
        arguments: [FieldsFactory.detailsCharacterLimit],
        message: `Details must be ${FieldsFactory.detailsCharacterLimit} characters or less`,
      },
    ],
    dependent: dependentOn(this.personalRelationshipsCommunityChildrenInformation, 'YES_CHILDREN_LIVING_WITH_POP'),
  }

  personalRelationshipsCommunityNotLivingWithChildrenDetails: FormWizard.Field = {
    text: 'Include the name, age and sex of any children, and their relationship to [subject].',
    code: 'yes_children_not_living_with_pop_details',
    type: FieldType.TextArea,
    validate: [
      { type: ValidationType.Required, message: 'Enter details of any children that do not live with them' },
      {
        type: ValidationType.MaxLength,
        arguments: [FieldsFactory.detailsCharacterLimit],
        message: `Details must be ${FieldsFactory.detailsCharacterLimit} characters or less`,
      },
    ],
    dependent: dependentOn(this.personalRelationshipsCommunityChildrenInformation, 'YES_CHILDREN_NOT_LIVING_WITH_POP'),
  }

  personalRelationshipsCommunityVisitingChildrenDetails: FormWizard.Field = {
    text: 'Include the name, age and sex of any children, and their relationship to [subject].',
    code: 'yes_children_visiting_details',
    type: FieldType.TextArea,
    validate: [
      { type: ValidationType.Required, message: 'Enter details of any children that visit them regularly' },
      {
        type: ValidationType.MaxLength,
        arguments: [FieldsFactory.detailsCharacterLimit],
        message: `Details must be ${FieldsFactory.detailsCharacterLimit} characters or less`,
      },
    ],
    dependent: dependentOn(this.personalRelationshipsCommunityChildrenInformation, 'YES_CHILDREN_VISITING'),
  }

  personalRelationshipsCommunityImportantPeople: FormWizard.Field = {
    text: "Who are the important people in [subject]'s life?",
    hint: { text: 'Select all that apply.', kind: 'text' },
    code: 'personal_relationships_community_important_people',
    type: FieldType.CheckBox,
    multiple: true,
    validate: [{ type: ValidationType.Required, message: 'Select at least one option' }],
    options: [
      {
        text: "Partner or someone they're in an intimate relationship with",
        value: 'PARTNER_INTIMATE_RELATIONSHIP',
        kind: 'option',
      },
      {
        text: 'Their children or anyone they have parental responsibilities for',
        value: 'CHILD_PARENTAL_RESPONSIBILITIES',
        kind: 'option',
      },
      { text: 'Other children', value: 'OTHER_CHILDREN', kind: 'option' },
      { text: 'Family members', value: 'FAMILY', kind: 'option' },
      { text: 'Friends', value: 'FRIENDS', kind: 'option' },
      { text: 'Other', value: 'OTHER', kind: 'option' },
    ],
    labelClasses: utils.getMediumLabelClassFor(FieldType.CheckBox),
  }

  personalRelationshipsCommunityImportantPeoplePartnerDetails: FormWizard.Field = FieldsFactory.detailsField({
    parentField: this.personalRelationshipsCommunityImportantPeople,
    dependentValue: 'PARTNER_INTIMATE_RELATIONSHIP',
    textHint:
      "Include their name, age, gender and the nature of their relationship. For example, if they're in a casual or committed relationship.",
  })

  personalRelationshipsCommunityImportantPeopleChildDetails: FormWizard.Field = FieldsFactory.detailsField({
    parentField: this.personalRelationshipsCommunityImportantPeople,
    dependentValue: 'CHILD_PARENTAL_RESPONSIBILITIES',
    text: 'Give details of any children not captured by the previous question',
  })

  personalRelationshipsCommunityImportantPeopleOtherChildrenDetails: FormWizard.Field = FieldsFactory.detailsField({
    text: 'Give details about their relationship',
    parentField: this.personalRelationshipsCommunityImportantPeople,
    dependentValue: 'OTHER_CHILDREN',
  })

  personalRelationshipsCommunityImportantPeopleFamilyDetails: FormWizard.Field = FieldsFactory.detailsField({
    text: 'Give details about their relationship',
    parentField: this.personalRelationshipsCommunityImportantPeople,
    dependentValue: 'FAMILY',
  })

  personalRelationshipsCommunityImportantPeopleFriendsDetails: FormWizard.Field = FieldsFactory.detailsField({
    text: 'Give details about their friendship',
    parentField: this.personalRelationshipsCommunityImportantPeople,
    dependentValue: 'FRIENDS',
  })

  personalRelationshipsCommunityImportantPeopleOtherDetails: FormWizard.Field = FieldsFactory.detailsField({
    parentField: this.personalRelationshipsCommunityImportantPeople,
    dependentValue: 'OTHER',
    required: true,
  })

  personalRelationshipsCommunityFamilyRelationship: FormWizard.Field = {
    text: "What is [subject]'s current relationship like with their family?",
    code: 'personal_relationships_community_family_relationship',
    hint: {
      text: 'Consider any relationships that may act like family support.',
      kind: 'text',
    },
    type: FieldType.Radio,
    validate: [
      { type: ValidationType.Required, message: 'Select what their current relationship is like with their family' },
    ],
    options: [
      {
        text: 'Stable, supportive, positive and rewarding relationship',
        value: 'STABLE_RELATIONSHIP',
        kind: 'option',
      },
      {
        text: 'Both positive and negative relationship',
        value: 'MIXED_RELATIONSHIP',
        kind: 'option',
      },
      {
        text: 'Unstable and unsupportive relationship',
        hint: { text: 'This includes those who have little or no contact with their family.' },
        value: 'UNSTABLE_RELATIONSHIP',
        kind: 'option',
      },
      { text: 'Unknown', value: 'UNKNOWN', kind: 'option' },
    ],
    labelClasses: utils.getMediumLabelClassFor(FieldType.Radio),
  }

  personalRelationshipsCommunityStableFamilyDetails: FormWizard.Field = FieldsFactory.detailsField({
    parentField: this.personalRelationshipsCommunityFamilyRelationship,
    dependentValue: 'STABLE_RELATIONSHIP',
  })

  personalRelationshipsCommunityMixedFamilyDetails: FormWizard.Field = FieldsFactory.detailsField({
    parentField: this.personalRelationshipsCommunityFamilyRelationship,
    dependentValue: 'MIXED_RELATIONSHIP',
  })

  personalRelationshipsCommunityUnstableFamilyDetails: FormWizard.Field = FieldsFactory.detailsField({
    parentField: this.personalRelationshipsCommunityFamilyRelationship,
    dependentValue: 'UNSTABLE_RELATIONSHIP',
  })

  personalRelationshipsCommunityChildhood: FormWizard.Field = {
    text: "What was [subject]'s experience of their childhood?",
    code: 'personal_relationships_community_childhood',
    type: FieldType.Radio,
    validate: [{ type: ValidationType.Required, message: 'Select their experience of childhood' }],
    options: [
      {
        text: 'Positive experience',
        value: 'POSITIVE_CHILDHOOD',
        kind: 'option',
      },
      {
        text: 'Both positive and negative experience',
        value: 'MIXED_CHILDHOOD',
        kind: 'option',
      },
      {
        text: 'Negative experience',
        hint: {
          text: 'This includes things like permanent or long-term separation from their parents or guardians, inconsistent care, neglect or abuse.',
        },
        value: 'NEGATIVE_CHILDHOOD',
        kind: 'option',
      },
    ],
    labelClasses: utils.getMediumLabelClassFor(FieldType.Radio),
  }

  personalRelationshipsCommunityPositiveChildhoodDetails: FormWizard.Field = FieldsFactory.detailsField({
    parentField: this.personalRelationshipsCommunityChildhood,
    dependentValue: 'POSITIVE_CHILDHOOD',
  })

  personalRelationshipsCommunityMixedChildhoodDetails: FormWizard.Field = FieldsFactory.detailsField({
    parentField: this.personalRelationshipsCommunityChildhood,
    dependentValue: 'MIXED_CHILDHOOD',
  })

  personalRelationshipsCommunityNegativeChildhoodDetails: FormWizard.Field = FieldsFactory.detailsField({
    parentField: this.personalRelationshipsCommunityChildhood,
    dependentValue: 'NEGATIVE_CHILDHOOD',
  })

  personalRelationshipsCommunityChildhoodBehaviour: FormWizard.Field = {
    text: 'Did [subject] have any childhood behavioural problems?',
    code: 'personal_relationships_community_childhood_behaviour',
    type: FieldType.Radio,
    validate: [{ type: ValidationType.Required, message: 'Select if they had childhood behavioural problems' }],
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

  personalRelationshipsCommunityYesChildhoodBehaviourProblemsDetails: FormWizard.Field = FieldsFactory.detailsField({
    parentField: this.personalRelationshipsCommunityChildhoodBehaviour,
    dependentValue: 'YES',
  })

  personalRelationshipsCommunityNoChildhoodBehaviourProblemsDetails: FormWizard.Field = FieldsFactory.detailsField({
    parentField: this.personalRelationshipsCommunityChildhoodBehaviour,
    dependentValue: 'NO',
  })

  personalRelationshipsCommunityBelonging: FormWizard.Field = {
    text: 'Is [subject] part of any groups or communities that gives them a sense of belonging? (optional)',
    code: 'personal_relationships_community_belonging',
    hint: { text: 'For example, online social media or community groups.', kind: 'text' },
    type: FieldType.TextArea,
    labelClasses: utils.getMediumLabelClassFor(FieldType.TextArea),
  }

  personalRelationshipsCommunityParentalResponsibilities: FormWizard.Field = {
    text: 'Is [subject] able to manage their parental responsibilities? ',
    code: 'personal_relationships_community_parental_responsibilities',
    hint: {
      text: 'If there are parenting concerns, it does not always mean there are child wellbeing concerns. They may just require some help or support.',
      kind: 'text',
    },
    type: FieldType.Radio,
    validate: [
      { type: ValidationType.Required, message: "Select if they're able to manage their parental responsibilities" },
    ],
    options: [
      {
        text: 'Yes, manages parenting responsibilities well',
        value: 'YES',
        kind: 'option',
      },
      {
        text: 'Sometimes manages parenting responsibilities well',
        value: 'SOMETIMES',
        kind: 'option',
      },
      { text: 'No, is not able to manage parenting responsibilities', value: 'NO', kind: 'option' },
      { text: 'Unknown', value: 'UNKNOWN', kind: 'option' },
    ],
    labelClasses: utils.getMediumLabelClassFor(FieldType.Radio),
  }

  personalRelationshipsCommunityGoodParentalResponsibilitiesDetails: FormWizard.Field = FieldsFactory.detailsField({
    parentField: this.personalRelationshipsCommunityParentalResponsibilities,
    dependentValue: 'YES',
  })

  personalRelationshipsCommunityMixedParentalResponsibilitiesDetails: FormWizard.Field = FieldsFactory.detailsField({
    parentField: this.personalRelationshipsCommunityParentalResponsibilities,
    dependentValue: 'SOMETIMES',
  })

  personalRelationshipsCommunityBadParentalResponsibilitiesDetails: FormWizard.Field = FieldsFactory.detailsField({
    parentField: this.personalRelationshipsCommunityParentalResponsibilities,
    dependentValue: 'NO',
  })

  personalRelationshipsCommunityCurrentRelationship: FormWizard.Field = {
    text: 'Is [subject] happy with their current relationship status?',
    code: 'personal_relationships_community_current_relationship',
    type: FieldType.Radio,
    validate: [
      { type: ValidationType.Required, message: 'Select if they are happy with their current relationship status' },
    ],
    options: [
      {
        text: 'Happy and positive about their relationship status or their relationship is likely to act as a protective factor',
        value: 'HAPPY_RELATIONSHIP',
        kind: 'option',
      },
      {
        text: 'Has some concerns about their relationship status but is overall happy',
        value: 'CONCERNS_HAPPY_RELATIONSHIP',
        kind: 'option',
      },
      {
        text: 'Unhappy about their relationship status or their relationship is unhealthy and directly linked to offending',
        value: 'UNHAPPY_RELATIONSHIP',
        kind: 'option',
      },
    ],
    labelClasses: utils.getMediumLabelClassFor(FieldType.Radio),
  }

  personalRelationshipsCommunityHappyRelationshipDetails: FormWizard.Field = FieldsFactory.detailsField({
    parentField: this.personalRelationshipsCommunityCurrentRelationship,
    dependentValue: 'HAPPY_RELATIONSHIP',
  })

  personalRelationshipsCommunityConcernedRelationshipDetails: FormWizard.Field = FieldsFactory.detailsField({
    parentField: this.personalRelationshipsCommunityCurrentRelationship,
    dependentValue: 'CONCERNS_HAPPY_RELATIONSHIP',
  })

  personalRelationshipsCommunityUnhappyRelationshipDetails: FormWizard.Field = FieldsFactory.detailsField({
    parentField: this.personalRelationshipsCommunityCurrentRelationship,
    dependentValue: 'UNHAPPY_RELATIONSHIP',
  })

  personalRelationshipsCommunityIntimateRelationship: FormWizard.Field = {
    text: "What is [subject]'s history of intimate relationships?",
    code: 'personal_relationships_community_intimate_relationship',
    type: FieldType.Radio,
    validate: [{ type: ValidationType.Required, message: 'Select their history of intimate relationships' }],
    options: [
      {
        text: 'History of stable, supportive, positive and rewarding relationships',
        hint: {
          text: 'This includes if they do not have a history of relationships but appear capable of starting and maintaining one.',
        },
        value: 'STABLE_RELATIONSHIPS',
        kind: 'option',
      },
      {
        text: 'History of both positive and negative relationships',
        value: 'POSITIVE_AND_NEGATIVE_RELATIONSHIPS',
        kind: 'option',
      },
      {
        text: 'History of unstable, unsupportive and destructive relationships',
        hint: { text: 'This includes if they are single and have never had a relationship but would like one.' },
        value: 'UNSTABLE_RELATIONSHIPS',
        kind: 'option',
      },
    ],
    labelClasses: utils.getMediumLabelClassFor(FieldType.Radio),
  }

  personalRelationshipsCommunityStableIntimateRelationship: FormWizard.Field = FieldsFactory.detailsField({
    parentField: this.personalRelationshipsCommunityIntimateRelationship,
    dependentValue: 'STABLE_RELATIONSHIPS',
    textHint: 'Consider patterns and quality of any significant relationships.',
  })

  personalRelationshipsCommunityMixedIntimateRelationshipDetails: FormWizard.Field = FieldsFactory.detailsField({
    parentField: this.personalRelationshipsCommunityIntimateRelationship,
    dependentValue: 'POSITIVE_AND_NEGATIVE_RELATIONSHIPS',
    textHint: 'Consider patterns and quality of any significant relationships.',
  })

  personalRelationshipsCommunityUnstableIntimateRelationshipDetails: FormWizard.Field = FieldsFactory.detailsField({
    parentField: this.personalRelationshipsCommunityIntimateRelationship,
    dependentValue: 'UNSTABLE_RELATIONSHIPS',
    textHint: 'Consider patterns and quality of any significant relationships.',
  })

  personalRelationshipsCommunityChallengesIntimateRelationship: FormWizard.Field = {
    text: 'Is [subject] able to resolve any challenges in their intimate relationships?',
    code: 'personal_relationships_community_challenges_intimate_relationship',
    hint: {
      text: 'Consider any healthy and appropriate skills or strengths they may have.',
      kind: 'text',
    },
    type: FieldType.TextArea,
    validate: [
      {
        type: ValidationType.MaxLength,
        arguments: [FieldsFactory.detailsCharacterLimit],
        message: `Details must be ${FieldsFactory.detailsCharacterLimit} characters or less`,
      },
      { type: ValidationType.Required, message: 'Enter details' },
    ],
    labelClasses: utils.getMediumLabelClassFor(FieldType.TextArea),
  }
}

export default new PersonalRelationshipsFieldsFactory(sections.personalRelationships)
