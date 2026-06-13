import { useState, useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { MapContainer, TileLayer, Marker } from 'react-leaflet'
import { getActiveSession, clearActiveSession, addSession } from '../utils/storage'
import { notify } from '../utils/notifications'
import { formatDuration } from '../utils/pdf'
import { TILE_URL, TILE_ATTRIBUTION, parkIcon } from '../utils/map'
import PlateBadge from '../components/PlateBadge'
import { IconStop } from '../components/Icons'

export default function ActiveSession() {
  const navigate  = useNavigate()
  const [session, setSession]   = useState(null)
  const [elapsed, setElapsed]   = useState(0)
  const [stopping, setStopping] = useState(false)
  const intervalRef = useRef(null)

  useEffect(() => {
    const active = getActiveSession()
    if (!active) { navigate('/', { replace: true }); return }
    setSession(active)

    const startMs = new Date(active.startTime).getTime()
    setElapsed(Math.floor((Date.now() - startMs) / 1000))
    intervalRef.current = setInterval(() => {
      setElapsed(Math.floor((Date.now() - startMs) / 1000))
    }, 1000)

    return () => clearInterval(intervalRef.current)
  }, [])

  function handleStop() {
    setStopping(true)
    clearInterval(intervalRef.current)

    const startMs = new Date(session.startTime).getTime()
    const endMs = Date.now()
    const duration = Math.floor((endMs - startMs) / 1000)
    const completed = {
      ...session,
      id: startMs,
      endTime: new Date(endMs).toISOString(),
      duration,
    }

    clearActiveSession()
    addSession(completed)
    navigate('/', { replace: true })
    notify('Parkeren gestopt', `Duur: ${formatDuration(duration)}`)
  }

  if (!session) return null

  const startStr = new Date(session.startTime).toLocaleTimeString('nl-NL', {
    hour: '2-digit', minute: '2-digit',
  })

  const h   = Math.floor(elapsed / 3600)
  const m   = Math.floor((elapsed % 3600) / 60)
  const s   = elapsed % 60
  const pad = v => String(v).padStart(2, '0')
  const timerStr = `${pad(h)}:${pad(m)}:${pad(s)}`

  const parked = session.lat != null && session.lon != null

  return (
    <div className="screen screen-session">
      <div className="session-body">

        <div className="status-pill">
          <span className="pulse-dot" />
          <span>Actief parkeren</span>
        </div>

        <div className="session-timer">{timerStr}</div>
        <div className="session-since">Gestart om {startStr}</div>

        <PlateBadge plate={session.plate} large />

        {parked && (
          <div className="minimap">
            <MapContainer
              center={[session.lat, session.lon]}
              zoom={16}
              zoomControl={false}
              dragging={false}
              scrollWheelZoom={false}
              doubleClickZoom={false}
              touchZoom={false}
              keyboard={false}
            >
              <TileLayer url={TILE_URL} attribution={TILE_ATTRIBUTION} />
              <Marker position={[session.lat, session.lon]} icon={parkIcon} />
            </MapContainer>
            <span className="minimap-chip">Geparkeerd hier</span>
          </div>
        )}

        <div className="session-stop">
          <button
            className="btn btn-red"
            onClick={handleStop}
            disabled={stopping}
          >
            <IconStop size={16} />
            {stopping ? 'Stoppen…' : 'Stop parkeren'}
          </button>
        </div>

      </div>
    </div>
  )
}
