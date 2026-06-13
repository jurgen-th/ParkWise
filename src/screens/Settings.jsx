import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { getProfile, saveProfile, clearAllData } from '../utils/storage'
import BottomNav from '../components/BottomNav'
import { IconUser, IconMail } from '../components/Icons'

export default function Settings() {
  const navigate = useNavigate()
  const [name,  setName]  = useState('')
  const [email, setEmail] = useState('')
  const [plate, setPlate] = useState('')
  const [saved, setSaved] = useState(false)

  useEffect(() => {
    const p = getProfile()
    if (!p) { navigate('/login', { replace: true }); return }
    setName(p.name)
    setEmail(p.email || '')
    setPlate(p.plate)
  }, [])

  function handleSave() {
    if (!name.trim() || !plate.trim()) return
    const profile = { name: name.trim(), plate: plate.trim().toUpperCase() }
    if (email.trim()) profile.email = email.trim()
    saveProfile(profile)
    setSaved(true)
    setTimeout(() => setSaved(false), 2000)
  }

  function handleClear() {
    if (!window.confirm('Weet je zeker dat je alle data wilt verwijderen? Dit kan niet ongedaan worden gemaakt.')) return
    clearAllData()
    navigate('/login', { replace: true })
  }

  return (
    <div className="screen">
      <header className="page-head">
        <h1>Instellingen</h1>
      </header>

      <div className="content">

        <div className="card">
          <h2 className="card-title">Profiel</h2>

          <div className="form-group">
            <label>Naam</label>
            <div className="input-row">
              <IconUser size={17} />
              <input
                value={name}
                onChange={e => { setName(e.target.value); setSaved(false) }}
                placeholder="Je naam"
                autoComplete="name"
              />
            </div>
          </div>

          <div className="form-group">
            <label>E-mailadres</label>
            <div className="input-row">
              <IconMail size={17} />
              <input
                type="email"
                value={email}
                onChange={e => { setEmail(e.target.value); setSaved(false) }}
                placeholder="E-mailadres (optioneel)"
                autoComplete="email"
              />
            </div>
          </div>

          <div className="form-group">
            <label>Kenteken</label>
            <div className="input-row input-plate">
              <span className="plate-strip">NL</span>
              <input
                value={plate}
                onChange={e => { setPlate(e.target.value.toUpperCase()); setSaved(false) }}
                placeholder="AB-123-C"
                autoCapitalize="characters"
                autoComplete="off"
              />
            </div>
          </div>

          <button className="btn btn-yellow" onClick={handleSave}>
            {saved ? '✓  Opgeslagen' : 'Opslaan'}
          </button>
        </div>

        <div className="card card-danger">
          <h2 className="card-title">Gegevens</h2>
          <p className="card-desc">Verwijdert je profiel, kenteken en alle parkeergeschiedenis.</p>
          <button className="btn-red-outline" onClick={handleClear}>
            Verwijder alle data
          </button>
        </div>

      </div>

      <BottomNav active="settings" />
    </div>
  )
}
