export default function Output(props: { value: string; copyable: boolean }) {
  const { value, copyable } = props;

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
    if (copyable) {
      let text = "";
      const nodes = Array.from(
        document.getElementById("highShell")?.childNodes || [],
      );
      const selection = window.getSelection();
      if (selection !== null) {
        const range = document.createRange();
        for (const node of nodes) {
          range.selectNodeContents(node);
          selection.removeAllRanges();
          selection.addRange(range);
          text += selection.toString();
        }
      }
      navigator.clipboard.writeText(text);

      modal("copied!", 1300);
    }
  }

  return (
    <div
      id="highShell"
      onClick={onClick}
      dangerouslySetInnerHTML={{ __html: value }}
    >
    </div>
  );
}
