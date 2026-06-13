import { useNavigate } from 'react-router-dom'

function IconHome() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M3 11.5L12 3l9 8.5V21h-6v-6h-6v6H3V11.5Z"/>
    </svg>
  )
}

function IconHistory() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="9"/>
      <path d="M12 7v5.5L15.5 15"/>
    </svg>
  )
}

function IconSettings() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
      <circle cx="12" cy="12" r="3"/>
      <path d="M12 2v2M12 20v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M2 12h2M20 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42"/>
    </svg>
  )
}

const tabs = [
  { id: 'home',     label: 'Home',         path: '/',         Icon: IconHome },
  { id: 'history',  label: 'Geschiedenis', path: '/history',  Icon: IconHistory },
  { id: 'settings', label: 'Instellingen', path: '/settings', Icon: IconSettings },
]

export default function BottomNav({ active }) {
  const navigate = useNavigate()
  return (
    <div className="pillnav-wrap">
      <nav className="pillnav">
        {tabs.map(({ id, label, path, Icon }) => (
          <button
            key={id}
            className={`nav-tab${active === id ? ' nav-tab-active' : ''}`}
            onClick={() => navigate(path)}
            aria-label={label}
          >
            <Icon />
          </button>
        ))}
      </nav>
    </div>
  )
}
