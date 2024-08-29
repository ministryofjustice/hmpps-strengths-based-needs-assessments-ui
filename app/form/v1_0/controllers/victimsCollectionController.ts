import offenceAnalysisFields from '../fields/offence-analysis'
import BaseCollectionController from '../../../controllers/baseCollectionController'

class VictimsCollectionController extends BaseCollectionController {
  readonly field = offenceAnalysisFields.offenceAnalysisVictimsCollection
}

export default VictimsCollectionController
