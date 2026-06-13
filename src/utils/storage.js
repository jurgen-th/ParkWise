const PROFILE_KEY = 'pw_profile'
const SESSIONS_KEY = 'pw_sessions'
const ACTIVE_KEY = 'pw_active'

function read(key, fallback) {
  try {
    const raw = localStorage.getItem(key)
    return raw ? JSON.parse(raw) : fallback
  } catch {
    return fallback
  }
}

export function getProfile() {
  return read(PROFILE_KEY, null)
}

export function saveProfile(profile) {
  localStorage.setItem(PROFILE_KEY, JSON.stringify(profile))
}

export function getSessions() {
  return read(SESSIONS_KEY, [])
}

export function addSession(session) {
  const sessions = getSessions()
  sessions.unshift(session)
  if (sessions.length > 30) sessions.pop()
  localStorage.setItem(SESSIONS_KEY, JSON.stringify(sessions))
}

export function getActiveSession() {
  return read(ACTIVE_KEY, null)
}

export function setActiveSession(session) {
  localStorage.setItem(ACTIVE_KEY, JSON.stringify(session))
}

export function clearActiveSession() {
  localStorage.removeItem(ACTIVE_KEY)
}

export function clearAllData() {
  localStorage.removeItem(PROFILE_KEY)
  localStorage.removeItem(SESSIONS_KEY)
  localStorage.removeItem(ACTIVE_KEY)
}
