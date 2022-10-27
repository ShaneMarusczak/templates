import { Handlers, PageProps } from "$fresh/server.ts";
import Output from "../islands/Output.tsx";
import RunButton from "../islands/RunButton.tsx";
import getNextState, { UIState } from "../services/state_machine.ts";
import GameLink from "../islands/GameLink.tsx";
import TinyPepper from "../islands/TinyPepper.tsx";
import OptionSelect from "../islands/OptionSelect.tsx";

export const handler: Handlers<UIState> = {
  async GET(req, ctx) {
    return ctx.render(await getNextState(new URL(req.url)));
  },
};

export default function Page({ data }: PageProps<UIState>) {
  const { query, value, rawTemplate, copyable, currentCode, codeCorrect } =
    data;

  return (
    <div id="mainDiv">
      <GameLink />
      <a
        href="https://github.com/ShaneMarusczak/templates"
        target="_blank"
        id="gitHubLink"
      >
        github
      </a>
      <h1>
        template builder
      </h1>
      <form id="form">
        <label for="templateName" id="nameLabel">
          template name:
        </label>
        <input
          type="text"
          name="templateName"
          id="templateName"
          value={query}
        />
        <OptionSelect />

        <label
          for="templateArgStringInput"
          id="templateArgString"
        >
          template args:
        </label>
        <input
          type="text"
          name="templateArgStringInput"
          id="templateArgStringInput"
        />

        <label for="newtemplateBody">new template body:</label>
        <textarea
          name="newtemplateBody"
          id="newTemplateBodyInput"
        />
        <div
          style={{
            display: codeCorrect ? "none" : "block",
          }}
        >
          <label for="secretCode" id="codeLabel">
            secret code:
          </label>
          <input
            type="text"
            name="secretCode"
            id="secretCode"
            value={currentCode}
          />
        </div>
        <RunButton />
      </form>
      <Output value={value} copyable={copyable} />
      <p title="7:33 PM">last updated: october 27, 2022</p>
      <pre>
        {rawTemplate ? "Raw Template:\n" + rawTemplate : ""}
      </pre>
      <TinyPepper />
    </div>
  );
}
