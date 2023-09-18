import { AppType } from '../server'
import { hc } from 'hono/client'
import { useState, FormEvent } from 'react'

interface Props {
  onSuccess: () => void
}

const client = hc<AppType>('/api')

export default function PostForm({ onSuccess }: Props) {
  const [title, setTitle] = useState('')
  const [content, setContent] = useState('')

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()

    const res = await client.posts.$post({
      form: {
        title,
        content,
      },
    })

    const data = await res.json()

    if (data.success) {
      setTitle('')
      setContent('')
      onSuccess()
    } else {
      console.error(data.message)
    }
  }

  return (
    <form onSubmit={handleSubmit}>
      <div>
        <label>Title</label>
        <input type='text' value={title} onChange={(e) => setTitle(e.target.value)} />
      </div>
      <div>
        <label>Content</label>
        <textarea value={content} onChange={(e) => setContent(e.target.value)}></textarea>
      </div>
      <button type='submit'>Submit</button>
    </form>
  )
}
