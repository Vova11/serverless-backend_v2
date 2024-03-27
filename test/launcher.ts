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
      id: 'c88ae9b3-b7d6-46d6-aef1-924f7a5445b0',
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
//     title: 'Product 9',
//     description: "Description of product 6",
//     price: "8.9",
//     featured: "1"
// })} as any, {} as any).then(result => {
//   console.log(result);
// })


//UPDATE
// handler(
//   {
//     httpMethod: 'PUT',
//     queryStringParameters: {
//       id: 'b7d44b43-5ecc-4f9f-88e1-844994c8a829',
//     },
//     body: JSON.stringify({
//       price: '11.01'
//     })
//   } as any
  
// )


//DELETE
// handler(
//   {
//     httpMethod: 'DELETE',
//     queryStringParameters: {
//       id: 'b7d44b43-5ecc-4f9f-88e1-844994c8a829',
//     },
//     headers: {
//       Authorization:
//         ['admins'],
//     },
//   } as any,
//   {} as any
// )


// const user = {
//   username: 'didosa4003@storesr.com',
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
  
//   console.log(idToken)
//   console.log('token is');
  
  
//   // Call DELETE handler with authorization token
//   if (idToken) {
//     // Assuming authorizer is properly initialized and attached
//     await handler(
//       {
//         httpMethod: 'DELETE',
//         queryStringParameters: {
//           id: 'c88ae9b3-b7d6-46d6-aef1-924f7a5445b0',
//         },
//         headers: {
//           Authorization: idToken, // Include authorization token in headers
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


