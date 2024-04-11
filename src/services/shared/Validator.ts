import { ProductEntry } from '../model/Models'

export class MissingFieldError extends Error {
  constructor(missingField: string) {
    super(`Value for ${missingField} expected!`)
  }
}

export class JsonError extends Error {}

export function validateAsProductEntry(arg: any) {
  const requiredFields = ['title']

  for (const field of requiredFields) {
    if (arg[field] === undefined) {
      throw new MissingFieldError(field)
    }
  }
}