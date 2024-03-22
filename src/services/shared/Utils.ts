import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda'
import { randomUUID } from 'crypto'
import { JsonError } from './Validator'

export function createRandomId() {
  return randomUUID()
}

export function addCorsHeader(arg: APIGatewayProxyResult) {
  if (!arg.headers) {
    arg.headers = {}
  }
  arg.headers['Access-Control-Allow-Origin'] = '*' // Put website name
  arg.headers['Access-Control-Allow-Methods'] = '*' // Put website name
}

export function parseJSON(arg: string) {
  try {
    return JSON.parse(arg)
  } catch (error) {
    throw new JsonError(error.message)
  }
}

export function hasAdminGroup(event: APIGatewayProxyEvent) {
  const groups = event.headers['Authorization']['payload']['cognito:groups']

  if (groups) {
    return (groups as string).includes('admins')
  }
  return false
}
