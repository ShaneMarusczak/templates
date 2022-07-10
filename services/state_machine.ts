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
  currentCode: string;
}

export default async function getNextState(url: URL): Promise<UIState> {
  const templateName = getParam(url, "templateName");
  const templateArgString = getParam(url, "templateArgString");
  const newbox = getParam(url, "newbox");
  const deletebox = getParam(url, "deletebox");
  const newtemplateBody = getParam(url, "newtemplateBody");
  const secretCode = getParam(url, "secretCode");

  if (secretCode !== Deno.env.get("SECRET_CODE")) {
    return makeState("", "forbidden", "", false, "");
  }

  if (newbox === "on" && deletebox === "on") {
    return makeState(
      templateName,
      "error, choose just new or delete",
      "",
      false,
      secretCode,
    );
  }

  if (templateName === "") {
    return makeState("", "please enter a template name", "", false, secretCode);
  }

  if (deletebox === "on" && templateName !== "") {
    await deleteTemplate(templateName);
    return makeState("", "deleted!", "", false, secretCode);
  }

  if (newbox === "on" && templateName !== "") {
    if (newtemplateBody === "") {
      return makeState(
        templateName,
        "no template body provided",
        "",
        false,
        secretCode,
      );
    }
    if (await checkExists(templateName) === 1) {
      return makeState(
        templateName,
        "template already exists",
        "",
        false,
        secretCode,
      );
    }

    await insertTemplate(
      templateName,
      newtemplateBody,
      getArgCount(newtemplateBody),
    );
    return makeState(templateName, "added!", "", false, secretCode);
  }

  const template = await getTemplate(templateName);

  if (typeof template === "undefined" || template === null) {
    return makeState(templateName, "not found!", "", false, secretCode);
  }

  const templateArgs: string[] = templateArgString.split(",").filter(Boolean)
    .map((a) => a.trim());

  if (template.argCount != templateArgs.length) {
    const error = stringFormat(
      "expected {0} args, got {1}",
      String(template.argCount),
      String(templateArgs.length),
    );
    return makeState(templateName, error, template.value, false, secretCode);
  }

  const value = stringFormat(template.value, ...templateArgs);

  return makeState(templateName, value, "", true, secretCode);
}

function getParam(url: URL, name: string): string {
  return url.searchParams.get(name) || "";
}

function makeState(
  query: string,
  value: string,
  rawTemplate: string,
  copyable: boolean,
  currentCode: string,
): UIState {
  return { query, value, rawTemplate, copyable, currentCode };
}
