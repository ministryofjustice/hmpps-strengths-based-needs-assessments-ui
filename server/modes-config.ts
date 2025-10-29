export interface ModeConfig {
  readonly showReturnToOasysButton: boolean
  readonly showVersionFromDateBanner: boolean
  readonly showPreviousVersionsLink: boolean
  readonly showContinueButton: boolean
}

export interface ModesConfig {
  readonly [key: string]: ModeConfig
}

export const modesConfig: ModesConfig = {
  view: {
    showReturnToOasysButton: true,
    showVersionFromDateBanner: false,
    showPreviousVersionsLink: true,
    showContinueButton: false,
  },
  edit: {
    showReturnToOasysButton: true,
    showVersionFromDateBanner: false,
    showPreviousVersionsLink: true,
    showContinueButton: true,
  },
  'view-historic': {
    showReturnToOasysButton: false,
    showVersionFromDateBanner: true,
    showPreviousVersionsLink: false,
    showContinueButton: false,
  },
}
