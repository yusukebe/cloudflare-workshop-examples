import app from '../../server'
import { Hono } from 'hono'
import { handle } from 'hono/cloudflare-pages'

const main = new Hono()
main.route('/api', app)

export const onRequest = handle(main)
