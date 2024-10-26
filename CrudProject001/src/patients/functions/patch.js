import middy from "@middy/core";
import httpErrorHandler from "@middy/http-error-handler";
import httpJsonBodyParser from "@middy/http-json-body-parser";
import httpHeaderNormalizer from "@middy/http-header-normalizer";
import httpContentNegotiation from "@middy/http-content-negotiation";
import httpResponseSerializer from "@middy/http-response-serializer";
import PatientsService from "../patients.service.js";

const patchPatient = async (event) => {
    const { id } = event.pathParameters;
    const patient = await PatientsService.updatePatient(id, event.body);

    return {
        statusCode: 200,
        body: patient,
    };
}

export const handler = middy()
    .use(httpHeaderNormalizer())
    .use(httpContentNegotiation())
    .use(
        httpResponseSerializer({
            serializers: [
                {
                    regex: /^application\/xml$/,
                    serializer: ({ body }) => `<message>${body}</message>`,
                },
                {
                    regex: /^application\/json$/,
                    serializer: ({ body }) => JSON.stringify(body),
                },
                {
                    regex: /^text\/plain$/,
                    serializer: ({ body }) => body,
                },
            ],
            defaultContentType: "application/json",
        })
    )
    .use(httpErrorHandler())
    .use(httpJsonBodyParser({ disableContentTypeError: true }))
    .handler(patchPatient);