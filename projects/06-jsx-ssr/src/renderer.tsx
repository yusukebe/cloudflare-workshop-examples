import { jsxRenderer } from 'hono/jsx-renderer'

export const renderer = jsxRenderer(({ children }) => {
  return (
    <html lang='en'>
      <head>
        <meta name='viewport' content='width=device-width, initial-scale=1' />
        <link
          rel='stylesheet'
          href='https://cdn.jsdelivr.net/npm/@picocss/pico@1/css/pico.min.css'
        />
      </head>
      <body>
        <main class='container'>
          <h1>
            <a href='/'>Blog!</a>
          </h1>
          {children}
          <div style='margin-top:2rem'>
            <small>© 2025 your name</small>
          </div>
        </main>
      </body>
    </html>
  )
})
