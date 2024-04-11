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
  console.log(event)

  const randomId = createRandomId()
  const { itemType, ...item } = JSON.parse(event.body)

   
  // Set PK and SK based on the itemType
  let PK, SK
  switch (itemType) {
    case 'warehouse':
      PK = `w#${randomId}`
      SK = PK // Same value for warehouse items
      break
    case 'category':
      PK = `cat#${item.category}`
      SK = `p#${randomId}` // Same value for category items
      break
    case 'order':
      PK = `o#${randomId}`
      SK = PK // Same value for order items
      break
    case 'product':
      PK = `p#${randomId}`
      SK = PK // Same value for product items
      break
    default:
      return {
        statusCode: 400,
        body: JSON.stringify({ error: `Invalid itemType: ${itemType}` }),
      }
  }

  item.PK = PK
  item.SK = SK

  console.log(item)
  console.log(`${itemType} item`)

  validateAsProductEntry(item)

  const result = await ddbClient.send(
    new PutItemCommand({
      TableName: process.env.TABLE_NAME,
      Item: marshall(item),
    })
  )
  console.log(result)

  return {
    statusCode: 201,
    body: JSON.stringify({ msg: 'Data created', SK: randomId }),
  }
}
