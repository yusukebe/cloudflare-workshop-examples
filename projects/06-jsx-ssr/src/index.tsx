import { Hono } from 'hono'
import * as z from 'zod/v4'
import { zValidator } from '@hono/zod-validator'
import { renderer } from './renderer'

export const schema = z.object({
  title: z.string().min(1),
  content: z.string().min(1),
})

type Post = z.infer<typeof schema> & {
  created_at: string
  id: string
}

const app = new Hono<{ Bindings: CloudflareBindings }>()

app.use(renderer)

app.get('/', async (c) => {
  const { results: posts } = await c.env.DB.prepare(
    'SELECT * FROM posts ORDER BY created_at DESC;'
  ).all<Post>()
  return c.render(
    <div>
      <title>Blog</title>
      <form action='/' method='post'>
        <div>
          <label>Title</label>
          <input type='text' name='title' />
        </div>
        <div>
          <label>Content</label>
          <textarea name='content'></textarea>
        </div>
        <button type='submit'>Submit</button>
      </form>
      {posts.map((post) => {
        return (
          <article>
            <h2>{post.title}</h2>
            <p>{post.content}</p>
          </article>
        )
      })}
    </div>
  )
})

app.post(
  '/',
  zValidator('form', schema, (result, c) => {
    if (!result.success) {
      console.error(result.error.message)
      return c.redirect('/')
    }
  }),
  async (c) => {
    const id = crypto.randomUUID()
    const { title, content } = c.req.valid('form')

    await c.env.DB.prepare('INSERT INTO posts(id, title, content) values (?, ?, ?)')
      .bind(id, title, content)
      .run()

    return c.redirect('/')
  }
)

export default app
