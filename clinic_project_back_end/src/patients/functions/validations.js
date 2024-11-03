
function validateNumber(phoneNumber) {
    const isPhoneNumberValid = phoneNumber && phoneNumber.length >= 11 && /^[0-9]+$/.test(phoneNumber);

    if (!isPhoneNumberValid) {
        throw new Error("Invalid phone number. It should contain at least 9 digits.");
    
    }
}

export { validateNumber };
