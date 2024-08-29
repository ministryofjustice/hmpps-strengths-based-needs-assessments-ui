import FormWizard from 'hmpo-form-wizard'
import { FieldType } from '../../server/@types/hmpo-form-wizard/enums'
import SaveAndContinueController from './saveAndContinueController';

abstract class BaseCollectionController extends SaveAndContinueController {
  static noCollectionAnswers = (field: FormWizard.Field) => {
    if (field.type !== FieldType.Collection) {
      throw new Error(`Field ${field.code} is not of type Collection`)
    }
    return (req: FormWizard.Request) => (req.form.persistedAnswers[field.code] || []).length === 0
  }
}

export default BaseCollectionController
