import Link from 'next/link'

const items = [
  { label: 'Dashboard', href: '/' },
  { label: 'Conversation Inbox', href: '/inbox' },
  { label: 'Contacts', href: '/contacts' },
  { label: 'Campaigns', href: '/campaigns' },
  { label: 'AI Agent Studio', href: '/ai-studio' },
  { label: 'Tickets', href: '/tickets' },
  { label: 'Admin Settings', href: '/admin' },
]

export function Sidebar() {
  return (
    <aside className="sidebar">
      <div className="brand">FreshCRM</div>
      <nav>
        <ul>
          {items.map((item) => (
            <li key={item.href}>
              <Link href={item.href}>{item.label}</Link>
            </li>
          ))}
        </ul>
      </nav>
    </aside>
  )
}