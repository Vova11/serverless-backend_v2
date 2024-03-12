import {
  DeleteItemCommand,
  DynamoDBClient,
  UpdateItemCommand,
} from '@aws-sdk/client-dynamodb'
import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda'


export async function deleteProduct(
  event: APIGatewayProxyEvent,
  ddbClient: DynamoDBClient
): Promise<APIGatewayProxyResult> {
  
  if (event.queryStringParameters && 'id' in event.queryStringParameters) {
    const productId = event.queryStringParameters['id']

    await ddbClient.send(
      new DeleteItemCommand({
        TableName: process.env.TABLE_NAME,
        Key: {
          id: { S: productId },
        },
      })
    )

    return {
      statusCode: 200,
      body: JSON.stringify(`Deleted space with id ${productId}`),
    }
  }
  return {
    statusCode: 400,
    body: JSON.stringify('Please provide right args!!'),
  }
}
