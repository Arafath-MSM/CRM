import React from 'react'
import { Sidebar } from '../sidebar/Sidebar'
import { Topbar } from '../topbar/Topbar'

export function AppShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="app-shell">
      <Sidebar />
      <div className="app-main">
        <Topbar />
        <div className="app-content">{children}</div>
      </div>
    </div>
  )
}