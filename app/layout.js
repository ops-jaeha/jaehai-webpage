import ClientLayout from "./ClientLayout";
import "./styles/App.css";
import env from "../config/env.json";

export const metadata = {
  title: `${env.title}`,
  description: `${env.description}`,
};

export default function RootLayout({ children }) {
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
