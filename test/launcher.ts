import { Authorizer } from 'aws-cdk-lib/aws-apigateway'
import { handler } from '../src/services/products/handler'
import { AuthService } from './AuthService'

//hello lambda
// handler({} as any, {} as any)


// GET ALL 
// handler(
//   {
//     httpMethod: 'GET',
//   } as any,
//   {} as any
// )

//GET ONE
handler(
  {
    httpMethod: 'GET',
    queryStringParameters: {
      pk: 'p#95871434-eecb-4ff0-8c57-68fe6171b0ee',
    },
  } as any,
  {} as any
)


//GET FEATURED
// handler({
//   httpMethod: 'GET',
//   queryStringParameters: {
//     featured: '1',
//   },
// } as any)


// GET GSI
// 0 - is not on stock and 1 is on stock
// handler({
//   httpMethod: 'GET',
//   queryStringParameters: {
//     priceInCategoryAndStock: true,
//     productCategory: 'ProductCategoryPriceIndex',
//     lowPrice: '0',
//     highPrice: '40',
//     inStock: '1',
//   },
// } as any)

//  POST
// handler({
//   httpMethod: 'POST', 
//   body: JSON.stringify({
//     itemType: 'category', // Add itemType field
//     PK: 'cat#art', // Replace with actual category
//     name: "produkt 1",
//     category: "cat#art",
//     price: 22.02,
//     title: 'cool product',
//     description: "Description of product 6",
//     GSI_PK_featured: "yes"
// })} as any, {} as any).then(result => {
//   console.log(result);
// })


// const product = {
//   title: 'Fuck',
//   price: '4500',
// }

// //UPDATE
// handler(
//   {
//     httpMethod: 'PUT',
//     queryStringParameters: {
//       id: '39095bfb-8a74-490e-9254-68ee7d',
//     },
//     body: JSON.stringify(product),
//   } as any,
//   {} as any
// ).then((result) => {
//   console.log(result)
// })


// const idToken = 'eyJraWQiOiJSbGZYUVdZNFp1M25HR3htb3plWitabGZVUkc4QjZCZmp5WTl4dEh2amFFPSIsImFsZyI6IlJTMjU2In0.eyJzdWIiOiI0Yjg2N2NhZS03NGIwLTRkZmQtYTMzNy01MDQ3ZmY3MTEyODIiLCJjb2duaXRvOmdyb3VwcyI6WyJhZG1pbnMiXSwiZW1haWxfdmVyaWZpZWQiOnRydWUsImlzcyI6Imh0dHBzOlwvXC9jb2duaXRvLWlkcC5ldS1jZW50cmFsLTEuYW1hem9uYXdzLmNvbVwvZXUtY2VudHJhbC0xX29UMHB2QVNTRCIsImNvZ25pdG86dXNlcm5hbWUiOiI0Yjg2N2NhZS03NGIwLTRkZmQtYTMzNy01MDQ3ZmY3MTEyODIiLCJnaXZlbl9uYW1lIjoiVm92YSIsIm9yaWdpbl9qdGkiOiJhYTA4ZjkyMy1mYjNiLTQ0YzgtOTI4ZS1iNWY4MGFhYTgyZTAiLCJjb2duaXRvOnJvbGVzIjpbImFybjphd3M6aWFtOjo5Mzk2MDE2MTcwNDE6cm9sZVwvQXV0aFN0YWNrLUNvZ25pdG9BZG1pblJvbGU0QzEwRkJBNC16NnlvckthNUc3NTQiXSwiYXVkIjoiN2Y5amEzOGljMmxlbDdsdW02cGhhZWwxaWoiLCJldmVudF9pZCI6Ijg0ZjE5ZTc1LWJkY2ItNDlkNC1iZmRiLTg5YWQyNjkwM2Q0YyIsInRva2VuX3VzZSI6ImlkIiwiYXV0aF90aW1lIjoxNzEyMTU0NjI1LCJleHAiOjE3MTIxNTgyMjQsImlhdCI6MTcxMjE1NDYyNSwiZmFtaWx5X25hbWUiOiJaZW0iLCJqdGkiOiIzNzFiN2FjZi1hOWZjLTQ4ODEtYWI2My1jYmQwZGRjZmVhNTkiLCJlbWFpbCI6Im1lYmFjODEwODZAZmVsaWJnLmNvbSJ9.lA0-YoGX8XWE0sAj6zVs8DjHXIuVIG_ugfblSI2aC4fpQnlpZeghP6hZe93RasTHRlu5qQQuUCmaZ7icQkYq6lgf_-HFwMLDdLBtpxK7mwoEoiZnzRwBW8GX1DKmY_9Lxt2LikOxP-3HP2lrsBaBdRtAMeT_Y8VqDomuF9xoy6jiPkBKxWDzPCvB0v3BHNUJGYiBv-a8yUGn-byO4cQzJbzT3Yp1WxCkDiio9A9drjpoLwuxZWJtxmCZpIC8vZlwE-BT3SxWTGkRNQoVkwZRIt2Uv9CMycVLAj_q6phe-UVzztufbERf_VGcMDU0TmZcM94lFpP_KdgZNSjcPl1BDA'

// //DELETE
// handler(
//   {
//     httpMethod: 'DELETE',
//     queryStringParameters: {
//       id: '705719ce-e269-4b66-a83d-6b8ed2dfde3d',
//     },
//     headers: {
//       Authorization: idToken,
//     },
//   } as any,
//   {} as any
// )


// const user = {
//   username: 'mebac81086@felibg.com',
//   password: 'TestPassword123%',
// }

// async function testAuthAndDelete() {
//   // Instantiate AuthService
//   const service = new AuthService()

//   // Login user
//   const loginResult = await service.login(user)
//   console.log(loginResult)

//   // Obtain and log token
//   const {accessToken, idToken} = await service.getTokens()
  
//   console.log(idToken.payload['cognito:groups'])
//   console.log('idToken is');

//   console.log(accessToken.payload["cognito:groups"])
//   console.log('access Token is')
  
//   console.log(idToken.toString())
//   console.log('id token string');
  
  
//   // Call DELETE handler with authorization token
//   if (idToken) {
//     // Assuming authorizer is properly initialized and attached
//     await handler(
//       {
//         httpMethod: 'DELETE',
//         queryStringParameters: {
//           id: 'ff1c7572-30dc-416a-ae9e-ee1ff5de7227',
//         },
//         headers: {
//           Authorization: idToken.toString(), // Include authorization token in headers
//         },
//       } as any,
//       {} as any
//     )
//   } else {
//     console.error('Authorizer is not properly initialized or attached.')
//   }
  
// }

// // Call testAuthAndDelete function
// testAuthAndDelete()


