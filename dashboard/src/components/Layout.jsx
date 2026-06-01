import { NavLink, Outlet } from 'react-router-dom';
import { LayoutDashboard, Users, ClipboardList, FileBarChart } from 'lucide-react';

const navItems = [
  { to: '/', label: 'Dashboard', icon: LayoutDashboard },
  { to: '/familias', label: 'Famílias', icon: Users },
  { to: '/lancamento', label: 'Lançamento', icon: ClipboardList },
  { to: '/relatorio', label: 'Relatório', icon: FileBarChart },
];

export default function Layout() {
  return (
    <div className="app-layout">
      <aside className="sidebar">
        <div className="sidebar-logo">
          <div className="logo-icon">H</div>
          <div className="logo-text">
            <span className="logo-title">Instituto HOPE</span>
            <span className="logo-subtitle">Onda Dura</span>
          </div>
        </div>
        <nav className="sidebar-nav">
          {navItems.map(({ to, label, icon: Icon }) => (
            <NavLink
              key={to}
              to={to}
              className={({ isActive }) =>
                `nav-item ${isActive ? 'active' : ''}`
              }
              end={to === '/'}
            >
              <Icon size={20} />
              <span>{label}</span>
            </NavLink>
          ))}
        </nav>
        <div className="sidebar-footer">
          <p>Joinville/SC</p>
          <p className="version">v1.0</p>
        </div>
      </aside>
      <main className="main-content">
        <Outlet />
      </main>
    </div>
  );
}
