import { DateTime } from 'luxon'
import config from '../config'

export default (): string => {
  if (config.maintenance.unplanned) {
    return 'The service is experiencing technical issues, and you may have limited access.'
  }

  const start = DateTime.fromSeconds(config.maintenance.start)
  const end = DateTime.fromSeconds(config.maintenance.end)

  if (end <= DateTime.now()) {
    return ''
  }

  const formatDate = (date: DateTime): string =>
    `${date.toFormat('ha').toLowerCase()} on ${date.toFormat('cccc d LLLL')}`

  const startString = start.startOf('day').equals(end.startOf('day'))
    ? `${start.toFormat('ha').toLowerCase()}`
    : formatDate(start)

  return `The service will be unavailable between ${startString} and ${formatDate(end)}, so that we can carry out routine maintenance work.`
}
