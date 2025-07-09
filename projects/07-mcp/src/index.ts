import { Hono } from 'hono'
import { z } from 'zod'
import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js'
import { StreamableHTTPTransport } from '@hono/mcp'

type Post = {
  title: string
  content: string
  created_at: string
  id: string
}

const app = new Hono<{ Bindings: CloudflareBindings }>()

app.all('/mcp', async (c) => {
  const transport = new StreamableHTTPTransport()

  const mcpServer = new McpServer({
    name: 'my-blog-mcp-server',
    version: '1.0.0',
  })

  mcpServer.tool('get_posts', async () => {
    const { results: posts } = await c.env.DB.prepare(
      'SELECT * FROM posts ORDER BY created_at DESC;'
    ).all<Post>()
    return {
      content: [
        {
          type: 'text',
          text: JSON.stringify(posts),
        },
      ],
    }
  })

  mcpServer.tool(
    'create_post',
    { title: z.string(), content: z.string() },
    async ({ title, content }) => {
      const id = crypto.randomUUID()
      const { success } = await c.env.DB.prepare(
        'INSERT INTO posts(id, title, content) values (?, ?, ?)'
      )
        .bind(id, title, content)
        .run()
      return {
        content: [
          {
            type: 'text',
            text: JSON.stringify({ success }),
          },
        ],
      }
    }
  )

  await mcpServer.connect(transport)
  return transport.handleRequest(c)
})

export default app
