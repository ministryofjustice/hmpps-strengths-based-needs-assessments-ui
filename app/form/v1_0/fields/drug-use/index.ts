import FormWizard from 'hmpo-form-wizard'
import sections, { Section } from '../../config/sections'
import { FieldsFactory } from '../common'
// TODO: Uncomment your fields import as you add it.
import addDrugs from './add-drugs'
// import drugDetails from './drug-details'
import drugUse from './drug-use'
import drugUseAnalysis from './drug-use-analysis'
import drugUseHistory from './drug-use-history'

class DrugUse extends FieldsFactory {
  readonly addDrugs

  // readonly drugDetails

  readonly drugUse

  readonly drugUseAnalysis

  readonly drugUseHistory

  constructor(section: Section) {
    super(section)
    // TODO: Uncomment your fields import as you add it.
    this.addDrugs = addDrugs
    // this.drugDetails = drugDetails
    this.drugUse = drugUse
    this.drugUseAnalysis = drugUseAnalysis
    this.drugUseHistory = drugUseHistory
  }
}

export default new DrugUse(sections.drugs)
