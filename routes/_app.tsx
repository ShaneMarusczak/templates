// routes/_app.tsx
import { asset, Head } from "$fresh/runtime.ts";
import { AppProps } from "$fresh/server.ts";

export default function App(props: AppProps) {
  return (
    <>
      <Head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="true"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Roboto+Mono&family=Roboto:wght@500&display=swap"
          rel="stylesheet"
        />
        <link href={asset("/styles.css")} rel="stylesheet" />
      </Head>
      <props.Component />
    </>
  );
}
