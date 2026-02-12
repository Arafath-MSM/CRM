import { FormEvent, useEffect, useState } from "react"

import { apiGet, apiPost } from "../../services/api"

type Contact = {
  id: number
  full_name: string
  email: string
  phone: string
}

export default function ContactsPage() {
  const [contacts, setContacts] = useState<Contact[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const [form, setForm] = useState({ full_name: "", email: "", phone: "" })

  async function loadContacts() {
    setLoading(true)
    setError("")
    try {
      const data = await apiGet<Contact[]>("/contacts")
      setContacts(data)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load contacts")
    } finally {
      setLoading(false)
    }
  }

  async function handleCreate(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setError("")
    try {
      await apiPost<Contact, typeof form>("/contacts", form)
      setForm({ full_name: "", email: "", phone: "" })
      await loadContacts()
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to create contact")
    }
  }

  useEffect(() => {
    void loadContacts()
  }, [])

  return (
    <main className="page">
      <h1>Contacts</h1>
      <form className="inline-form" onSubmit={handleCreate}>
        <input
          value={form.full_name}
          onChange={(e) => setForm((prev) => ({ ...prev, full_name: e.target.value }))}
          placeholder="Full name"
          required
        />
        <input
          value={form.email}
          onChange={(e) => setForm((prev) => ({ ...prev, email: e.target.value }))}
          placeholder="Email"
        />
        <input
          value={form.phone}
          onChange={(e) => setForm((prev) => ({ ...prev, phone: e.target.value }))}
          placeholder="Phone"
        />
        <button type="submit">Add Contact</button>
      </form>
      {error ? <p className="error">{error}</p> : null}
      {loading ? (
        <p>Loading...</p>
      ) : (
        <table className="data-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Name</th>
              <th>Email</th>
              <th>Phone</th>
            </tr>
          </thead>
          <tbody>
            {contacts.map((contact) => (
              <tr key={contact.id}>
                <td>{contact.id}</td>
                <td>{contact.full_name}</td>
                <td>{contact.email || "-"}</td>
                <td>{contact.phone || "-"}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </main>
  )
}
