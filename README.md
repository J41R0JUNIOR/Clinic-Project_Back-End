# App-Crud-Login-Back-End

Este repositório contém a implementação do back-end para o projeto de clínica, que fornece APIs RESTful para gerenciar pacientes, médicos e consultas. As APIs são implementadas utilizando JavaScript, AWS Lambda, DynamoDB e API Gateway.

## Estrutura do Projeto

- **Handlers**: Contém a lógica para cada endpoint da API.
- **Models**: Define os esquemas de dados utilizados no DynamoDB.
- **utils**: Funções utilitárias.
- **serverless.yml**: Configuração do Serverless Framework.

## Configuração

### Pré-requisitos

Antes de começar, você precisa ter os seguintes softwares instalados:

- [Node.js](https://nodejs.org/)
- [Serverless Framework](https://www.serverless.com/framework/docs/getting-started/)

### Instalando Dependências

1. No terminal, navegue até a pasta do projeto:
   ```bash
   cd App-Crud-Login-Back-End
   ```
2. Instale as dependências:
   ```bash
   npm install
   ```

### Variáveis de Ambiente

Certifique-se de configurar suas variáveis de ambiente necessárias no arquivo `.env`, se estiver usando variáveis para conectar ao DynamoDB ou outras configurações.

## APIs

### Endpoints

#### 1. Criar Paciente

- **URL**: `/patients`
- **Método**: `POST`
- **Descrição**: Cria um novo paciente.
- **Corpo da Requisição**:
    ```json
    {
        "id": "string",
        "taxId": "string",
        "healthServiceNumber": "string",
        "birthDate": "YYYY-MM-DD",
        "name": "string",
        "weight": number,
        "height": number,
        "bloodType": "string",
        "address": {
            "street": "string",
            "city": "string",
            "state": "string",
            "country": "string",
            "postalCode": "string"
        },
        "phoneNumber": "string"
    }
    ```
- **Resposta**:
    - **Código 201**: Criado.
    - **Corpo**:
    ```json
    {
        "message": "Paciente criado com sucesso.",
        "patient": { ... }
    }
    ```

#### 2. Obter Todos os Pacientes

- **URL**: `/patients/allPatients`
- **Método**: `GET`
- **Descrição**: Recupera todos os pacientes.
- **Resposta**:
    - **Código 200**: Sucesso.
    - **Corpo**:
    ```json
    [
        {
            "id": "string",
            "taxId": "string",
            "healthServiceNumber": "string",
            "birthDate": "YYYY-MM-DD",
            "name": "string",
            "weight": number,
            "height": number,
            "bloodType": "string",
            "address": { ... },
            "phoneNumber": "string"
        },
        ...
    ]
    ```

#### 3. Obter Paciente por ID

- **URL**: `/patient/{id}`
- **Método**: `GET`
- **Descrição**: Recupera um paciente específico pelo ID.
- **Resposta**:
    - **Código 200**: Sucesso.
    - **Código 404**: Não encontrado.
    - **Corpo**:
    ```json
    {
        "id": "string",
        "taxId": "string",
        "healthServiceNumber": "string",
        "birthDate": "YYYY-MM-DD",
        "name": "string",
        "weight": number,
        "height": number,
        "bloodType": "string",
        "address": { ... },
        "phoneNumber": "string"
    }
    ```

#### 4. Atualizar Paciente

- **URL**: `/patients/{id}`
- **Método**: `PUT`
- **Descrição**: Atualiza as informações de um paciente.
- **Corpo da Requisição**: O mesmo formato do corpo de criação.
- **Resposta**:
    - **Código 200**: Atualizado.
    - **Corpo**:
    ```json
    {
        "message": "Paciente atualizado com sucesso.",
        "patient": { ... }
    }
    ```

#### 5. Deletar Paciente

- **URL**: `/patients/{id}`
- **Método**: `DELETE`
- **Descrição**: Deleta um paciente.
- **Resposta**:
    - **Código 200**: Deletado.
    - **Corpo**:
    ```json
    {
        "message": "Paciente deletado com sucesso."
    }
    ```

## Implantação

Para implantar o projeto, utilize o seguinte comando:

```bash
serverless deploy
```

## Contribuições

Contribuições são bem-vindas! Sinta-se à vontade para abrir issues ou enviar pull requests.

---

### Dicas Adicionais

- **Testes**: Considere incluir testes para suas funções de manipulação de dados e endpoints.
- **Documentação de Testes**: Adicione informações sobre como testar as APIs usando ferramentas como Postman ou Insomnia.
- **Manutenção**: Mantenha a documentação atualizada conforme você adiciona novas funcionalidades ou altera a estrutura existente.
