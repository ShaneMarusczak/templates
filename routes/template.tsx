/** @jsx h */
import { h } from "preact";
import { Handlers, PageProps } from "$fresh/server.ts";
import { getArgCount, StringFormat } from "../utils/string_utils.ts";
import { deleteTemplate, getTemplate, insertTemplate } from "../utils/db.ts";
import Output from "../islands/Output.tsx";
import RunButton from "../islands/RunButton.tsx";

interface TemplateRes {
  query: string;
  value: string;
  rawTemplate: string;
}

function getParam(req: Request, name: string): string {
  return new URL(req.url).searchParams.get(name) || "";
}

function getRes(
  query: string,
  value: string,
  rawTemplate: string,
): TemplateRes {
  return { query, value, rawTemplate };
}

export const handler: Handlers<TemplateRes> = {
  async GET(req, ctx) {
    const templateName = getParam(req, "templateName");
    const templateArgString = getParam(req, "templateArgString");
    const newbox = getParam(req, "newbox");
    const deletebox = getParam(req, "deletebox");
    const newtemplateBody = getParam(req, "newtemplateBody");

    if (newbox === "on" && deletebox === "on") {
      return ctx.render(
        getRes(templateName, "Error, choose just new or delete.", ""),
      );
    }

    if (templateName === "") {
      return ctx.render(getRes("", "Please enter a template name.", ""));
    }

    const templateArgs: string[] = templateArgString.split(",").filter(Boolean)
      .map((a) => a.trim());

    if (deletebox === "on" && templateName !== "") {
      await deleteTemplate(templateName);
      return ctx.render(getRes("", "Deleted!", ""));
    }

    if (newbox === "on" && templateName !== "") {
      if (newtemplateBody === "") {
        return ctx.render(
          getRes(templateName, "No template body provided!", ""),
        );
      }
      await insertTemplate(
        templateName,
        newtemplateBody,
        getArgCount(newtemplateBody),
      );
      return ctx.render(getRes(templateName, "Added!", ""));
    }

    const template = await getTemplate({ name: templateName });

    if (typeof template === "undefined" || template === null) {
      return ctx.render(getRes("", "Not Found!", ""));
    }
    if (template.argCount != templateArgs.length) {
      const error = StringFormat(
        "Expected {0} args, got {1}.",
        String(template.argCount),
        String(templateArgs.length),
      );
      return ctx.render(getRes(templateName, error, template.value));
    }

    const value = StringFormat(template.value, ...templateArgs);

    return ctx.render(getRes(templateName, value, ""));
  },
};

export default function Page({ data }: PageProps<TemplateRes>) {
  const { query, value, rawTemplate } = data;
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <form
        style={{
          marginTop: "50px",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <label
          for="templateName"
          style={{
            display: "inline-block",
            width: "125px",
          }}
        >
          Template Name:
        </label>
        <input
          type="text"
          name="templateName"
          id="templateName"
          value={query}
          style={{
            border: "1px solid black",
            margin: "5px",
          }}
        />
        <div>
          <label for="newbox">New?</label>
          <input
            type="checkbox"
            name="newbox"
            id="newbox"
            style={{
              margin: "5px",
            }}
          >
          </input>
          <label for="deletebox">Delete?</label>
          <input
            type="checkbox"
            name="deletebox"
            id="deletebox"
            style={{
              margin: "5px",
            }}
          />
        </div>

        <br />

        <label
          for="templateArgString"
          style={{
            display: "inline-block",
            width: "125px",
          }}
        >
          Template Args:
        </label>
        <input
          type="text"
          name="templateArgString"
          id="templateArgString"
          style={{
            border: "1px solid black",
            margin: "5px",
          }}
        />
        <br />

        <label for="newtemplateBody">New Template Body:</label>
        <textarea
          name="newtemplateBody"
          id="newtemplateBody"
          style={{
            border: "1px solid black",
            width: "300px",
            height: "150px",
          }}
        />

        <br />
        <RunButton />
      </form>
      <Output value={value} />
      <p title="2:36 PM">Last Updated: July 6, 2022</p>
      <p>{rawTemplate ? "Raw Template: " + rawTemplate : ""}</p>
    </div>
  );
}
