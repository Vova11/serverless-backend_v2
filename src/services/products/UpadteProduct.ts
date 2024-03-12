import { log } from 'console'
import {
  DynamoDBClient,
  GetItemCommand,
  ScanCommand,
  UpdateItemCommand,
} from '@aws-sdk/client-dynamodb'
import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda'
import { unmarshall } from '@aws-sdk/util-dynamodb'

export async function updateProduct(
  event: APIGatewayProxyEvent,
  ddbClient: DynamoDBClient
): Promise<APIGatewayProxyResult> {
  if (
    event.queryStringParameters &&
    'id' in event.queryStringParameters &&
    event.body
  ) {
    const parsedBody = JSON.parse(event.body)
    const productId = event.queryStringParameters['id']
    const requestBodyKey = Object.keys(parsedBody)[0]
    const requestBodyValue = parsedBody[requestBodyKey]
    console.log(requestBodyKey)
    console.log(requestBodyValue)
    
    const updatedResult = await ddbClient.send(
      new UpdateItemCommand({
        TableName: process.env.TABLE_NAME,
        Key: {
          id: { S: productId },
        },
        UpdateExpression: 'set #zzzNew = :new',
        ExpressionAttributeValues: {
          ':new': {
            S: requestBodyValue,
          },
        },
        ExpressionAttributeNames: {
          '#zzzNew': requestBodyKey,
        },
        ReturnValues: 'UPDATED_NEW',
      })
    )
    return {
      statusCode: 204,
      body: JSON.stringify(updatedResult.Attributes),
    }
  }
  return {
    statusCode: 400,
    body: JSON.stringify('Please provide right args'),
  }
}
