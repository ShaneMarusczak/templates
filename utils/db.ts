import { MongoClient } from "https://deno.land/x/atlas_sdk@v0.3.0/mod.ts";

import "https://deno.land/x/dotenv@v3.2.0/load.ts";
import { token } from "../services/tokenizer.ts";

const client = new MongoClient({
  endpoint: "https://data.mongodb-api.com/app/data-mejuo/endpoint/data/v1",
  dataSource: "TemplateCluster",
  auth: {
    apiKey: Deno.env.get("APIKEY") || "",
  },
});

interface TemplateSchema {
  name: string;
  value: string;
  argCount: number;
  tokens: token[];
}

export async function getTemplate(name: string) {
  const db = client.database("Template");

  const templates = db.collection<TemplateSchema>("Template");

  return await templates.findOne({ name });
}

export async function checkExists(name: string) {
  const db = client.database("Template");

  const templates = db.collection<TemplateSchema>("Template");

  return await templates.countDocuments({ name }, { limit: 1 });
}

export async function insertTemplate(
  name: string,
  value: string,
  argCount: number,
  tokens: token[],
) {
  const db = client.database("Template");

  const templates = db.collection<TemplateSchema>("Template");

  return await templates.insertOne({ name, value, argCount, tokens });
}

export async function deleteTemplate(name: string) {
  const db = client.database("Template");

  const templates = db.collection<TemplateSchema>("Template");

  return await templates.deleteOne({ name });
}

export async function updateTemplate(
  name: string,
  value: string,
  argCount: number,
  tokens: token[],
) {
  const db = client.database("Template");

  const templates = db.collection<TemplateSchema>("Template");

  return await templates.replaceOne(
    { name },
    { name, value, argCount, tokens },
    {
      upsert: false,
    },
  );
}
