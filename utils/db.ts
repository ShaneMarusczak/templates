import {
  MongoClient,
  ObjectId,
} from "https://deno.land/x/mongo@v0.30.1/mod.ts";
import { config } from "https://deno.land/x/dotenv@v3.2.0/mod.ts";

const CONSTRING = "mongodb+srv://templateuser:" + config().DBPWD +
  "@templatecluster.opiv0.mongodb.net/?retryWrites=true&w=majority&authMechanism=SCRAM-SHA-1";

const client = new MongoClient();

interface TemplateSchema {
  _id: ObjectId;
  name: string;
  value: string;
  argCount: number;
}

export async function getTemplate(schema: Record<string, unknown>) {
  await client.connect(
    CONSTRING,
  );
  const db = client.database("Template");

  const templates = db.collection<TemplateSchema>("Template");

  return await templates.findOne(schema);
}

export async function insertTemplate(
  name: string,
  value: string,
  argCount: number,
) {
  await client.connect(
    CONSTRING,
  );
  const db = client.database("Template");

  const templates = db.collection<TemplateSchema>("Template");

  return await templates.insertOne({ name, value, argCount });
}

export async function deleteTemplate(name: string) {
  await client.connect(
    CONSTRING,
  );
  const db = client.database("Template");

  const templates = db.collection<TemplateSchema>("Template");

  return await templates.deleteOne({ name });
}
