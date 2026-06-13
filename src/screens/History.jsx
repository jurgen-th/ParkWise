import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { getSessions, getProfile } from '../utils/storage'
import { generateReceipt, formatDuration } from '../utils/pdf'
import BottomNav from '../components/BottomNav'
import PlateBadge from '../components/PlateBadge'
import { IconDownload } from '../components/Icons'

const WEEK_MS = 7 * 24 * 60 * 60 * 1000

export default function History() {
  const navigate  = useNavigate()
  const [sessions, setSessions] = useState([])
  const [filter, setFilter]     = useState('all')

  useEffect(() => {
    if (!getProfile()) { navigate('/login', { replace: true }); return }
    setSessions(getSessions())
  }, [])

  const visible = filter === 'week'
    ? sessions.filter(s => Date.now() - new Date(s.startTime).getTime() < WEEK_MS)
    : sessions

  return (
    <div className="screen">
      <header className="page-head">
        <h1>Geschiedenis</h1>
      </header>

      <div className="filters">
        <button
          className={`filter-chip${filter === 'all' ? ' filter-chip-active' : ''}`}
          onClick={() => setFilter('all')}
        >
          Alles
        </button>
        <button
          className={`filter-chip${filter === 'week' ? ' filter-chip-active' : ''}`}
          onClick={() => setFilter('week')}
        >
          Deze week
        </button>
      </div>

      <div className="content">
        {visible.length === 0 ? (
          <div className="empty-state">
            <div className="empty-icon">P</div>
            <p>Nog geen parkeersessies</p>
            <span>Start je eerste sessie via Home.</span>
          </div>
        ) : (
          <div className="session-list">
            {visible.map(s => {
              const d = new Date(s.startTime)
              const dateStr = d.toLocaleDateString('nl-NL', {
                day: 'numeric', month: 'short', year: 'numeric',
              })
              const timeStr = d.toLocaleTimeString('nl-NL', {
                hour: '2-digit', minute: '2-digit',
              })
              return (
                <div key={s.id} className="session-item">
                  <div className="session-item-info">
                    <PlateBadge plate={s.plate} />
                    <span className="session-item-date">{dateStr} · {timeStr}</span>
                  </div>
                  <div className="session-item-end">
                    <span className="duration-pill">{formatDuration(s.duration)}</span>
                    <button
                      className="icon-btn"
                      onClick={() => generateReceipt(s)}
                      aria-label="Download PDF"
                    >
                      <IconDownload size={17} />
                    </button>
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </div>

      <BottomNav active="history" />
    </div>
  )
}
