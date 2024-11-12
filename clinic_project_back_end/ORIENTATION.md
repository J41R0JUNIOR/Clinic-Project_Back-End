Projeto: Sistema de Gerenciamento de Dados de Saúde Sensíveis
Descrição: Desenvolva um sistema seguro para gerenciar dados de saúde sensíveis, como registros médicos de pacientes, garantindo que apenas usuários autenticados e autorizados possam acessar ou modificar esses dados. A segurança dos dados e a conformidade com regulamentações como HIPAA (Health Insurance Portability and Accountability Act) são de alta prioridade.

Autenticação e Autorização:
* Amazon Cognito: Para gerenciar o registro, login e autenticação dos usuários.
    * Cognito pode ser configurado com pools de usuários e grupos para definir diferentes níveis de acesso (e.g., Médico, Administrador, Enfermeiro).
* Integração com AWS Lambda: Após o login, um token JWT gerado pelo Cognito é usado para autorizar o acesso às APIs seguras.
API Serverless (Backend):
* AWS Lambda: Para gerenciar a lógica de negócios e o acesso a dados sensíveis.
    * As funções Lambda são protegidas por autenticação JWT e só podem ser acessadas por usuários autenticados.
    * Cada função Lambda valida as permissões do usuário (com base no grupo Cognito) antes de permitir qualquer operação (leitura/escrita) nos dados de saúde.
* Amazon API Gateway: Para expor as funções Lambda como endpoints RESTful protegidos.
Banco de Dados:
* Amazon DynamoDB: Para armazenar os dados sensíveis dos pacientes, como registros médicos.
    * Cada item na tabela pode representar um registro médico com campos como PatientId, DoctorId, HealthData, Timestamp, etc.
    * Os dados sensíveis, como informações de saúde, podem ser criptografados antes de serem armazenados para maior segurança.