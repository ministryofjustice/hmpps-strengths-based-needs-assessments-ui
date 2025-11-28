import { Response, NextFunction } from 'express'
import FormWizard from 'hmpo-form-wizard'
import SaveAndContinueController from './saveAndContinueController'
import { SessionData } from '../../server/services/strengthsBasedNeedsService'
import { LastVersionsOnDate } from '../../server/services/arnsCoordinatorApiService'

export default class ViewVersionListController extends SaveAndContinueController {
  async locals(req: FormWizard.Request, res: Response, next: NextFunction) {
    try {
      const sessionData = req.session.sessionData as SessionData
      const versions = await this.service.getVersionsByEntityId(sessionData.assessmentId)

      // Separating the current version from the previous versions
      const sortedVersions = Object.entries(versions.allVersions).sort((a, b) => b[0].localeCompare(a[0]))

      const [currentVersionEntry, ...previousVersions] = sortedVersions
      const currentVersion = currentVersionEntry ? currentVersionEntry[1] : null

      const trimmedAllVersions = Object.fromEntries(previousVersions)

      const planAgreementStatusMap: Record<string, { text: string; classes: string }> = {
        AGREED: { text: 'Plan Agreed', classes: 'govuk-tag--green' },
        COULD_NOT_ANSWER: { text: 'Plan Created', classes: 'govuk-tag--blue' },
        DO_NOT_AGREE: { text: 'Plan Created', classes: 'govuk-tag--blue' },
        UPDATED_AGREED: { text: 'Plan agreement updated', classes: 'govuk-tag--light-blue' },
        DRAFT: { text: '', classes: '' },
      }

      const countersignedStatusMap: Record<string, { text: string; classes: string }> = {
        COUNTERSIGNED: { text: 'Countersigned', classes: 'govuk-tag--turquoise' },
        DOUBLE_COUNTERSIGNED: { text: 'Countersigned', classes: 'govuk-tag--turquoise' },
      }

      const allMappedVersions = Object.values(trimmedAllVersions).map((version: LastVersionsOnDate) => {
        const assessmentVersionData = version.assessmentVersion || currentVersion?.assessmentVersion || null
        const planVersionData = version.planVersion || currentVersion?.planVersion || null

        const planAgreementStatus = planVersionData?.planAgreementStatus
        const status = planVersionData?.status

        const planAgreementStatusInfo = planAgreementStatusMap[planAgreementStatus] || { text: '', classes: '' }
        const countersignedStatusInfo = countersignedStatusMap[status] || { text: '', classes: '' }

        return {
          planVersion: {
            uuid: planVersionData?.uuid,
            updatedAt: planVersionData?.updatedAt,
            status,
            planAgreementStatus,

            planAgreementStatusText: planAgreementStatusInfo.text,
            planAgreementStatusClass: planAgreementStatusInfo.classes,
            showPlanAgreementStatus: !!planAgreementStatusInfo.text,

            countersignedStatusText: countersignedStatusInfo.text,
            countersignedStatusClass: countersignedStatusInfo.classes,
            showCountersignedStatus: !!countersignedStatusInfo.text,
          },
          assessmentVersion: {
            uuid: assessmentVersionData?.uuid,
            updatedAt: assessmentVersionData?.updatedAt,
          },
          description: version.description,
        }
      })

      res.locals.countersignedVersions = allMappedVersions.filter(
        version =>
          version.planVersion?.status === 'COUNTERSIGNED' || version.planVersion?.status === 'DOUBLE_COUNTERSIGNED',
      )

      res.locals.previousVersions = allMappedVersions

      await super.locals(req, res, next)
    } catch (error) {
      next(error)
    }
  }
}
