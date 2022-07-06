/** @jsx h */
import { h } from "preact";
import { tw } from "../utils/twind.ts";

export default function Output(props: { value: string }) {
  const { value } = props;

  function sleep(ms: number) {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }

  function modal(message: string, duration: number) {
    const modalBox = document.createElement("div");
    modalBox.id = "modal-box";
    const innerModalBox = document.createElement("div");
    innerModalBox.id = "inner-modal-box";
    const modalMessage = document.createElement("span");
    modalMessage.id = "modal-message";
    innerModalBox.appendChild(modalMessage);
    modalBox.appendChild(innerModalBox);
    modalMessage.innerText = message;
    document.getElementsByTagName("html")[0].appendChild(modalBox);
    sleep(duration).then(() => modalBox.remove());
  }

  function onClick() {
    modal("Copied to clipboard!", 2000);
    navigator.clipboard.writeText(value);
  }

  return (
    <p
      style={{
        border: "1px solid black",
        padding: "5px",
        width: "50em",
        minHeight: "5em",
        overflow: "auto",
        whiteSpace: "pre",
      }}
      onClick={() => onClick()}
    >
      {value}
    </p>
  );
}
