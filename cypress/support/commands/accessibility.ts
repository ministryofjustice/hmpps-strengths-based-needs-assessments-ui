import { ImpactValue, Result } from 'axe-core'
import fs from 'fs'

const violationsTempPath = 'test_results/cypress/accessibility-temp/violations.txt'
const violationsReportPath = 'test_results/cypress/accessibilityReport.txt'

interface Violation {
  id: string
  impact: ImpactValue
  description: string
  nodes: string[]
  urls: string[]
}

// eslint-disable-next-line import/prefer-default-export
export const checkAccessibility = (injectAxe: boolean = true) => {
  if (injectAxe) cy.injectAxe()
  cy.location().then(url => {
    cy.checkA11y(
      null,
      null,
      violations => {
        logViolations(url.pathname, violations)
      },
      true,
    )
  })
}

export const clearBeforeRun = () => {
  fs.rmSync(violationsTempPath, { force: true })
}

export const generateReport = () => {
  const violations = fs
    .readFileSync(violationsTempPath)
    .toString()
    .split('\n')
    .filter(line => line !== '')
    .map(line => JSON.parse(line) as Violation)

  const violationsMap: Record<string, Violation> = {}
  const dedupe = (item: string, index: number, items: string[]) => items.indexOf(item) === index

  violations.forEach(violation => {
    if (violationsMap[violation.id] === undefined) {
      violationsMap[violation.id] = violation
      return
    }

    ;['nodes', 'urls'].forEach(prop => {
      violationsMap[violation.id][prop] = [...violationsMap[violation.id][prop], ...violation[prop]].filter(dedupe)
    })
  })

  const violationsReportData = Object.entries(violationsMap)
    .map(
      ([id, violation]) =>
        `\n\n\tID: ${id}` +
        `\n\tImpact: ${violation.impact}` +
        `\n\tDescription: ${violation.description}` +
        `\n\n\tNodes: (${violation.nodes.length})` +
        `\n\t\t${violation.nodes.map((node, index) => `[${index + 1}] ${node}`).join('\n\t\t')}` +
        `\n\n\tAppears on: (${violation.urls.length})` +
        `\n\t\t${violation.urls.map((url, index) => `[${index + 1}] ${url}`).join('\n\t\t')}`,
    )
    .join('\n\n\t+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+')
  const violationsReport = `Violations: (${Object.keys(violationsMap).length})${violationsReportData}`
  fs.writeFileSync(violationsReportPath, violationsReport, { flag: 'w+' })
}

const logViolations = (url: string, violations: Result[]) => {
  cy.task(
    'log',
    `${violations.length} accessibility violation${
      violations.length === 1 ? '' : 's'
    } ${violations.length === 1 ? 'was' : 'were'} detected`,
  )

  const violationTableData = violations.map(({ id, impact, description, nodes }) => ({
    id,
    impact,
    description,
    nodes: nodes.length,
  }))
  cy.task('table', violationTableData)

  violations.forEach(violation => {
    const data: Violation = {
      id: violation.id,
      impact: violation.impact,
      description: violation.description,
      nodes: violation.nodes.map(node => node.html),
      urls: [url],
    }
    cy.writeFile(violationsTempPath, `${JSON.stringify(data)}\n`, { flag: 'a+' })
  })
}
