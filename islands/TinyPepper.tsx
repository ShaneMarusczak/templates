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
      }}
      onMouseOver={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
    />
  );
}
