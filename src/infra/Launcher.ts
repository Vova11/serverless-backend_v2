import { App } from 'aws-cdk-lib'
import { LambdaStack } from '../infra/stacks/LambdaStack'
import { ApiStack } from './stacks/ApiStack'
import { DataStack } from './stacks/DataStack'

const app = new App()
const dataStack = new DataStack(app, 'DataStack')
const lambdaStack = new LambdaStack(app, 'LambdaStack', {
  productsTable: dataStack.productsTable,
})
new ApiStack(app, 'ApiStack', {
  helloLambdaIntegration: lambdaStack.helloLambdaIntegration,
  productsLambdaIntegration: lambdaStack.productsLambdaIntegration
})
