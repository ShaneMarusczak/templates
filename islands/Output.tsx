/** @jsx h */
import { h } from "preact";

export default function Output(props: { value: string; copyable: boolean }) {
  const { value, copyable } = props;

  function sleep(ms: number) {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }

  function modal(message: string, duration: number) {
    const modalBox = document.createElement("div");

    modalBox.style.zIndex = "1";
    modalBox.style.position = "fixed";
    modalBox.style.padding = "0";
    modalBox.style.margin = "0";
    modalBox.style.top = "0";
    modalBox.style.left = "0";
    modalBox.style.width = "100%";
    modalBox.style.height = "100%";
    modalBox.style.backgroundColor = "rgba(0, 0, 0, 0.6)";

    const innerModalBox = document.createElement("div");

    innerModalBox.style.position = "relative";
    innerModalBox.style.textAlign = "center";
    innerModalBox.style.borderRadius = "5px";
    innerModalBox.style.boxShadow = "inset 0 0 0 4px black";
    innerModalBox.style.marginLeft = "35vw";
    innerModalBox.style.marginTop = "10vh";
    innerModalBox.style.backgroundColor = "azure";
    innerModalBox.style.width = "30vw";
    innerModalBox.style.height = "15vh";

    const modalMessage = document.createElement("span");

    modalMessage.style.verticalAlign = "middle";
    modalMessage.style.fontSize = "xx-large";
    modalMessage.style.lineHeight = "15vh";

    innerModalBox.appendChild(modalMessage);
    modalBox.appendChild(innerModalBox);
    modalMessage.innerText = message;
    document.getElementsByTagName("html")[0].appendChild(modalBox);
    sleep(duration).then(() => modalBox.remove());
  }

  function onClick() {
    if (copyable) {
      modal("Copied to clipboard!", 1300);
      navigator.clipboard.writeText(value);
    }
  }

  return (
    <p
      style={{
        border: "1px solid black",
        padding: "5px",
        width: "40em",
        minHeight: "5em",
        overflow: "auto",
        whiteSpace: "pre",
        // fontSize: "12px",
        backgroundColor: "lightgrey",
        borderRadius: "5px",
      }}
      onClick={() => onClick()}
    >
      {value}
    </p>
  );
}
