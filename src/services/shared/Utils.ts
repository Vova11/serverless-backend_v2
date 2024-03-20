import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda'
import { randomUUID } from 'crypto'
import { JsonError } from './Validator'

export function createRandomId() {
  return randomUUID()
}

export function parseJSON(arg: string) {
  try {
    return JSON.parse(arg)
  } catch (error) {
    throw new JsonError(error.message)
  }
}

export function hasAdminGroup(event: APIGatewayProxyEvent) {
  // const groups = event.Authorization requestContext.authorizer?.claims['cognito:groups']
  const groups = event.headers['Authorization']['payload']['cognito:groups']
  
  if (groups) {
    return (groups as string).includes('admins')
  }
  return false
}