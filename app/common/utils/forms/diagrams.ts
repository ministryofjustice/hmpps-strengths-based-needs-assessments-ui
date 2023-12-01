import { Form } from './common'

export const createStateDiagramFromForm = (form: Form): string => {
  // an array of strings containing the links per section
  const links = []

  // an array of strings containing the fields per section
  const fields = []

  // loop over the steps appending the links and fields to the relevant section
  for (const stepName in form.steps) {
    const step = form.steps[stepName]

    const formattedStepName = formatForPlantUML(stepName)

    // if this is the first time we've come across this section then create a new string for its links and fields
    if (!(step.section in links)) {
      links[step.section] = ''
    }

    if (!(step.section in fields)) {
      fields[step.section] = ''
    }

    // the next field contains either:
    // - an empty array: this indicates that nothing links from this step
    // - an array : this indicates there are multiple links from this step
    // - a string : this indicates there is a single link from this step
    if ('next' in step) {
      if (Array.isArray(step.next)) {
        if (step.next.length == 0) {
          // we're ignoring this
        } else {
          // loop over the next steps. Each item could be either
          // - a string : this indicates we'll always go to the next step
          // - an object : this will contain the rules about when to activate this step
          for (var i = 0; i < step.next.length; i++) {
            if (typeof step.next[i] === 'string' || step.next[i] instanceof String) {
              links[step.section] += `${formattedStepName}-->${formatForPlantUML(step.next[i])}\n`
            } else {
              links[step.section] += `${formattedStepName}-->${formatForPlantUML(
                step.next[i].next,
              )} : [${formatForPlantUML(step.next[i].field)} = ${formatForPlantUML(step.next[i].value)}]\n`
            }
          }
        }
      } else {
        links[step.section] += `${formattedStepName}-->${formatForPlantUML(step.next)}\n`
      }
    }

    // loop over the fields in the current step and append them to the fields string for this section
    if ('fields' in step) {
      for (var i = 0; i < step.fields.length; i++) {
        // fields[step.section] += formatForPlantUML(stepName) + " : \"" + formatForPlantUML(form.fields[step.fields[i]].text) + "\"\n"
        fields[step.section] += `${formattedStepName} : "${formatForPlantUML(step.fields[i])}"\n`
      }
    }
  }

  // create and the plantuml code by concatenating a bunch of strings
  // let diagram = "@startuml\ntop to bottom direction\n"
  let diagram = 'stateDiagram-v2\n'
  for (const sectionName in links) {
    if (sectionName != 'none') {
      diagram += `state ${formatForPlantUML(`${sectionName}_section`)} {\n${links[sectionName]}${
        fields[sectionName]
      }}\n\n`
    }
  }
  // diagram += "\n@enduml"

  return diagram

  diagram = `
             stateDiagram-v2
                 [*] --> Still
                 Still --> [*]

                 Still --> Moving
                 Moving --> Still
                 Moving --> Crash
                 Crash --> [*]
                 `

  return diagram
}

const formatForPlantUML = (text: string): string => {
  if (typeof text === 'string' || text instanceof String) {
    // convert any colons to underscores
    text = text.replace(/:/g, '_')

    // convert any dashes to underscores
    text = text.replace(/-/g, '_')

    // remove any leading slashes
    text = text.replace(/^\//, '')

    // remove anything past a # (as this is just a page anchor)
    text = text.replace(/\#.*$/, '')
  } else {
    console.log(JSON.stringify(stepName))
    return 'Not a string'
  }

  return text
}
