export interface ModeConfig {
  showReturnToOasysButton: boolean
  showVersionFromDateBanner: boolean
}

export interface ModesConfig {
  [key: string]: ModeConfig
}

export const modesConfig: ModesConfig = Object.freeze({
  view: Object.freeze({
    showReturnToOasysButton: true,
    showVersionFromDateBanner: false,
  }),
  edit: Object.freeze({
    showReturnToOasysButton: true,
    showVersionFromDateBanner: false,
  }),
  'view-historic': Object.freeze({
    showReturnToOasysButton: false,
    showVersionFromDateBanner: true,
  }),
})
