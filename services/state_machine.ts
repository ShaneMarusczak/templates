import {
  checkExists,
  deleteTemplate,
  getTemplate,
  insertTemplate,
  updateTemplate,
} from "../utils/db.ts";
import { getArgCount, stringFormat } from "../utils/string_utils.ts";
import { token, token_type, tokenizer } from "./tokenizer.ts";

export interface UIState {
  query: string;
  value: string;
  rawTemplate: string;
  copyable: boolean;
  currentCode: string;
}

//TODO: break this into smaller functions
export default async function getNextState(url: URL): Promise<UIState> {
  const secretCode = getParam(url, "secretCode");

  if (secretCode !== Deno.env.get("SECRET_CODE")) {
    return makeState("", "forbidden", "", false, "");
  }

  const templateName = getParam(url, "templateName");
  const templateArgString = getParam(url, "templateArgString");

  const boxes: { [key: string]: string } = {
    newbox: getParam(url, "newbox"),
    deletebox: getParam(url, "deletebox"),
    editBox: getParam(url, "editbox"),
  };
  const newtemplateBody = getParam(url, "newtemplateBody");

  let boxCount = 0;
  for (const k of Object.keys(boxes)) {
    if (boxes[k] === "on") {
      boxCount++;
    }
  }

  if (boxCount > 1) {
    return makeState(
      templateName,
      "error, choose a single option",
      "",
      false,
      secretCode,
    );
  }

  if (templateName === "") {
    return makeState("", "please enter a template name", "", false, secretCode);
  }

  if (boxes.deletebox === "on") {
    await deleteTemplate(templateName);
    return makeState("", "deleted!", "", false, secretCode);
  }

  const t = new tokenizer(newtemplateBody);
  const tokens = t.tokenize();

  if (boxes.newbox === "on") {
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
      tokens,
    );
    return makeState(templateName, "added!", "", false, secretCode);
  }

  if (boxes.editBox === "on") {
    if (await checkExists(templateName) !== 1) {
      return makeState(
        templateName,
        "unable to edit, template not found",
        "",
        false,
        secretCode,
      );
    }

    await updateTemplate(
      templateName,
      newtemplateBody,
      getArgCount(newtemplateBody),
      tokens,
    );
    return makeState(templateName, "updated!", "", false, secretCode);
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

  const value = stringFormat(makeHtml(template.tokens), ...templateArgs);

  return makeState(templateName, value, "", true, secretCode);
}

function getParam(url: URL, name: string): string {
  return url.searchParams.get(name) || "";
}

function makeHtml(tokens: token[]) {
  let htmlString = "";
  for (const token of tokens) {
    switch (token.type) {
      case token_type.text: {
        htmlString += "<p>";
        htmlString += token.value;
        htmlString += "</p>";
        break;
      }
      case token_type.link: {
        htmlString += '<a target="_blank" href="';
        htmlString += token.url;
        htmlString += '">';
        htmlString += token.value;
        htmlString += "</a>";
      }
    }
  }
  return htmlString;
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
