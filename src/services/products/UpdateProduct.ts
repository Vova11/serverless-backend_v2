import { log } from 'console'
import {
  DynamoDBClient,
  GetItemCommand,
  ScanCommand,
  UpdateItemCommand,
} from '@aws-sdk/client-dynamodb'
import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda'
import { marshall, unmarshall } from '@aws-sdk/util-dynamodb'
import { UpdateCommand } from '@aws-sdk/lib-dynamodb'

export const update = async (tableName, Item, pk, ddbClient) => {
  console.log(Item)
  console.log(tableName)
  console.log(pk)
  console.log(ddbClient)
  let updateExpression = 'set'
  let ExpressionAttributeNames = {}
  let ExpressionAttributeValues = {}
  for (const property in Item) {
    updateExpression += ` #${property} = :${property} ,`
    ExpressionAttributeNames['#' + property] = property
    ExpressionAttributeValues[':' + property] = Item[property]
  }

  console.log(ExpressionAttributeNames)

  updateExpression = updateExpression.slice(0, -1)

  const params = {
    TableName: tableName,
    Key: {
      id: pk,
    },
    UpdateExpression: updateExpression,
    ExpressionAttributeNames: ExpressionAttributeNames,
    ExpressionAttributeValues: ExpressionAttributeValues,
    // Add a ConditionExpression to ensure the item exists before updating
    ConditionExpression: 'attribute_exists(id)', // Assuming 'id' is your primary key
  }

  const result = await ddbClient.send(new UpdateCommand(params))

  return result
}

export async function updateProduct(
  event: APIGatewayProxyEvent,
  ddbClient: DynamoDBClient
): Promise<APIGatewayProxyResult> {
  if (!event.body) {
    return {
      statusCode: 400,
      body: 'invalid request, you are missing the parameter body',
    }
  }

  const editedItemId = event.queryStringParameters['id']

  if (!editedItemId) {
    return {
      statusCode: 400,
      body: 'invalid request, you are missing the path parameter id',
    }
  }

  try {
    const itemToUpdate =
      typeof event.body === 'object' ? event.body : JSON.parse(event.body)

    const result = await update(
      process.env.TABLE_NAME,
      itemToUpdate,
      editedItemId,
      ddbClient
    )
    console.log(result);
    console.log('result')
    return {
      statusCode: 200,
      body: JSON.stringify({ msg: 'Item updated successfully' }),
    }
  } catch (error) {
    // Handle the case where the item does not exist
    if (error.name === 'ConditionalCheckFailedException') {
      // Item with the provided primary key does not exist
      console.error('Item does not exist:', error.message)
      return {
        statusCode: 404,
        body: JSON.stringify({ error: error.name }),
      }
      // Handle accordingly, such as returning an error or performing some other action
    } 
    return {
      statusCode: 500,
      body: JSON.stringify({ error: error.name }),
    }
  }
}

// import { log } from 'console'
// import {
//   DynamoDBClient,
//   GetItemCommand,
//   ScanCommand,
//   UpdateItemCommand,
// } from '@aws-sdk/client-dynamodb'
// import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda'
// import { marshall, unmarshall } from '@aws-sdk/util-dynamodb'

// export async function updateProduct(
//   event: APIGatewayProxyEvent,
//   ddbClient: DynamoDBClient
// ): Promise<APIGatewayProxyResult> {

//   if (!event.body) {
//     return {
//       statusCode: 400,
//       body: 'invalid request, you are missing the parameter body',
//     }
//   }
//   //stackoverflow.com/questions/41915438/node-js-aws-dynamodb-updateitem
//   //dev.to/dvddpl/dynamodb-dynamic-method-to-insert-or-edit-an-item-5fnh

//   const editedItemId = event.queryStringParameters['id']

//   if (!editedItemId) {
//     return {
//       statusCode: 400,
//       body: 'invalid request, you are missing the path parameter id',
//     }
//   }
//   const editedItem: any =
//     typeof event.body == 'object' ? event.body : JSON.parse(event.body)
//   let updateExpression = 'set'
//   let ExpressionAttributeNames = {}
//   let ExpressionAttributeValues = {}
//   for (const property in editedItem) {
//     updateExpression += ` #${property} = :${property} ,`
//     ExpressionAttributeNames['#' + property] = property
//     ExpressionAttributeValues[':' + property] = editedItem[property]
//   }

//   console.log(ExpressionAttributeNames)
//   console.log('eccc');
//    updateExpression = updateExpression.slice(0, -1)

//    const params = {
//      TableName: process.env.TABLE_NAME,
//      Key: {
//        id: { S: editedItemId },
//      },
//      UpdateExpression: updateExpression,
//      ExpressionAttributeNames: ExpressionAttributeNames,
//      ExpressionAttributeValues: ExpressionAttributeValues,
//    }

//     const result = await ddbClient.send(new UpdateItemCommand(params))
//    console.log(result);
//    console.log('result')
//    return {
//     statusCode: 200,
//     body: JSON.stringify({msg: 'ok'})
//    }
// }
