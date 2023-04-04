import bunyan from 'bunyan'
import bunyanFormat from 'bunyan-format'
import config from './server/config'

const formatOut = bunyanFormat({ outputMode: 'short', color: !config.production })

const logger = bunyan.createLogger({
  name: 'HMPPS Strengths Based Needs Assessments UI',
  stream: formatOut,
  level: 'debug',
})

export default logger
