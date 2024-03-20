import { SES_REGION } from './../../../env';
import {
  DeleteItemCommand,
  DynamoDBClient,
} from '@aws-sdk/client-dynamodb'
import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda'
import { hasAdminGroup } from '../shared/Utils';



export async function deleteProduct(
  event: APIGatewayProxyEvent,
  ddbClient: DynamoDBClient
): Promise<APIGatewayProxyResult> {
  console.log('Deleteing object!!');
  
  console.log(event)
  console.log('Authorizer')
  
  
  
  
  if(!hasAdminGroup(event)) {
    return {
      statusCode: 401,
      body: JSON.stringify('Not authorized to perform delete'),
    }
  }

  if (event.queryStringParameters && 'id' in event.queryStringParameters) {
    const productId = event.queryStringParameters['id']
    console.log(productId)
    console.log('Product ID');
    console.log(process.env.TABLE_NAME)
    console.log('Table name')
    
    
    
    
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
