import { AuthService } from "./AuthService";
import { getCurrentUser } from 'aws-amplify/auth'

const user = {
  username: 'lenis33218@hdrlog.com',
  password: 'TestPassword123%',
}

async function testAuth() {
  const service = new AuthService()

  const loginResult = await service.login(user)
  console.log(loginResult)
  const token = await service.getTokens() // Obtain the token from the method
  console.log(token) // Access the token obtained from the method
}

testAuth()