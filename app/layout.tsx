import ClientLayout from "./ClientLayout";
import "./styles/App.css";
import "./styles/Global.css";
import env from "../config/env.json";

export const metadata = {
  title: `${env.title}`,
  description: `${env["env.description"]}`,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ko">
      <body
        style={{
          paddingRight: "0px",
          margin: "0",
          overflowX: "revert",
          overflowY: "scroll",
        }}
      >
        <ClientLayout>{children}</ClientLayout>
      </body>
    </html>
  );
}
