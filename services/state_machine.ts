import { deleteTemplate, getTemplate, insertTemplate } from "../utils/db.ts";
import { getArgCount, stringFormat } from "../utils/string_utils.ts";

export interface UIState {
  query: string;
  value: string;
  rawTemplate: string;
}

export default async function getNextState(url: URL): Promise<UIState> {
  const templateName = getParam(url, "templateName");
  const templateArgString = getParam(url, "templateArgString");
  const newbox = getParam(url, "newbox");
  const deletebox = getParam(url, "deletebox");
  const newtemplateBody = getParam(url, "newtemplateBody");

  if (newbox === "on" && deletebox === "on") {
    return makeState(templateName, "Error, choose just new or delete.", "");
  }

  if (templateName === "") {
    return makeState("", "Please enter a template name.", "");
  }

  if (deletebox === "on" && templateName !== "") {
    await deleteTemplate(templateName);
    return makeState("", "Deleted!", "");
  }

  if (newbox === "on" && templateName !== "") {
    if (newtemplateBody === "") {
      return makeState(templateName, "No template body provided!", "");
    }
    await insertTemplate(
      templateName,
      newtemplateBody,
      getArgCount(newtemplateBody),
    );
    return makeState(templateName, "Added!", "");
  }

  const template = await getTemplate({ name: templateName });

  if (typeof template === "undefined" || template === null) {
    return makeState("", "Not Found!", "");
  }

  const templateArgs: string[] = templateArgString.split(",").filter(Boolean)
    .map((a) => a.trim());

  if (template.argCount != templateArgs.length) {
    const error = stringFormat(
      "Expected {0} args, got {1}.",
      String(template.argCount),
      String(templateArgs.length),
    );
    return makeState(templateName, error, template.value);
  }

  const value = stringFormat(template.value, ...templateArgs);

  return makeState(templateName, value, "");
}

function getParam(url: URL, name: string): string {
  return url.searchParams.get(name) || "";
}

function makeState(
  query: string,
  value: string,
  rawTemplate: string,
): UIState {
  return { query, value, rawTemplate };
}
