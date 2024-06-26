# Express Lambda Function with CRUD Operations

This project implements a serverless Express application running on AWS Lambda, utilizing MongoDB for data storage. It provides CRUD (Create, Read, Update, Delete) operations for a Post model.

## Getting Started

### Prerequisites

- Node.js and npm installed locally
- MongoDB instance (local or remote)
- AWS CLI configured with appropriate permissions

### Installation

Clone the repository:

```bash
git clone <https://github.com/MajlindaJaha/attributy_task_api.git>
```

Install dependencies:

```bash
npm install
```

### Set up environment variables:

Create an .env file in the root of your project based on .env.example

MONGO_URL=mongodb://<username>:<password>@<hostname>:<port>/<database>
PORT=3000

### Build and Run project:

Build the project:

```bash
npm run build
```

Run the project localy:

```bash
npm run start:dev
```

Once the server is running locally, you can access the API endpoints using the following base URL:

http://localhost:3000/dev/api/posts
