/** @jsx h */
import { h } from "preact";
import { Handlers, PageProps } from "$fresh/server.ts";
import Output from "../islands/Output.tsx";
import RunButton from "../islands/RunButton.tsx";
import getNextState, { UIState } from "../services/state_machine.ts";
import GameLink from "../islands/GameLink.tsx";
import { styles } from "../utils/styles.ts";
import TinyPepper from "../islands/TinyPepper.tsx";

export const handler: Handlers<UIState> = {
  async GET(req, ctx) {
    return ctx.render(await getNextState(new URL(req.url)));
  },
};

export default function Page({ data }: PageProps<UIState>) {
  const { query, value, rawTemplate, copyable, currentCode } = data;

  return (
    <div style={styles.mainDiv}>
      <GameLink />
      <a
        href="https://github.com/ShaneMarusczak/templates"
        target="_blank"
        style={styles.gitHubLink}
      >
        github
      </a>
      <h1 style={{ fontSize: "xx-large", marginTop: "5px" }}>
        template builder
      </h1>
      <form style={styles.form}>
        <label for="templateName" style={styles.nameLabel}>
          template name:
        </label>
        <input
          type="text"
          name="templateName"
          id="templateName"
          value={query}
          style={styles.nameInput}
        />
        <div>
          <label for="newbox">new?</label>
          <input
            type="checkbox"
            name="newbox"
            id="newbox"
            style={{ margin: "5px" }}
          >
          </input>
          <label for="deletebox">delete?</label>
          <input
            type="checkbox"
            name="deletebox"
            id="deletebox"
            style={{ margin: "5px" }}
          />
        </div>

        <label
          for="templateArgString"
          style={styles.templateArgString}
        >
          template args:
        </label>
        <input
          type="text"
          name="templateArgString"
          id="templateArgString"
          style={styles.templateArgStringInput}
        />

        <label for="newtemplateBody">new template body:</label>
        <textarea
          name="newtemplateBody"
          id="newtemplateBody"
          style={styles.newTemplateBodyInput}
        />

        <RunButton />
        <label for="secretCode" style={styles.codeLabel}>
          secret code:
        </label>
        <input
          type="text"
          name="secretCode"
          id="secretCode"
          value={currentCode}
          style={styles.codeInput}
        />
      </form>
      <Output value={value} copyable={copyable} />
      <p title="1:28 PM">last updated: july 10, 2022</p>
      <pre style={{ width: "40em", whiteSpace: "pre-wrap" }}>
        {rawTemplate ? "Raw Template:\n" + rawTemplate : ""}
      </pre>
      <TinyPepper />
    </div>
  );
}
