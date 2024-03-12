import {
  APIGatewayProxyEvent,
  APIGatewayProxyResult,
  Context,
} from 'aws-lambda'
import { v4 } from 'uuid'

import { S3Client, ListBucketsCommand } from '@aws-sdk/client-s3'

//initialize client outside of the handler
const s3Client = new S3Client({})

async function handler(event: APIGatewayProxyEvent, context: Context) {
  const command = new ListBucketsCommand({})
  const listBucketsResult = (await s3Client.send(command)).Buckets
  console.log('Tu si');
  
  const response: APIGatewayProxyResult = {
    statusCode: 200,
    body: JSON.stringify(
      'Hello from lambda, here are your buckets:' +
        JSON.stringify(listBucketsResult, null, 2)
    ),
  }

  return response
}

export { handler }
