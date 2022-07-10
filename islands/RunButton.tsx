/** @jsx h */
import { h } from "preact";
import { useState } from "preact/hooks";

export default function RunButton() {
  const [hover, setHover] = useState(false);
  return (
    <button
      type="submit"
      style={{
        width: "75px",
        height: "45px",
        border: "1px solid black",
        marginTop: "15px",
        marginBottom: "15px",
        backgroundColor: hover ? "grey" : "darkgrey",
        borderRadius: "5px",
      }}
      onMouseOver={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
    >
      Run
    </button>
  );
}
