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
  const groups = event.requestContext.authorizer?.claims['cognito:groups']
  console.log(typeof groups);
  console.log('groups are');
  
  if (typeof groups === 'string' && groups.includes('admin')) {
    console.log('User is in the "admin" group.')
    // Proceed with admin-specific logic
    return true
  } else {
    console.log(
      'User is not in the "admin" group or groups claim is not a string.'
    )
    return false
    // Handle non-admin users or invalid groups claim
  }

}

