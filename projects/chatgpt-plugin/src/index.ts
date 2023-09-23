import { OpenAPIHono } from '@hono/zod-openapi'
import { cors } from 'hono/cors'
import { aiPluginJson } from './ai-plugin'
import { routeAddTodo, routeDeleteTodo, routeGetTodos } from './routes'

const _TODOS: Record<string, string[]> = {}

const app = new OpenAPIHono()
app.use('*', cors())

app.openapi(routeAddTodo, (c) => {
  const { username } = c.req.valid('param')
  const { todo } = c.req.valid('json')
  if (!_TODOS[username]) {
    _TODOS[username] = []
  }
  _TODOS[username].push(todo)
  const message = `Added ${todo}`
  console.log(message)
  return c.jsonT({
    ok: true,
    message,
  })
})

app.openapi(routeGetTodos, (c) => {
  const { username } = c.req.valid('param')
  return c.jsonT({
    todos: _TODOS[username],
  })
})

app.openapi(routeDeleteTodo, (c) => {
  const { username } = c.req.valid('param')
  const { todo_idx } = c.req.valid('json')
  let message = 'Noop'
  if (0 <= todo_idx && _TODOS[username] && todo_idx < _TODOS[username].length) {
    const deletedTodo = _TODOS[username].slice(todo_idx + 1, 1)
    message = `Deleted "${deletedTodo}"`
  }
  console.log(message)
  return c.jsonT({
    ok: true,
    message,
  })
})

app.get('/.well-known/ai-plugin.json', (c) => {
  return c.json(aiPluginJson)
})

app.doc('/openapi.json', {
  openapi: '3.0.1',
  info: {
    title: 'TODO Plugin',
    description:
      'A plugin that allows the user to create and manage a TODO list using ChatGPT. If you do not know the user\'s username, ask them first before making queries to the plugin. Otherwise, use the username "global".',
    version: 'v1',
  },
  servers: [
    {
      url: 'http://localhost:8787',
    },
  ],
})

export default app
