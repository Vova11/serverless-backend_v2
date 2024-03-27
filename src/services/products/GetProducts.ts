import {
  DynamoDBClient,
  GetItemCommand,
  QueryCommand,
  ScanCommand,
} from '@aws-sdk/client-dynamodb'
import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda'
import { unmarshall } from '@aws-sdk/util-dynamodb'

export async function getProducts(
  event: APIGatewayProxyEvent,
  ddbClient: DynamoDBClient
): Promise<APIGatewayProxyResult> {
  console.log('Calling getProducts!!!')
  console.log(event)

  if (event.queryStringParameters) {
    if ('id' in event.queryStringParameters) {
      const productId = event.queryStringParameters['id']
      console.log('Tu si');
      console.log(productId)
      
      const getProductResponse = await ddbClient.send(
        new GetItemCommand({
          TableName: process.env.TABLE_NAME!,
          Key: {
            id: { S: productId },
          },
        })
      )
      if (getProductResponse.Item) {
        const unmarshalledProduct = unmarshall(getProductResponse.Item)
        console.log(unmarshalledProduct)
        
        return {
          statusCode: 200,
          body: JSON.stringify(unmarshalledProduct),
        }
      } else {
        return {
          statusCode: 404,
          body: JSON.stringify(`ProductId not found ${productId}`),
        }
      }
    } else if ('featured' in event.queryStringParameters) {
      const isFeatured = event.queryStringParameters['featured']
      console.log('isFeatured' + isFeatured)

      try {
        // Perform the DynamoDB query
        const queryResponse = await ddbClient.send(
          new QueryCommand({
            TableName: process.env.TABLE_NAME,
            IndexName: 'FeaturedIndex',
            KeyConditionExpression: 'featured = :isFeatured',
            ExpressionAttributeValues: {
              ':isFeatured': { N: isFeatured },
            },
          })
        )

        // Process the query result
        const items = queryResponse.Items?.map((item) => unmarshall(item))
        console.log(items)

        return {
          statusCode: 200,
          body: JSON.stringify(items),
        }
      } catch (error) {
        console.error('Error querying DynamoDB:', error)
        return {
          statusCode: 500,
          body: JSON.stringify('Internal Server Error'),
        }
      }
    } else if ('priceInCategoryAndStock' in event.queryStringParameters) {
      console.log('tu si priceInCategoryAndStock')
      
      const queryParams = event.queryStringParameters
      const productCategory = queryParams['productCategory']
      const lowPrice = queryParams['lowPrice']
      const highPrice = queryParams['highPrice']
      const inStock = queryParams['inStock']

      try {
        // Perform the DynamoDB query
        const queryResponse = await ddbClient.send(
          new QueryCommand({
            TableName: process.env.TABLE_NAME,
            IndexName: 'ProductCategoryPriceIndex',
            KeyConditionExpression:
              'ProductCategory = :pc AND Price BETWEEN :low AND :high',
            FilterExpression: 'stock = :stock',
            ExpressionAttributeValues: {
              ':pc': { S: productCategory },
              ':low': { N: lowPrice },
              ':high': { N: highPrice },
              ':stock': { N: inStock },
            },
          })
        )

        // Process the query result
        const items = queryResponse.Items?.map((item) => unmarshall(item))
        console.log(items)

        return {
          statusCode: 200,
          body: JSON.stringify(items),
        }
      } catch (error) {
        console.error('Error querying DynamoDB:', error)
        return {
          statusCode: 500,
          body: JSON.stringify('Internal Server Error'),
        }
      }
    } else {
      return {
        statusCode: 401,
        body: JSON.stringify('ID is required'),
      }
    }
  }
  console.log('Get back all products with title and price only');
  const result = await ddbClient.send(
    new ScanCommand({
      TableName: process.env.TABLE_NAME!,
      ProjectionExpression: 'id, title, price, photoUrl', // Specify the attributes you want to retrieve
    })
  )
  
  const unmarshalledProducts = result.Items?.map((product) =>
    unmarshall(product)
  )
  
  return {
    statusCode: 201,
    body: JSON.stringify(unmarshalledProducts),
  }
}
