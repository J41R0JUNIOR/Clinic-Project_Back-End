import middy from "@middy/core";
import httpHeaderNormalizer from "@middy/http-header-normalizer";
import httpContentNegotiation from "@middy/http-content-negotiation";
import httpResponseSerializer from "@middy/http-response-serializer";
import httpErrorHandler from "@middy/http-error-handler";
import httpJsonBodyParser from "@middy/http-json-body-parser";
import {
    SignUpCommand,
    ConfirmSignUpCommand,
    CognitoIdentityProviderClient,
} from "@aws-sdk/client-cognito-identity-provider";

const signUpRequest = async (event) => {
    const { clientId, username, password, email } = event.body;

    if (!clientId || !username || !password || !email) {
        return {
            statusCode: 400,
            body: "Missing required fields: clientId, username, password, email.",
        };
    }

    try {
        await signUp({ clientId, username, password, email });

        return {
            statusCode: 200,
            body: "Concluded Sign Up",
        };
    } catch (error) {
        return {
            statusCode: 500,
            body: JSON.stringify({ message: error.message, error }),
        };
    }
};

const signUp = async ({ clientId, username, password, email }) => {
    const client = new CognitoIdentityProviderClient({});

    const command = new SignUpCommand({
        ClientId: clientId,
        Username: username,
        Password: password,
        UserAttributes: [{ Name: "email", Value: email }],
    });

    try {
        return await client.send(command);
    } catch (error) {
        if (error.name === "UsernameExistsException") {
            throw new Error("Username already exists.");
        }
        throw error;
    }
};

const confirmSighUpRequest = async (event) => {
    const { clientId, username, code } = event.body;

    if (!clientId || !username || !code) {
        return {
            statusCode: 400,
            body: "Missing required fields: clientId, username, code.",
        };
    }

    try {
        await confirmSignUp({ clientId, username, code });

        return {
            statusCode: 200,
            body: "User confirmed successfully",
        };
    } catch (error) {
        return {
            statusCode: 500,
            body: JSON.stringify({ message: error.message, error }),
        };
    }
}

const confirmSignUp = ({ clientId, username, code }) => {
    const client = new CognitoIdentityProviderClient({});

    const command = new ConfirmSignUpCommand({
        ClientId: clientId,
        Username: username,
        ConfirmationCode: code,
    });

    return client.send(command);
};



export const handler = middy(signUpRequest)
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


export const confirmationHandler = middy(confirmSighUpRequest)
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