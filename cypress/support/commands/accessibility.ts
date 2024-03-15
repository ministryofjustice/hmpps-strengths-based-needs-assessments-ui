import { Result } from 'axe-core'

// eslint-disable-next-line import/prefer-default-export
export const checkAccessibility = () => {
  cy.injectAxe()
  return cy.url().then(url => {
    cy.checkA11y(
      null,
      null,
      violations => {
        logViolations(url, violations)
      },
      true,
    )
  })
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

  const violationsReportData = violations.map(
    ({ id, impact, description, nodes }) => `
      ID: ${id}
      Impact: ${impact}
      Description: ${description}
      Nodes: (${nodes.length})
        ${nodes.map(node => node.html).join('\n        ')}
    `,
  )
  const violationsReport = `
    URL: ${url}
    Violations: (${violations.length})
    ${violationsReportData.join('')}
    
    +-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+
    
  `
  cy.writeFile(Cypress.env('accessibilityReportPath'), violationsReport, { flag: 'a+' })
}
