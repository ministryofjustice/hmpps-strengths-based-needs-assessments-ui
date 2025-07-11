import { Field } from '../../app/utils/fieldDependencyTreeBuilder'
import { drugsList } from '../../app/form/v1_0/fields/drug-use/drugs'

interface Actions {
  items: {
    href: string
    text: 'Change'
  }[]
}

interface DrugCardRow {
  key: {
    text: string
  }
  value: {
    html: string
  }
  actions: Actions
}

interface DrugCard {
  card: {
    title: {
      text: string
    }
    actions?: Actions
  }
  rows: DrugCardRow[]
}

type DrugsSummary = {
  usedInTheLastSix: DrugCard[]
  notUsedInTheLastSix: DrugCard[]
  otherFields: Field[]
}

export default (summaryFields: Field[], isInEditMode: boolean): DrugsSummary => {
  const usedInTheLastSix: DrugCard[] = []
  const notUsedInTheLastSix: DrugCard[] = []
  const selectDrugsField = summaryFields.find(it => it.field.code === 'select_misused_drugs')

  selectDrugsField?.answers.forEach(drug => {
    const lastUsedFieldCode = `drug_last_used_${drug.value.toLowerCase()}`
    const lastUsedField = drug.nestedFields.find(it => it.field.code === lastUsedFieldCode)
    const lastUsedAnswer = lastUsedField?.answers[0]
    const isLastSix = lastUsedAnswer.value === 'LAST_SIX'
    const isMoreThanSix = lastUsedAnswer.value === 'MORE_THAN_SIX'

    const lastUsedMoreThanSix = isMoreThanSix ? 'More than 6 months ago' : ''

    const drugCard: DrugCard = {
      card: {
        title: {
          text:
            drug.value === 'OTHER_DRUG'
              ? drug.nestedFields.find(it => it.field.code === 'other_drug_name')?.answers[0]?.text
              : drug.text,
        },
        actions: {
          items: isInEditMode
            ? [
                {
                  href: selectDrugsField.changeLink,
                  text: 'Change',
                },
              ]
            : [],
        },
      },
      rows: [
        {
          key: {
            text: 'Last used',
          },
          value: {
            html: isLastSix ? 'In the last 6 months' : lastUsedMoreThanSix,
          },
          actions: {
            items:
              isInEditMode && lastUsedField
                ? [
                    {
                      href: lastUsedField.changeLink,
                      text: 'Change',
                    },
                  ]
                : [],
          },
        },
      ],
    }

    if (isLastSix) {
      const howOftenUsedFieldCode = `how_often_used_last_six_months_${drug.value}`.toLowerCase()
      const howOftenUsedField = lastUsedAnswer.nestedFields.find(it => it.field.code === howOftenUsedFieldCode)
      const howOftenUsedDetailsField = lastUsedAnswer.nestedFields.find(
        it => it.field.code === `${howOftenUsedFieldCode}_details`,
      )

      drugCard.rows.push(
        {
          key: {
            text: 'How often',
          },
          value: {
            html: howOftenUsedField?.answers[0]?.text,
          },
          actions: {
            items:
              isInEditMode && howOftenUsedField
                ? [
                    {
                      href: howOftenUsedField.changeLink,
                      text: 'Change',
                    },
                  ]
                : [],
          },
        },
        {
          key: {
            text: 'Give details (optional)',
          },
          value: {
            html: howOftenUsedDetailsField?.answers[0]?.text,
          },
          actions: {
            items:
              isInEditMode && howOftenUsedField
                ? [
                    {
                      href: `${howOftenUsedField.changeLink}_details`,
                      text: 'Change',
                    },
                  ]
                : [],
          },
        },
      )
    }

    const isInjectable = drugsList.some(it => it.value === drug.value && it.injectable)
    if (isInjectable) {
      const injectedField = summaryFields.find(it => it.field.code === 'drugs_injected')
      const isInjectedAnswer = injectedField?.answers?.find(it => it.value === drug.value)
      const isInjected = isInjectedAnswer !== undefined
      const isNotInjected = !isInjected && injectedField?.answers?.length > 0
      const injectedWhen =
        isInjectedAnswer === undefined
          ? []
          : isInjectedAnswer.nestedFields
              .filter(it => it.field.code === `drugs_injected_${drug.value.toLowerCase()}`)
              .flatMap(it => it.answers.map(answer => answer.text))

      if (isInjected && isMoreThanSix && injectedWhen.length === 0) {
        injectedWhen.push('More than 6 months ago')
      }

      const injectedHtmlValue = [
        ...(isInjected ? ['Yes'] : []),
        ...(isNotInjected ? ['No'] : []),
        ...injectedWhen,
      ].join('<br>')

      drugCard.rows.push({
        key: {
          text: 'Injected',
        },
        value: {
          html: injectedHtmlValue,
        },
        actions: {
          items:
            isInEditMode && injectedField
              ? [
                  {
                    href: injectedField.changeLink,
                    text: 'Change',
                  },
                ]
              : [],
        },
      })
    }

    if (isLastSix) {
      usedInTheLastSix.push(drugCard)
    } else if (isMoreThanSix) {
      notUsedInTheLastSix.push(drugCard)
    }
  })

  const notUsedInTheLastSixDetailsField =
    notUsedInTheLastSix.length > 0
      ? summaryFields.find(it => it.field.code === 'not_used_in_last_six_months_details')
      : null

  return {
    usedInTheLastSix,
    notUsedInTheLastSix,
    otherFields: notUsedInTheLastSixDetailsField ? [notUsedInTheLastSixDetailsField] : [],
  }
}
