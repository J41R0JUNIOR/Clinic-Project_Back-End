import * as dynamoose from "dynamoose";
import { PatientSchema } from "./patients.schema.js";
import crypto from "node:crypto";
import {
    EventBridgeClient,
    PutEventsCommand,
} from "@aws-sdk/client-eventbridge";

const PatientModel = dynamoose.model("PatientTable", PatientSchema, { create: false });

async function createPatient(payload) {
    payload.id = crypto.randomUUID();
    payload.PK = `PATIENT#${payload.id}`;

    console.log("Iniciando criação no DynamoDB");
    const result = await PatientModel.create(payload);//+
    console.log("Paciente criado no DynamoDB:", result);

    result.PK = undefined;

    return {
        statusCode: 201,
        body: JSON.stringify(result),
    };
};

async function findAllPatients() {
    const result = await PatientModel.scan().exec();

    return result.map((item) => {
        item.PK = undefined;
        return item;
    });
}

async function findPatientById(id) {
    const result = await PatientModel.get({ PK: `PATIENT#${id}` });
  
    return {
        statusCode: 200,
        body: JSON.stringify(result),
    };
}

async function updatePatient(id, payload) {
    const result = await PatientModel.update({ PK: `PATIENT#${id}` }, payload);
  
    return {
        statusCode: 200,
        body: JSON.stringify(result),
    };
}

async function deletePatient(id) {
    const result = await PatientModel.delete({ PK: `PATIENT#${id}` });
  
    return {
      statusCode: 204,
      body: JSON.stringify(result),
    };
}

async function notifyPatientCreated(patient) {
    const client = new EventBridgeClient({});

    await client.send(
        new PutEventsCommand({
            Entries: [
                {
                    Source: "aula5-clinica",
                    DetailType: "PatientCreated",
                    Detail: JSON.stringify({ patient }),
                },
            ],
        })
    );
}

export default {
    createPatient,
    findAllPatients,
    notifyPatientCreated,
    findPatientById,
    deletePatient,
    updatePatient
};