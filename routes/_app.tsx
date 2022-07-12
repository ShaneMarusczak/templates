// routes/_app.tsx
/** @jsx h */
/** @jsxFrag Fragment */
import { Fragment, h } from "preact";
import { asset, Head } from "$fresh/runtime.ts";
import { AppProps } from "$fresh/server.ts";

export default function App(props: AppProps) {
  return (
    <>
      <Head>
        <link href={asset("/styles.css")} rel="stylesheet" />
      </Head>
      <props.Component />
    </>
  );
}
