import { ListBucketsCommand, S3Client } from '@aws-sdk/client-s3'
import { AuthService } from './AuthService'
import { getCurrentUser } from 'aws-amplify/auth'

const userLogin = {
  username: 'lenis33218@hdrlog.com',
  password: 'TestPassword123%',
}

async function testAuth() {
  const service = new AuthService()
  const user = await service.login(userLogin)
  const credentials = await service.generateTemporaryCredentials(user)
  const buckets = await listBuckets(credentials)
  console.log(buckets);
  
  // const token = await service.getTokens() // Obtain the token from the method
  // console.log('accessToken')
  // console.log(token.accessToken.toString()) // Access the token obtained from the method
  // console.log('idToken')
  // console.log(token.idToken.toString()) // Access the token obtained from the method
}

async function listBuckets(credentials: any) {
  const client = new S3Client({
    credentials: credentials,
  })
  const command = new ListBucketsCommand({})
  const result = await client.send(command)
  return result
}

testAuth()