export interface ModeConfig {
  readonly showReturnToOasysButton: boolean
  readonly showVersionFromDateBanner: boolean
}

export interface ModesConfig {
  readonly [key: string]: ModeConfig
}

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
