/** @jsx h */
import { h } from "preact";
import { useState } from "preact/hooks";

export default function TinyPepper() {
  const [hover, setHover] = useState(false);
  return (
    <img
      src="/tiny-pepper.png"
      style={{
        opacity: hover ? "1" : "0",
        position: "absolute",
        top: "25vh",
        left: "80vw",
        overflow: "hidden",
      }}
      onMouseOver={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
    />
  );
}
