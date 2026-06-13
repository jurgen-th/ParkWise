export default function PlateBadge({ plate, large }) {
  return (
    <span className={`plate${large ? ' plate-lg' : ''}`}>
      <span className="plate-nl">NL</span>
      <span className="plate-num">{plate || '—'}</span>
    </span>
  )
}
