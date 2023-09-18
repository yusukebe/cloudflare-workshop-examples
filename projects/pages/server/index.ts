import { zValidator } from '@hono/zod-validator'
import { schema } from 'commons'
import type { Bindings, Post } from 'commons'
import { Hono } from 'hono'
import { prettyJSON } from 'hono/pretty-json'

const app = new Hono<{ Bindings: Bindings }>()

app.get('*', prettyJSON())

app.get('/', (c) => {
  return c.json({
    ok: true,
  })
})

const route = app
  .post('/posts', zValidator('form', schema), async (c) => {
    const id = crypto.randomUUID()
    const { title, content } = c.req.valid('form')

    const { success } = await c.env.DB.prepare(
      'INSERT INTO posts(id, title, content) values (?, ?, ?)'
    )
      .bind(id, title, content)
      .run()

    if (!success) {
      c.status(500)
      c.jsonT({
        success: false,
        message: 'Something went wrong',
      })
    }

    c.status(201)
    return c.jsonT({
      success: true,
      message: 'Created!',
    })
  })
  .get('/posts', async (c) => {
    const { results } = await c.env.DB.prepare(
      'SELECT * FROM posts ORDER BY created_at DESC;'
    ).all<Post>()
    const posts = results
    return c.jsonT({
      posts,
    })
  })

export type AppType = typeof route

export default app
