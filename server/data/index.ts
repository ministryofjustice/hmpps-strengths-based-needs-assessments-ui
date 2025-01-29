/*
 * Do appinsights first as it does some magic instrumentation work, i.e. it affects other 'require's
 * In particular, applicationinsights automatically collects bunyan logs
 */
import HmppsAuthClient from './hmppsAuthClient'

export default () => new HmppsAuthClient()
