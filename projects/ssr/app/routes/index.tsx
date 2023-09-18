import { zValidator } from '@hono/zod-validator'
import type { Bindings, Post } from 'commons'
import { schema } from 'commons'
import type { Context } from 'sonik'
import { defineRoute } from 'sonik'

export const route = defineRoute<{ Bindings: Bindings }>((app) => {
  app.post(
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
})

export default async function Index(c: Context<{ Bindings: Bindings }>) {
  const { results } = await c.env.DB.prepare(
    'SELECT * FROM posts ORDER BY created_at DESC;'
  ).all<Post>()
  const posts = results

  return c.render(
    <div>
      <form action='/' method='POST'>
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
    </div>,
    {
      title: 'Blog!',
    }
  )
}
