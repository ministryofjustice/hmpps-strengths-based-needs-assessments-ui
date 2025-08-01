import { ModesConfig } from './@types/mode-config'

// eslint-disable-next-line import/prefer-default-export
export const modesConfig: ModesConfig = {
  view: {
    showReturnToOasysButton: true,
    showVersionFromDateBanner: false,
  },
  edit: {
    showReturnToOasysButton: true,
    showVersionFromDateBanner: false,
  },
  'view-historic': {
    showReturnToOasysButton: false,
    showVersionFromDateBanner: true,
  },
}
