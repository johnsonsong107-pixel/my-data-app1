import './globals.css'
export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="zh">
      <body style={{ backgroundColor: '#f9fafb' }}>{children}</body>
    </html>
  )
}