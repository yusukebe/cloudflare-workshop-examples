import { Hono } from 'hono'
import * as z from 'zod/v4'
import { zValidator } from '@hono/zod-validator'

export const schema = z.object({
  title: z.string().min(1),
  content: z.string().min(1),
})

type Post = z.infer<typeof schema> & {
  created_at: string
  id: string
}

const app = new Hono<{ Bindings: CloudflareBindings }>()

app.get('/posts', async (c) => {
  const { results: posts } = await c.env.DB.prepare(
    'SELECT * FROM posts ORDER BY created_at DESC;'
  ).all<Post>()
  return c.json({
    posts,
  })
})

app.post('/posts', zValidator('form', schema), async (c) => {
  const { title, content } = c.req.valid('form')
  const id = crypto.randomUUID()
  const { success } = await c.env.DB.prepare(
    'INSERT INTO posts(id, title, content) values (?, ?, ?)'
  )
    .bind(id, title, content)
    .run()
  return c.json({ success })
})

export default app
