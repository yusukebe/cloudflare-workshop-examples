import type { LayoutHandler } from '@sonikjs/react'

const handler: LayoutHandler = ({ children, head }) => {
  return (
    <html lang="en">
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        {import.meta.env.PROD ? (
          <>
            <link href="/static/style.css" rel="stylesheet" />
            <script type="module" src="/static/client.js"></script>
          </>
        ) : (
          <>
            <link href="/app/style.css" rel="stylesheet" />
            <script type="module" src="/app/client.ts"></script>
          </>
        )}
        {head.createTags()}
      </head>
      <body>
        <div className="wrapper">
          <h1>Hello ChatGPT!</h1>
          {children}
          <footer style={{ marginTop: '2rem' }}>
            <small>
              © 2023 Yusuke Wada
              <br /> <a href="https://github.com/yusukebe/chatgpt-streaming">See the code</a>
            </small>
          </footer>
        </div>
      </body>
    </html>
  )
}

export default handler
