# Form versions in the Strengths And Needs application

To create a new form version you will need to make changes in both the UI and API applications.

## API Application

The API knows about versioning because it needs to map the submitted data to OASys fields so it can provide the data back in an understandable form, and the mappings can change in different form versions.

The API application contains form version references in two places:

1. The index into the different form mapping configurations in `src/main/kotlin/uk/gov/justice/digital/hmpps/hmppsstrengthsbasedneedsassessmentsapi/oasys/datamapping/MappingProvider.kt`
2. The versioned directories under `src/main/kotlin/uk/gov/justice/digital/hmpps/hmppsstrengthsbasedneedsassessmentsapi/oasys/datamapping`

### Data mapping files

These are executed in full each time an assessment is submitted or updated.

## UI Application

The UI knows about versioning because it stores the questions and answers that users are asked, conditions for moving between the steps etc.

When running locally you can view the config spec for different form versions at URLs like http://localhost:3000/config/1/0

The UI application contains form version references in multiple places:

1. The versioned form config is in `app/form`
2. Forms are made available to routing from `app/index.ts` - the latest version here must match the latest version provided by the API when requesting http://localhost:3000/config/latest

### Possible problems

The `startController.ts`, `baseController.ts` and `saveAndContinueController.ts` files all import files directly from the versioned form config directory. We should consider whether this is the best way to do this, or whether we should be using a mapping function to get the correct version of the form config.

There may be some utility functions in files in the `utils` directory which need to be versioned but currently are not.
