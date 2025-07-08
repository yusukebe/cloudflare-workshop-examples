import { describe, it, expect } from 'vitest'
import app from './index'

describe('Basic', () => {
  it('Should return 200 response', async () => {
    const res = await app.request('/')
    expect(res.status).toBe(200)
  })

  it('Should return 404 response', async () => {
    const res = await app.request('/not-found')
    expect(res.status).toBe(404)
  })
})
