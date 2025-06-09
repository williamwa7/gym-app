import { Html, Head, Main, NextScript } from 'next/document';

export default function Document() {
  return (
    <Html lang="pt-BR">
      <Head>
        <link rel="manifest" href="/manifest.json" />
        <meta name="theme-color" content="#007bff" />
      </Head>
      <body
        style={{
          backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.9), rgba(0, 0, 0, 0.7)), url('/bg.webp')`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
          backgroundAttachment: "fixed", // <-- ESSA LINHA AQUI
          minHeight: "100vh",
          color: "#fff",
        }}
      >
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}
