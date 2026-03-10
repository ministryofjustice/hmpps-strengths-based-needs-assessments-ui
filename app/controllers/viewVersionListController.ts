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

      const mapVersion = (version: LastVersionsOnDate) => {
        return {
          assessmentVersion: {
            uuid: version.assessmentVersion?.uuid,
            updatedAt: version.assessmentVersion?.updatedAt,
            status: version.assessmentVersion?.status,
          },
        }
      }

      const currentVersion = currentVersionEntry ? mapVersion(currentVersionEntry[1]) : null

      const allMappedVersions = previousVersionEntries.map(([, version]) => mapVersion(version))
      const countersignedMappedVersions = sortedCountersignedVersionEntries.map(([, version]) => mapVersion(version))

      res.locals.currentVersion = currentVersion
      res.locals.countersignedVersions = countersignedMappedVersions
      res.locals.previousVersions = allMappedVersions

      await super.locals(req, res, next)
    } catch (error) {
      next(error)
    }
  }
}
