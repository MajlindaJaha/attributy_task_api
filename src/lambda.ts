import {
  APIGatewayProxyEvent,
  APIGatewayProxyResult,
  Context,
} from "aws-lambda";
import express, { Express, Request, Response } from "express";
import mongoose, { ConnectOptions, Mongoose } from "mongoose";
import dotenv from "dotenv";
import postRoutes from "./routes/post.routes";

dotenv.config();

let cachedDbConnection: Mongoose | null = null;

const connectToDatabase = async (): Promise<Mongoose> => {
  if (cachedDbConnection) {
    return cachedDbConnection;
  }

  try {
    const options: ConnectOptions = {
      serverSelectionTimeoutMS: 5000,
    };

    const db = await mongoose.connect(process.env.MONGO_URL as string, options);
    cachedDbConnection = db;
    console.log("Successfully connected to MongoDB:", db.connection.name);
    return db;
  } catch (error) {
    console.error("Error connecting to MongoDB:", error);
    throw error;
  }
};

const createApp = (): Express => {
  const app = express();

  app.use(express.json());
  app.use("/api/posts", postRoutes);

  return app;
};

let cachedApp: Express | null = null;

export const handler = async (
  event: APIGatewayProxyEvent,
  context: Context
): Promise<APIGatewayProxyResult> => {
  context.callbackWaitsForEmptyEventLoop = false;

  try {
    if (!cachedApp) {
      cachedApp = createApp();
      await connectToDatabase();
    }

    const app = cachedApp;

    return new Promise((resolve, reject) => {
      const req = createRequest(event);
      const res = createResponse(resolve);

      app(req, res);
    });
  } catch (error) {
    console.error("Lambda Handler Error:", error);

    return {
      statusCode: 500,
      body: JSON.stringify({
        message: "Internal server error",
      }),
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Headers": "Content-Type",
        "Access-Control-Allow-Methods": "GET,POST,PUT,DELETE,OPTIONS",
      },
    };
  }
};

const createRequest = (event: APIGatewayProxyEvent): Request => {
  const { httpMethod, path, headers, queryStringParameters, body } = event;

  return {
    method: httpMethod,
    url: path,
    headers: headers as any,
    query: queryStringParameters as any,
    body: body,
  } as Request;
};

const createResponse = (
  resolve: (
    value?: APIGatewayProxyResult | PromiseLike<APIGatewayProxyResult>
  ) => void
): Response => {
  const res: Partial<Response> = {
    statusCode: 200,
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Headers": "Content-Type",
      "Access-Control-Allow-Methods": "GET,POST,PUT,DELETE,OPTIONS",
    },
    status(code: number) {
      this.statusCode = code;
      return this as Response;
    },
    send(body: any) {
      resolve({
        statusCode: this.statusCode || 200,
        body: JSON.stringify(body),
        headers: this.headers,
      });
      return this as Response;
    },
    json(body: any) {
      this.send(body);
    },
    setHeader(name: string, value: string) {
      this.headers![name] = value;
      return this as Response;
    },
    end(body?: any) {
      resolve({
        statusCode: this.statusCode || 200,
        body: body ? JSON.stringify(body) : "",
        headers: this.headers,
      });
    },
    on(event: string, handler: Function) {
      if (event === "end") {
        handler();
      }
      return this as Response;
    },
  };

  return res as Response;
};
