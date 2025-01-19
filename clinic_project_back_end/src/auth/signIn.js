import middy from "@middy/core";
import httpHeaderNormalizer from "@middy/http-header-normalizer";
import httpContentNegotiation from "@middy/http-content-negotiation";
import httpResponseSerializer from "@middy/http-response-serializer";
import httpErrorHandler from "@middy/http-error-handler";
import httpJsonBodyParser from "@middy/http-json-body-parser";
import {
    CognitoIdentityProviderClient,
    InitiateAuthCommand,
} from "@aws-sdk/client-cognito-identity-provider";

const sighInRequest = async (event) => {
    const { clientId, username, password } = event.body;

    if (!clientId || !username || !password) {
        return {
            statusCode: 400,
            body: "Missing required fields: clientId, username, password.",
        };
    }

    try {
        const response = await sighIn({ clientId, username, password });

        return {
            statusCode: 200,
            body: {
                message: "User signed in successfully",
                accessToken: response.AuthenticationResult.AccessToken,
                refreshToken: response.AuthenticationResult.RefreshToken,
                idToken: response.AuthenticationResult.IdToken,
            },
        };
    } catch (error) {
        return {
            statusCode: 500,
            body: JSON.stringify({ message: error.message, error }),
        };
    }
};

const sighIn = async ({ clientId, username, password }) => {
    const client = new CognitoIdentityProviderClient({});

    const command = new InitiateAuthCommand({
        AuthFlow: "USER_PASSWORD_AUTH",
        ClientId: clientId,
        AuthParameters: {
            USERNAME: username,
            PASSWORD: password,
        },
    });

    try {
        return await client.send(command);
    } catch (error) {
        throw error;
    }
};

export const handler = middy(sighInRequest)
    .use(httpHeaderNormalizer())
    .use(httpContentNegotiation())
    .use(httpResponseSerializer({
        serializers: [
            { regex: /^application\/xml$/, serializer: ({ body }) => `<message>${body}</message>` },
            { regex: /^application\/json$/, serializer: ({ body }) => JSON.stringify(body) },
            { regex: /^text\/plain$/, serializer: ({ body }) => body },
        ],
        defaultContentType: "application/json",
    }))
    .use(httpErrorHandler())
    .use(httpJsonBodyParser({ disableContentTypeError: true }));
