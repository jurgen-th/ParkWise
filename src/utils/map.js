import L from 'leaflet'

export const TILE_URL = 'https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png'
export const TILE_ATTRIBUTION = '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> &copy; <a href="https://carto.com/attributions">CARTO</a>'

export const userIcon = L.divIcon({
  className: '',
  html: `<div class="user-dot"><span></span></div>`,
  iconSize: [44, 44],
  iconAnchor: [22, 22],
})

export const parkIcon = L.divIcon({
  className: '',
  html: `<div class="park-pin">P<i></i></div>`,
  iconSize: [30, 38],
  iconAnchor: [15, 38],
})
