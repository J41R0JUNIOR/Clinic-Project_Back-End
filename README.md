# App-Crud-Login-Back-End

This repository contains the back-end of a clinic application, implemented with RESTful APIs to manage patients, doctors, and appointments. It uses JavaScript, AWS Lambda, DynamoDB, and API Gateway.

## Project Structure

- **Handlers**: Logic for the endpoints.
- **Models**: Data models for DynamoDB.
- **utils**: Utility functions.
- **serverless.yml**: Configuration for the Serverless Framework.

## Setup

### Prerequisites

- **Node.js**
- **Serverless Framework**

### Installation

1. Clone the project:
   ```bash
   git clone https://github.com/J41R0JUNIOR/Clinic-Project_Back-End.git
   cd App-Crud-Login-Back-End
   ```
2. Install the dependencies:
   ```bash
   npm install
   ```

## APIs

### Endpoints

1. **Create Patient**: `POST /patients` - Creates a patient.
2. **List Patients**: `GET /patients/allPatients` - Lists all patients.
3. **Get Patient**: `GET /patient/{id}` - Retrieves patient by ID.
4. **Update Patient**: `PATCH /patients/{id}` - Updates patient data.
5. **Delete Patient**: `DELETE /patients/{id}` - Removes a patient.

## Deployment

To deploy the project, use:

```bash
serverless deploy
```

## Contributions

Contributions are welcome! Feel free to open issues or submit pull requests.
