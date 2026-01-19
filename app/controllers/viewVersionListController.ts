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

      // Separate current version from all versions
      const sortedAllVersionEntries = Object.entries(versions.allVersions).sort((a, b) => b[0].localeCompare(a[0]))
      const sortedCountersignedVersionEntries = Object.entries(versions.countersignedVersions).sort((a, b) =>
        b[0].localeCompare(a[0]),
      )

      const currentVersionEntry = sortedAllVersionEntries[0]
      const previousVersionEntries = sortedAllVersionEntries.slice(1)

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

      const mapVersion = (version: LastVersionsOnDate) => {
        const planAgreementStatus = version.planVersion?.planAgreementStatus
        const status = version.planVersion?.status

        const planAgreementStatusInfo = planAgreementStatusMap[planAgreementStatus] || { text: '', classes: '' }
        const countersignedStatusInfo = countersignedStatusMap[status] || { text: '', classes: '' }

        return {
          planVersion: {
            uuid: version.planVersion?.uuid,
            updatedAt: version.planVersion?.updatedAt,
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
            uuid: version.assessmentVersion?.uuid,
            updatedAt: version.assessmentVersion?.updatedAt,
            status: version.assessmentVersion?.status,
          },
          description: version.description,
        }
      }

      const currentVersion = currentVersionEntry ? mapVersion(currentVersionEntry[1]) : null

      const allMappedVersions = previousVersionEntries.map(([, version]) => mapVersion(version))
      const countersignedMappedVersions = sortedCountersignedVersionEntries.map(([, version]) => mapVersion(version))

      // Filter out repeated status tags for all versions (comparing with current version first)
      if (currentVersion) {
        let previousPlanAgreementStatus = currentVersion.planVersion.planAgreementStatus
        let previousCountersignedStatus = currentVersion.planVersion.status

        for (let i = 0; i < allMappedVersions.length; i++) {
          const version = allMappedVersions[i]

          if (version.planVersion.planAgreementStatus === previousPlanAgreementStatus) {
            allMappedVersions[i].planVersion.showPlanAgreementStatus = false
          } else {
            previousPlanAgreementStatus = version.planVersion.planAgreementStatus
          }

          if (version.planVersion.status === previousCountersignedStatus) {
            allMappedVersions[i].planVersion.showCountersignedStatus = false
          } else {
            previousCountersignedStatus = version.planVersion.status
          }
        }
      }

      res.locals.currentVersion = currentVersion
      res.locals.countersignedVersions = countersignedMappedVersions
      res.locals.previousVersions = allMappedVersions

      await super.locals(req, res, next)
    } catch (error) {
      next(error)
    }
  }
}
