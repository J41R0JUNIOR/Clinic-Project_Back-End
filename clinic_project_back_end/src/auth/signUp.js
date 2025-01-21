import middy from "@middy/core";
import httpHeaderNormalizer from "@middy/http-header-normalizer";
import httpContentNegotiation from "@middy/http-content-negotiation";
import httpResponseSerializer from "@middy/http-response-serializer";
import httpErrorHandler from "@middy/http-error-handler";
import httpJsonBodyParser from "@middy/http-json-body-parser";
import {
    SignUpCommand,
    ConfirmSignUpCommand,
    ResendConfirmationCodeCommand,
    CognitoIdentityProviderClient,
} from "@aws-sdk/client-cognito-identity-provider";

// Utility to create Cognito client
const createCognitoClient = () => new CognitoIdentityProviderClient({});

// Middleware configuration
const commonMiddlewares = () => [
    httpHeaderNormalizer(),
    httpContentNegotiation(),
    httpResponseSerializer({
        serializers: [
            { regex: /^application\/xml$/, serializer: ({ body }) => `<message>${body}</message>` },
            { regex: /^application\/json$/, serializer: ({ body }) => JSON.stringify(body) },
            { regex: /^text\/plain$/, serializer: ({ body }) => body },
        ],
        defaultContentType: "application/json",
    }),
    httpErrorHandler(),
    httpJsonBodyParser({ disableContentTypeError: true }),
];

// Sign-Up Request Handler
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
            body: "Sign Up successful.",
        };
    } catch (error) {
        return {
            statusCode: 500,
            body: JSON.stringify({ message: error.message, error }),
        };
    }
};

// Sign-Up Logic
const signUp = async ({ clientId, username, password, email }) => {
    const client = createCognitoClient();
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

// Confirm Sign-Up Request Handler
const confirmSignUpRequest = async (event) => {
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
            body: "User confirmed successfully.",
        };
    } catch (error) {
        return {
            statusCode: 500,
            body: JSON.stringify({ message: error.message, error }),
        };
    }
};

// Confirm Sign-Up Logic
const confirmSignUp = async ({ clientId, username, code }) => {
    const client = createCognitoClient();
    const command = new ConfirmSignUpCommand({
        ClientId: clientId,
        Username: username,
        ConfirmationCode: code,
    });

    return client.send(command);
};

// Resend Confirmation Code Request Handler
const resendConfirmationCodeRequest = async (event) => {
    const { clientId, username } = event.body;

    if (!clientId || !username) {
        return {
            statusCode: 400,
            body: "Missing required fields: clientId, username.",
        };
    }

    try {
        await resendConfirmationCode({ clientId, username });
        return {
            statusCode: 200,
            body: "Confirmation code resent successfully.",
        };
    } catch (error) {
        return {
            statusCode: 500,
            body: JSON.stringify({ message: error.message, error }),
        };
    }
};

// Resend Confirmation Code Logic
const resendConfirmationCode = async ({ clientId, username }) => {
    const client = createCognitoClient();
    const command = new ResendConfirmationCodeCommand({
        ClientId: clientId,
        Username: username,
    });

    return client.send(command);
};

export const signUpHandler = middy(signUpRequest).use(commonMiddlewares());
export const confirmSignUpHandler = middy(confirmSignUpRequest).use(commonMiddlewares());
export const resendConfirmationCodeHandler = middy(resendConfirmationCodeRequest).use(commonMiddlewares());
