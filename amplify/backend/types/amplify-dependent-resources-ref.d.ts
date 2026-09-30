export type AmplifyDependentResourcesAttributes = {
  "api": {
    "spotifyApi": {
      "ApiId": "string",
      "ApiName": "string",
      "RootUrl": "string"
    },
    "spotifyTokens": {
      "GraphQLAPIEndpointOutput": "string",
      "GraphQLAPIIdOutput": "string"
    }
  },
  "auth": {
    "myapp38de81b0": {
      "AppClientID": "string",
      "AppClientIDWeb": "string",
      "IdentityPoolId": "string",
      "IdentityPoolName": "string",
      "UserPoolArn": "string",
      "UserPoolId": "string",
      "UserPoolName": "string"
    }
  },
  "function": {
    "spotifyAuth": {
      "Arn": "string",
      "LambdaExecutionRole": "string",
      "LambdaExecutionRoleArn": "string",
      "Name": "string",
      "Region": "string"
    }
  }
}