import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { MapContainer, TileLayer, Marker, useMap } from 'react-leaflet'
import { getProfile, getActiveSession, setActiveSession } from '../utils/storage'
import { requestPermission, notify } from '../utils/notifications'
import { TILE_URL, TILE_ATTRIBUTION, userIcon } from '../utils/map'
import BottomNav from '../components/BottomNav'
import PlateBadge from '../components/PlateBadge'
import { IconPlay } from '../components/Icons'

const DEFAULT_CENTER = [51.9225, 4.47917] // Rotterdam

function FlyToLocation({ position }) {
  const map = useMap()
  useEffect(() => {
    if (position) map.flyTo(position, 16, { duration: 1.2 })
  }, [position])
  return null
}

export default function Home() {
  const navigate = useNavigate()
  const [profile,  setProfile]  = useState(null)
  const [location, setLocation] = useState(null)
  const [starting, setStarting] = useState(false)

  useEffect(() => {
    const p = getProfile()
    if (!p) { navigate('/login', { replace: true }); return }
    if (getActiveSession()) { navigate('/session', { replace: true }); return }
    setProfile(p)

    navigator.geolocation?.getCurrentPosition(
      ({ coords }) => setLocation([coords.latitude, coords.longitude]),
      () => {}
    )
  }, [])

  async function handleStart() {
    setStarting(true)
    await requestPermission()
    setActiveSession({
      plate: profile.plate,
      startTime: new Date().toISOString(),
      lat: location?.[0] ?? null,
      lon: location?.[1] ?? null,
    })
    notify('Parkeren gestart', `Kenteken ${profile.plate}`)
    navigate('/session')
  }

  if (!profile) return null

  return (
    <div className="screen screen-home">
      <div className="map-full">
        <MapContainer
          center={DEFAULT_CENTER}
          zoom={13}
          zoomControl={false}
        >
          <TileLayer url={TILE_URL} attribution={TILE_ATTRIBUTION} />
          <FlyToLocation position={location} />
          {location && <Marker position={location} icon={userIcon} />}
        </MapContainer>
      </div>

      <div className="topbar">
        <div className="chip-logo"><span>P</span>ParkWise</div>
        <div className="avatar">{profile.name?.charAt(0).toUpperCase() || 'P'}</div>
      </div>

      <div className="sheet">
        <div className="sheet-handle" />
        <div className="vehicle-row">
          <div className="vehicle-id">
            <PlateBadge plate={profile.plate} />
            <div className="vehicle-meta">
              <span className="vehicle-label">Voertuig</span>
              <span className="vehicle-name">{profile.name}</span>
            </div>
          </div>
        </div>
        <button
          className="btn btn-yellow"
          onClick={handleStart}
          disabled={starting}
        >
          <IconPlay size={16} />
          {starting ? 'Bezig…' : 'Start parkeren'}
        </button>
        <BottomNav active="home" />
      </div>
    </div>
  )
}
