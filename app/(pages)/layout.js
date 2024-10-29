// app/(dashboard)/layout.js
'use client';

import Sidebar from '../../components/Sidebar';
import '../styles/App.css';

export default function DashboardLayout({ children }) {
  return (
    <div className="app-container">
      <Sidebar />
      <div className="main-content">{children}</div>
    </div>
  );
}
