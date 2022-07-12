/** @jsx h */
import { h } from "preact";
import { useState } from "preact/hooks";

export default function RunButton() {
  const [hover, setHover] = useState(false);
  return (
    <button
      type="submit"
      style={{
        backgroundColor: hover ? "grey" : "darkgrey",
      }}
      onMouseOver={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
    >
      Run
    </button>
  );
}
