import middy from "@middy/core";
import httpErrorHandler from "@middy/http-error-handler";
import httpJsonBodyParser from "@middy/http-json-body-parser";
import httpHeaderNormalizer from "@middy/http-header-normalizer";
import httpContentNegotiation from "@middy/http-content-negotiation";
import httpResponseSerializer from "@middy/http-response-serializer";
import PatientsService from "../patients.service.js";
import { validateNumber } from "./validations.js";

const create = async (event) => {
    const patientData = event.body;

    validateNumber(patientData.phoneNumber);

    const patient = await PatientsService.createPatient(patientData);
    patient.PK = undefined;

    await PatientsService.notifyPatientCreated(patient);

    return {
        statusCode: 201,
        body: patient,
    };
};

export const handler = middy(create)
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
    .use(httpJsonBodyParser({ disableContentTypeError: true }));
