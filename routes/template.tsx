/** @jsx h */
import { h } from "preact";
import { Handlers, PageProps } from "$fresh/server.ts";
import Output from "../islands/Output.tsx";
import RunButton from "../islands/RunButton.tsx";
import getNextState, { UIState } from "../services/state_machine.ts";

export const handler: Handlers<UIState> = {
  async GET(req, ctx) {
    return ctx.render(await getNextState(new URL(req.url)));
  },
};

export default function Page({ data }: PageProps<UIState>) {
  const { query, value, rawTemplate, copyable } = data;
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
      <Output value={value} copyable={copyable} />
      <p title="1:04 PM">Last Updated: July 7, 2022</p>
      <pre style={{ width: "50em", whiteSpace: "pre-wrap" }}>
        {rawTemplate ? "Raw Template:\n" + rawTemplate : ""}
      </pre>
    </div>
  );
}
