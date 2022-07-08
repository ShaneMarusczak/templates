/** @jsx h */
import { h } from "preact";
import { useEffect, useState } from "preact/hooks";

export default function RunButton() {
  const [hover, setHover] = useState(false);
  useEffect(() => {
    document.getElementsByTagName("html")[0].style.backgroundColor = "#b0c4de";
  }, []);
  return (
    <button
      type="submit"
      style={{
        width: "50px",
        height: "50px",
        border: "1px solid black",
        margin: "5px",
        backgroundColor: hover ? "grey" : "darkgrey",
      }}
      onMouseOver={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
    >
      Run
    </button>
  );
}
