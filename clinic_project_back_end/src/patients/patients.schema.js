import dynamoose from "dynamoose";

export const PatientSchema = new dynamoose.Schema(
    {
        PK: {
            type: String,
            hashKey: true,
        },

        doctor: {
            type: Object,
            schema: {
                name: String,
                id: String,
            }
        },

        id: String,

        taxId: String,

        healthServiceNumber: String,

        birthDate: String,

        name: {
            type: String,
            required: true,
        },

        weight: {
            type: Number,
            required: false,

        },

        height: { 
            type: Number,
            required: false,
        },

        bloodType: String,

        address: {
            type: Object,
            schema: {
                street: String,
                city: String,
                state: String,
                country: String,
                postalCode: String,
            },
        },

        phoneNumber: String
    },
    
    {
        timestamps: true,
        saveUnknown: true
    }
);