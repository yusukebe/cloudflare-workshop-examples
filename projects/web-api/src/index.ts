import { Hono } from 'hono'
import { z } from 'zod'
import { zValidator } from '@hono/zod-validator'
import { prettyJSON } from 'hono/pretty-json'

type Bindings = {
  DB: D1Database
}

const schema = z.object({
  title: z.string().min(1),
  content: z.string().min(1),
})

type Post = z.infer<typeof schema> & {
  created_at: string
  id: string
}

const app = new Hono<{ Bindings: Bindings }>()

app.get('*', prettyJSON())

app.get('/', (c) => {
  return c.json({
    ok: true,
  })
})

app.post('/posts', zValidator('form', schema), async (c) => {
  const id = crypto.randomUUID()
  const { title, content } = c.req.valid('form')

  const { success } = await c.env.DB.prepare(
    `INSERT INTO posts(id, title, content) values (?, ?, ?)`
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

app.get('/posts', async (c) => {
  const { results } = await c.env.DB.prepare(
    'SELECT * FROM posts ORDER BY created_at DESC;'
  ).all<Post>()
  const posts = results
  console.log(JSON.stringify(posts))
  return c.json({
    posts,
  })
})

export default app
