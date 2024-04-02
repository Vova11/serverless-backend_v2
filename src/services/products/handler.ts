import { DynamoDBClient } from '@aws-sdk/client-dynamodb'
import {
  APIGatewayProxyEvent,
  APIGatewayProxyResult,
  Context,
} from 'aws-lambda'
import { deleteProduct } from './DeleteProduct'
import { JsonError, MissingFieldError } from '../shared/Validator'
import { updateProduct } from './UpdateProduct'
import { getProducts } from './GetProducts'
import { postProducts } from './PostProducts'
import { addCorsHeader } from '../shared/Utils'

const ddbClient = new DynamoDBClient({})

async function handler(
  event: APIGatewayProxyEvent,
  context: Context
): Promise<APIGatewayProxyResult> {
  let response: APIGatewayProxyResult

  try {
    switch (event.httpMethod) {
      case 'GET':
        const getResponse = await getProducts(event, ddbClient)
        response = getResponse
        break
      case 'POST':
        const postResponse = await postProducts(event, ddbClient)
        response = postResponse
        break
      case 'PUT':
        const putResponse = await updateProduct(event, ddbClient)
        response = putResponse
        break
      case 'DELETE':
        const deleteResponse = await deleteProduct(event, ddbClient)
        response = deleteResponse
        break
      default:
        break
    }
  } catch (error) {
    if (error instanceof MissingFieldError) {
      return {
        statusCode: 400,
        body: JSON.stringify(error.message),
      }
    }
    if (error instanceof JsonError) {
      return {
        statusCode: 400,
        body: JSON.stringify(error.message),
      }
    }
    console.log(error);
    
    return {
      statusCode: 500,
      body: JSON.stringify('Caught an unknown error:', error.message),
    }
  }
  addCorsHeader(response)
  return response
}

export { handler }
