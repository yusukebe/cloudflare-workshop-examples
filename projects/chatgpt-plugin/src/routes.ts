import { z, createRoute } from '@hono/zod-openapi'

const UsernameParamsSchema = z.object({
  username: z.string().openapi({
    description: 'The name of user.',
  }),
})

const routeGetTodos = createRoute({
  method: 'get',
  path: '/todos/{username}',
  operationId: 'getTodos',
  summary: 'Get the list of todos',
  request: {
    params: UsernameParamsSchema,
  },
  responses: {
    '200': {
      description: 'OK',
      content: {
        'application/json': {
          schema: z.object({
            todos: z.array(z.string()).openapi({
              description: 'The list of todos.',
            }),
          }),
        },
      },
    },
  },
})

const routeAddTodo = createRoute({
  method: 'post',
  path: '/todos/{username}',
  operationId: 'addTodo',
  summary: 'Add a todo to the list',
  request: {
    params: UsernameParamsSchema,
    body: {
      content: {
        'application/json': {
          schema: z.object({
            todo: z.string().openapi({
              description: 'The todo to add the list.',
            }),
          }),
        },
      },
    },
  },
  responses: {
    '200': {
      description: 'OK',
      content: {
        'application/json': {
          schema: z.object({
            ok: z.boolean(),
            message: z.string(),
          }),
        },
      },
    },
  },
})

const routeDeleteTodo = createRoute({
  method: 'delete',
  path: '/todos/{username}',
  operationId: 'deleteTodo',
  summary: 'Delete a todo from the list',
  request: {
    params: UsernameParamsSchema,
    body: {
      content: {
        'application/json': {
          schema: z.object({
            todo_idx: z.number().openapi({
              description: 'The index of the todo to delete.',
            }),
          }),
        },
      },
    },
  },
  responses: {
    '200': {
      description: 'OK',
      content: {
        'application/json': {
          schema: z.object({
            ok: z.boolean(),
            message: z.string(),
          }),
        },
      },
    },
  },
})

export { routeGetTodos, routeAddTodo, routeDeleteTodo }
