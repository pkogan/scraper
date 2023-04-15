curl --location --request POST 'https://cognito-idp.us-east-1.amazonaws.com/' --header 'X-Amz-Target: AWSCognitoIdentityProviderService.InitiateAuth' --header 'Content-Type: application/x-amz-json-1.1' --data-raw '{
    "AuthParameters": {
        "USERNAME": "agrupp306",
        "PASSWORD": "3l3cc10n3s"
    },
    "AuthFlow": "USER_PASSWORD_AUTH",
    "ClientId": "f0dapcjldcsbslvnnqhtvngjs",
    "UserPoolId": "us-east-1_xp4TpXSkw"
}'

