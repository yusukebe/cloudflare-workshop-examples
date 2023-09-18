import { useState, useEffect, useCallback } from 'react'
import type { AppType, Post } from '../server'
import { hc } from 'hono/client'
import PostForm from './PostForm'

const client = hc<AppType>('/api')

export default function App() {
  const [posts, setPosts] = useState<Post[]>([])

  const fetchData = async () => {
    const res = await client.posts.$get()
    const { posts } = await res.json()
    setPosts(posts)
  }

  useEffect(() => {
    fetchData()
  }, [])

  const handleFormSuccess = useCallback(() => {
    fetchData()
  }, [])

  return (
    <div>
      <h1>Blog</h1>
      <PostForm onSuccess={handleFormSuccess} />
      <div>
        {posts.map((post) => {
          return (
            <article key={post.id}>
              <h2>{post.title}</h2>
              <p>{post.content}</p>
            </article>
          )
        })}
      </div>
    </div>
  )
}
