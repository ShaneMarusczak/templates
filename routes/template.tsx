/** @jsx h */
import { h } from "preact";
import { Handlers, PageProps } from "$fresh/server.ts";

import {StringFormat} from '../utils/string_utils.ts'
import { getTemplate, insertTemplate, deleteTemplate } from '../utils/db.ts'

interface TemplateRes {
    query: string,
    value: string;
    rawTemplate:string;
}

function getRes(query:string, value:string,rawTemplate:string):TemplateRes {
  return {query,value,rawTemplate};
}

function getArgCount(s:string):number {
  return (s.match(/{(\d+)}/g) || []).length;
}

export const handler: Handlers<TemplateRes> = {
  async GET(req, ctx) {
    const url = new URL(req.url);

    const templateName = url.searchParams.get("templateName") || "";
    const templateArgString = url.searchParams.get("templateArgString") || "";


    const newbox = url.searchParams.get("newbox") || "";
    const deletebox = url.searchParams.get("deletebox") || "";
    const newtemplateBody = url.searchParams.get("newtemplateBody") || "";

    if(newbox === "on" && deletebox === "on") {
      return ctx.render(getRes(templateName, "Error, choose just new or delete.", ""));
    }

    if(templateName === "") {
      return ctx.render(getRes("", "Please enter a template name.", ""));
    }

    const templateArgs : string[] = templateArgString.split(",").filter(Boolean);

    if(deletebox === "on" && templateName !== "") {
      await deleteTemplate(templateName);
      return ctx.render(getRes("", "Deleted!", ""));
    }

    if(newbox === "on" && templateName !== "") {
      if(newtemplateBody === "") {
        return ctx.render(getRes(templateName, "No template body provided!", ""));
      }
      await insertTemplate(templateName, newtemplateBody, getArgCount(newtemplateBody));
      return ctx.render(getRes(templateName, "Added!",""));
    }
    
    const template = await getTemplate({name:templateName});
    console.debug(template);

    if(typeof template === "undefined" || template === null) {
      return ctx.render(getRes("", "Not Found!", ""));
    }
    if(template.argCount != templateArgs.length) {
      const error = StringFormat("Expected {0} args, got {1}.", String(template.argCount), String(templateArgs.length));
      return ctx.render(getRes("", error, template.value));

    }

    const value = StringFormat(template.value, ...templateArgs);

    return ctx.render(getRes(templateName, value, ""));
  },
};

export default function Page({ data }: PageProps<TemplateRes>) {
  const { query, value, rawTemplate } = data;
  return (
    <div>
      <form>

        <label for="templateName">Template Name:</label>
        <input type="text" name="templateName" id="templateName" value={query}
        style={{
                border: "1px solid black"
        }}/>

        <br/>

        <label for="templateArgString">Template Args:</label>
        <input type="text" name="templateArgString" id="templateArgString"
        style={{
                border: "1px solid black"
        }}/>

        <br/><br/>
        <label for="newtemplateBody">New Template Body:</label>
        <textarea name="newtemplateBody" id="newtemplateBody"
        style={{
                border: "1px solid black"
        }}/>
        <label for="newbox">New?</label>
        <input type="checkbox" name="newbox" id="newbox"></input>

        <label for="deletebox">Delete?</label>
        <input type="checkbox" name="deletebox" id="deletebox"></input>
        <br/>

        <button type="submit"
        style={{
                width: "50px",
                height: "50px",
                border: "1px solid black"
        }}>Run</button>

      </form>

      <p 
      style={{
              border: "1px solid black",
              padding: "5px",
              width: "50em",
              minHeight: "5em",
              overflow: "auto"
      }}>
        {value}
      </p>
      <p>{rawTemplate ? "Raw Template: "+rawTemplate: ""}</p>

    </div>
  );
}