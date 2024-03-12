import { handler } from '../src/services/products/handler'

//hello lambda
// handler({} as any, {} as any)


// GET ALL 
// handler({
//   httpMethod: 'GET',
// } as any)

//GET ONE
// handler({
//   httpMethod: 'GET',
//   queryStringParameters: {
//       id: 'b7d44b43-5ecc-4f9f-88e1-844994c8a829',
//   }} as any)


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

//POST
// handler({
//   httpMethod: 'POST', 
//   body: JSON.stringify({
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
//   } as any,
//   {} as any
// )