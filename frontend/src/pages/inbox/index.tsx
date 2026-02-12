import { FormEvent, useEffect, useState } from "react"

import { apiGet, apiPost } from "../../services/api"

type Conversation = {
  id: number
  subject: string
  created_at: string
}

type Message = {
  id: number
  conversation: number
  body: string
  created_at: string
}

export default function InboxPage() {
  const [conversations, setConversations] = useState<Conversation[]>([])
  const [selectedConversationId, setSelectedConversationId] = useState<number | null>(null)
  const [messages, setMessages] = useState<Message[]>([])
  const [subject, setSubject] = useState("")
  const [messageBody, setMessageBody] = useState("")
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")

  async function loadConversations() {
    setLoading(true)
    setError("")
    try {
      const data = await apiGet<Conversation[]>("/inbox/conversations")
      setConversations(data)
      if (data.length > 0 && selectedConversationId === null) {
        setSelectedConversationId(data[0].id)
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load inbox")
    } finally {
      setLoading(false)
    }
  }

  async function loadMessages(conversationId: number) {
    setError("")
    try {
      const data = await apiGet<Message[]>(`/inbox/messages?conversation=${conversationId}`)
      setMessages(data)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load messages")
    }
  }

  async function handleCreateConversation(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setError("")
    try {
      const created = await apiPost<Conversation, { subject: string }>("/inbox/conversations", { subject })
      setSubject("")
      await loadConversations()
      setSelectedConversationId(created.id)
      await loadMessages(created.id)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to create conversation")
    }
  }

  async function handleCreateMessage(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    if (!selectedConversationId) return
    setError("")
    try {
      await apiPost<Message, { conversation: number; body: string }>("/inbox/messages", {
        conversation: selectedConversationId,
        body: messageBody,
      })
      setMessageBody("")
      await loadMessages(selectedConversationId)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to send message")
    }
  }

  useEffect(() => {
    void loadConversations()
  }, [])

  useEffect(() => {
    if (selectedConversationId) {
      void loadMessages(selectedConversationId)
    } else {
      setMessages([])
    }
  }, [selectedConversationId])

  return (
    <main className="page">
      <h1>Conversation Inbox</h1>
      <form className="inline-form" onSubmit={handleCreateConversation}>
        <input
          value={subject}
          onChange={(e) => setSubject(e.target.value)}
          placeholder="Conversation subject"
          required
        />
        <button type="submit">Create Conversation</button>
      </form>
      {error ? <p className="error">{error}</p> : null}
      <section className="inbox-layout">
        <aside className="panel">
          <h2>Conversations</h2>
          {loading ? <p>Loading...</p> : null}
          <ul className="list">
            {conversations.map((conversation) => (
              <li key={conversation.id}>
                <button
                  type="button"
                  className={selectedConversationId === conversation.id ? "list-btn active" : "list-btn"}
                  onClick={() => setSelectedConversationId(conversation.id)}
                >
                  <span>{conversation.subject || `Conversation #${conversation.id}`}</span>
                </button>
              </li>
            ))}
          </ul>
        </aside>
        <section className="panel">
          <h2>Messages</h2>
          {selectedConversationId ? (
            <>
              <ul className="list">
                {messages.map((msg) => (
                  <li key={msg.id} className="message-item">
                    <p>{msg.body}</p>
                    <small>{new Date(msg.created_at).toLocaleString()}</small>
                  </li>
                ))}
              </ul>
              <form className="inline-form" onSubmit={handleCreateMessage}>
                <input
                  value={messageBody}
                  onChange={(e) => setMessageBody(e.target.value)}
                  placeholder="Type a message"
                  required
                />
                <button type="submit">Send</button>
              </form>
            </>
          ) : (
            <p>Select or create a conversation.</p>
          )}
        </section>
      </section>
    </main>
  )
}
