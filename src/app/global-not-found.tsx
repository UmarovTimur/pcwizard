import "./globals.css";

// 404 для адресов вне /ru и /uz (корневой layout находится в app/[locale])
export default function GlobalNotFound() {
  return (
    <html lang="ru">
      <body>
        <h1>404</h1>
      </body>
    </html>
  );
}
