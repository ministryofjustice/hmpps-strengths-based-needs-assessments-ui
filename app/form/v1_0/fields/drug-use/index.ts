import sections, { Section } from '../../config/sections'
import { FieldsFactory } from '../common'
import addDrugs from './add-drugs'
import drugDetails from './drug-details'
import drugUse from './drug-use'
import drugUseAnalysis from './drug-use-analysis'
import drugUseHistory from './drug-use-history'

class DrugUse extends FieldsFactory {
  readonly addDrugs

  readonly drugDetails

  readonly drugUse

  readonly drugUseAnalysis

  readonly drugUseHistory

  constructor(section: Section) {
    super(section)
    this.addDrugs = addDrugs
    this.drugDetails = drugDetails
    this.drugUse = drugUse
    this.drugUseAnalysis = drugUseAnalysis
    this.drugUseHistory = drugUseHistory
  }
}

export default new DrugUse(sections.drugs)
