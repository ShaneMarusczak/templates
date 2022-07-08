import {
  checkExists,
  deleteTemplate,
  getTemplate,
  insertTemplate,
} from "../utils/db.ts";
import { getArgCount, stringFormat } from "../utils/string_utils.ts";

export interface UIState {
  query: string;
  value: string;
  rawTemplate: string;
  copyable: boolean;
}

export default async function getNextState(url: URL): Promise<UIState> {
  const templateName = getParam(url, "templateName");
  const templateArgString = getParam(url, "templateArgString");
  const newbox = getParam(url, "newbox");
  const deletebox = getParam(url, "deletebox");
  const newtemplateBody = getParam(url, "newtemplateBody");

  if (newbox === "on" && deletebox === "on") {
    return makeState(
      templateName,
      "error, choose just new or delete",
      "",
      false,
    );
  }

  if (templateName === "") {
    return makeState("", "please enter a template name", "", false);
  }

  if (deletebox === "on" && templateName !== "") {
    await deleteTemplate(templateName);
    return makeState("", "deleted!", "", false);
  }

  if (newbox === "on" && templateName !== "") {
    if (newtemplateBody === "") {
      return makeState(templateName, "no template body provided", "", false);
    }
    if (await checkExists(templateName) === 1) {
      return makeState(templateName, "template already exists", "", false);
    }

    await insertTemplate(
      templateName,
      newtemplateBody,
      getArgCount(newtemplateBody),
    );
    return makeState(templateName, "added!", "", false);
  }

  const template = await getTemplate(templateName);

  if (typeof template === "undefined" || template === null) {
    return makeState("", "not found!", "", false);
  }

  const templateArgs: string[] = templateArgString.split(",").filter(Boolean)
    .map((a) => a.trim());

  if (template.argCount != templateArgs.length) {
    const error = stringFormat(
      "expected {0} args, got {1}",
      String(template.argCount),
      String(templateArgs.length),
    );
    return makeState(templateName, error, template.value, false);
  }

  const value = stringFormat(template.value, ...templateArgs);

  return makeState(templateName, value, "", true);
}

function getParam(url: URL, name: string): string {
  return url.searchParams.get(name) || "";
}

function makeState(
  query: string,
  value: string,
  rawTemplate: string,
  copyable: boolean,
): UIState {
  return { query, value, rawTemplate, copyable };
}
