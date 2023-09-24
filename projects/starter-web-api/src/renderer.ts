import { Context } from 'hono'
import { html } from 'hono/html'

export const renderer = (c: Context) => (content: string) => {
  return c.html(html`<!DOCTYPE html>
    <html lang="en">
      <head>
        <meta charset="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/@picocss/pico@1/css/pico.min.css" />
      </head>
      <body>
        <main class="container">${content}</main>
      </body>
    </html>`)
}
