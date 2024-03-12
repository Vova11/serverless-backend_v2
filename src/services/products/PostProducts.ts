import { DynamoDBClient, PutItemCommand } from '@aws-sdk/client-dynamodb'
import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda'
import { v4 } from 'uuid'
import { marshall } from '@aws-sdk/util-dynamodb'
import { createRandomId, parseJSON } from '../shared/Utils'
import { validateAsProductEntry } from '../shared/Validator'

export async function postProducts(
  event: APIGatewayProxyEvent,
  ddbClient: DynamoDBClient
): Promise<APIGatewayProxyResult> {
  console.log('Calling create method!!!')
  const randomId = createRandomId()
  const product = parseJSON(event.body)
  product.id = randomId
  validateAsProductEntry(product)
  
  const result = await ddbClient.send(
    new PutItemCommand({
      TableName: process.env.TABLE_NAME,
      Item: marshall(product),
    })
  )
  console.log(result)

  return {
    statusCode: 201,
    body: JSON.stringify({ msg: 'Data created', id: randomId }),
  }
}
