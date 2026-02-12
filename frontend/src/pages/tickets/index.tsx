import { FormEvent, useEffect, useState } from "react"

import { apiGet, apiPost } from "../../services/api"

type Ticket = {
  id: number
  title: string
  status: string
  created_at: string
}

export default function TicketsPage() {
  const [tickets, setTickets] = useState<Ticket[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const [form, setForm] = useState({ title: "", status: "open" })

  async function loadTickets() {
    setLoading(true)
    setError("")
    try {
      const data = await apiGet<Ticket[]>("/tickets")
      setTickets(data)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load tickets")
    } finally {
      setLoading(false)
    }
  }

  async function handleCreate(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setError("")
    try {
      await apiPost<Ticket, typeof form>("/tickets", form)
      setForm({ title: "", status: "open" })
      await loadTickets()
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to create ticket")
    }
  }

  useEffect(() => {
    void loadTickets()
  }, [])

  return (
    <main className="page">
      <h1>Tickets</h1>
      <form className="inline-form" onSubmit={handleCreate}>
        <input
          value={form.title}
          onChange={(e) => setForm((prev) => ({ ...prev, title: e.target.value }))}
          placeholder="Ticket title"
          required
        />
        <select
          value={form.status}
          onChange={(e) => setForm((prev) => ({ ...prev, status: e.target.value }))}
        >
          <option value="open">Open</option>
          <option value="pending">Pending</option>
          <option value="resolved">Resolved</option>
        </select>
        <button type="submit">Create Ticket</button>
      </form>
      {error ? <p className="error">{error}</p> : null}
      {loading ? (
        <p>Loading...</p>
      ) : (
        <table className="data-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Title</th>
              <th>Status</th>
              <th>Created</th>
            </tr>
          </thead>
          <tbody>
            {tickets.map((ticket) => (
              <tr key={ticket.id}>
                <td>{ticket.id}</td>
                <td>{ticket.title}</td>
                <td>{ticket.status}</td>
                <td>{new Date(ticket.created_at).toLocaleString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </main>
  )
}
