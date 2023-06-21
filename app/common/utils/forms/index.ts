/* eslint-disable import/no-dynamic-require, global-require, @typescript-eslint/no-var-requires */
import * as express from 'express'
import fs, { Dirent } from 'fs'
import FormRouterBuilder from './formRouterBuilder'
import { BaseFormOptions, Form } from './common'

export const bootstrapFormConfiguration = (forms: Form[], options: BaseFormOptions): express.Router => {
  return FormRouterBuilder.configure(forms, options).mountActive().build()
}

const dirRegex = /v(\d*)_(\d*)__([a-zA-Z0-9_-]*)/

export const loadFormsInDirectory = (baseDir: string): Form[] =>
  fs
    .readdirSync(baseDir, { withFileTypes: true })
    .filter((fsEntry: Dirent): boolean => fsEntry.isDirectory() && dirRegex.test(fsEntry.name))
    .map((directory: Dirent): Form => {
      const versionDetails: string[] = dirRegex.exec(directory.name).slice(1)
      const [major, minor, tag] = versionDetails
      const formConfiguration = require(`${baseDir}/${directory.name}`).default
      return {
        steps: formConfiguration.steps,
        fields: formConfiguration.fields,
        options: {
          ...formConfiguration.options,
          version: `${major}.${minor}`,
          tag: tag.replace(/[_-]/gm, ' '),
        },
      }
    })
