'use client'

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  return (
    <html lang="ar">
      <body>
        <h2>عذراً، حدث خطأ عام</h2>
        <button onClick={() => reset()}>المحاولة مرة أخرى</button>
      </body>
    </html>
  )
}
