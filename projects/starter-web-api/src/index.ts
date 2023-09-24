import { Hono } from 'hono'
import { z } from 'zod'
import { zValidator } from '@hono/zod-validator'

import { renderer } from './renderer'

const schema = z.object({
  title: z.string().min(1),
  content: z.string().min(1)
})

export type Bindings = {
  DB: D1Database
}

export type Post = z.infer<typeof schema> & {
  created_at: string
  id: string
}

const app = new Hono<{
  Bindings: Bindings
}>()

app.get('/posts', async (c) => {
  const { results } = await c.env.DB.prepare('SELECT * FROM posts ORDER BY created_at DESC;').all<Post>()
  const posts = results

  return c.json({
    posts
  })
})

app.post('/posts', zValidator('form', schema), async (c) => {
  const { title, content } = c.req.valid('form')
  const id = crypto.randomUUID()
  const { success } = await c.env.DB.prepare('INSERT INTO posts(id, title, content) values (?, ?, ?)')
    .bind(id, title, content)
    .run()
  return c.redirect('/posts')
})

export default app
