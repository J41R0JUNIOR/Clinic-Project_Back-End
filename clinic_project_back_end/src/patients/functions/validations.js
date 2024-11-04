import createError from "http-errors";

function createValidations(patientData) {
   numberVerification(patientData.phoneNumber)
   nameVerification(patientData.name)
}

function numberVerification(phoneNumber) {
    if (!phoneNumber) {
        return;
    }

    const isPhoneNumberValid = phoneNumber.length === 11 && /^[0-9]+$/.test(phoneNumber);

    if (!isPhoneNumberValid) {
        throw new createError.BadRequest("Invalid phone number. It should contain exactly 11 digits.");
    }
}

function nameVerification(name) {
    if (!name) {
        throw new createError.BadRequest("Name is required.");
    }

    if (name.length > 100) {
        throw new createError.BadRequest("Name should not exceed 100 characters.");
    }

    const hasSpecialCharacters = /[^a-zA-Z ]/.test(name);

    if (hasSpecialCharacters) {
        throw new createError.BadRequest("Name should not contain special characters.");
    }
}

export { createValidations };
