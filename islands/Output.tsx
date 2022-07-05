/** @jsx h */
import { h } from "preact";

export default function Output(props: { value: string }) {
    const {value} = props;

  return (
    <p 
    style={{
        border: "1px solid black",
        padding: "5px",
        width: "50em",
        minHeight: "5em",
        overflow: "auto",
        whiteSpace: "pre"
        }} 
    onClick={()=>navigator.clipboard.writeText(value)}>{value}</p>
  );
}