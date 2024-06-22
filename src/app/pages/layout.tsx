export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <header>
          <h1>Header</h1>
        </header>
        {children}
        <footer>
          <h1>Footer</h1>
        </footer>
      </body>
    </html>
  );
}
