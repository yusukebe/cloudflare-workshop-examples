import app from '../src'

describe('Basic', () => {
  it('should return 200 response', async () => {
    const res = await app.request('/')
    expect(res.status).toBe(200)
    expect(await res.json()).toEqual({ ok: true })
  })
})
