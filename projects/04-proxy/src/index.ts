import { Hono } from 'hono'
import { proxy } from 'hono/proxy'

const originServer = 'example.com'

const app = new Hono()

app.get('/add-headers', async (c) => {
  const res = await proxy(`https://${originServer}`)
  res.headers.set('X-Custom', 'Hello')
  return res
})

export default app
