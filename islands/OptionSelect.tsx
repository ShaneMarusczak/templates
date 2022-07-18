/** @jsx h */
import { h } from "preact";

export default function OptionSelect() {
  function onInput(e: Event) {
    const inputs = document.querySelectorAll("input[type='checkbox']");
    inputs.forEach((elem) => {
      if (elem.id != (e.target as HTMLInputElement).id) {
        (elem as HTMLInputElement).checked = false;
      }
    });
  }

  return (
    <div>
      <label for="newbox">new?</label>
      <input
        type="checkbox"
        name="newbox"
        id="newbox"
        onInput={onInput}
      >
      </input>
      <label for="deletebox">delete?</label>
      <input
        type="checkbox"
        name="deletebox"
        id="deletebox"
        onInput={onInput}
      />

      <label for="editbox">edit?</label>
      <input
        type="checkbox"
        name="editbox"
        id="editbox"
        onInput={onInput}
      />
    </div>
  );
}
