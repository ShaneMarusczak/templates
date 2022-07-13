import { checkExists, del, get, insert, update } from "../services/db.ts";
import { getArgCount, stringFormat } from "../utils/string_utils.ts";
import { parseParams } from "./param_parser.ts";
import { token, token_type, tokenizer } from "./tokenizer.ts";

export interface UIState {
  query: string;
  value: string;
  rawTemplate: string;
  copyable: boolean;
  currentCode: string;
  codeCorrect: boolean;
}

export default async function getNextState(url: URL): Promise<UIState> {
  const p = parseParams(url);

  if (p.secretCode !== Deno.env.get("SECRET_CODE")) {
    return makeState("", "forbidden", "", false, "", false);
  }

  if (p.boxState.invalid()) {
    return makeState(
      p.templateName,
      "error, choose a single option",
      "",
      false,
      p.secretCode,
      true,
    );
  }

  if (p.templateName === "") {
    return makeState(
      "",
      "please enter a template name",
      "",
      false,
      p.secretCode,
      true,
    );
  }

  if (p.boxState.deleteOn()) {
    await del(p.templateName);
    return makeState("", "deleted!", "", false, p.secretCode, true);
  }

  const t = new tokenizer(p.newTemplateBody);
  const tokens = t.tokenize();

  if (p.boxState.newOn()) {
    if (p.newTemplateBody === "") {
      return makeState(
        p.templateName,
        "no template body provided",
        "",
        false,
        p.secretCode,
        true,
      );
    }
    if (await checkExists(p.templateName) === 1) {
      return makeState(
        p.templateName,
        "template already exists",
        "",
        false,
        p.secretCode,
        true,
      );
    }

    await insert(
      p.templateName,
      p.newTemplateBody,
      getArgCount(p.newTemplateBody),
      tokens,
    );
    return makeState(p.templateName, "added!", "", false, p.secretCode, true);
  }

  if (p.boxState.editOn()) {
    if (await checkExists(p.templateName) !== 1) {
      return makeState(
        p.templateName,
        "unable to edit, template not found",
        "",
        false,
        p.secretCode,
        true,
      );
    }

    await update(
      p.templateName,
      p.newTemplateBody,
      getArgCount(p.newTemplateBody),
      tokens,
    );
    return makeState(p.templateName, "updated!", "", false, p.secretCode, true);
  }

  const template = await get(p.templateName);

  if (typeof template === "undefined" || template === null) {
    return makeState(
      p.templateName,
      "not found!",
      "",
      false,
      p.secretCode,
      true,
    );
  }

  const templateArgs: string[] = p.templateArgString.split(",").filter(Boolean)
    .map((a) => a.trim());

  if (template.argCount != templateArgs.length) {
    const error = stringFormat(
      "expected {0} args, got {1}",
      String(template.argCount),
      String(templateArgs.length),
    );
    return makeState(
      p.templateName,
      error,
      template.value,
      false,
      p.secretCode,
      true,
    );
  }

  const value = stringFormat(makeHtml(template.tokens), ...templateArgs);

  return makeState(p.templateName, value, "", true, p.secretCode, true);
}

function makeHtml(tokens: token[]) {
  let htmlString = "";
  console.debug(tokens);
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
  codeCorrect: boolean,
): UIState {
  return { query, value, rawTemplate, copyable, currentCode, codeCorrect };
}
