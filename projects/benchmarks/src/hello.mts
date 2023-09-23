import { Hono } from 'hono'
import { Router } from 'itty-router'
import { run, bench, group } from 'mitata'

const appFetch = {
  fetch: async (req: Request) => {
    const url = new URL(req.url)
    if (url.pathname === '/hello' && req.method === 'GET') {
      return new Response('Hello')
    }
    return new Response('Not Found', {
      status: 404,
    })
  },
}

const appHono = new Hono()
appHono.get('/hello', (c) => {
  return c.text('Hello')
})

const ittyRouter = Router()
ittyRouter.get('/hello', () => new Response('Hello'))
ittyRouter.all(
  '*',
  () =>
    new Response('Not Found', {
      status: 404,
    })
)
const ittyApp = {
  fetch: (req: Request) => ittyRouter.handle(req),
}

bench('noop', () => {})

group({ name: 'Get /hello' }, () => {
  const request = new Request('http://localhost/hello')

  bench('fetch', async () => {
    await appFetch.fetch(request)
  })

  bench('Hono', async () => {
    await appHono.fetch(request)
  })

  bench('itty-router', async () => {
    await ittyApp.fetch(request)
  })
})

await run()
