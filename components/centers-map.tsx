'use client'

import { useState } from 'react'
import { CENTERS, type EsportsCenter } from '@/lib/data'

interface CentersMapProps {
  onBook: (center: EsportsCenter) => void
  onMyPC: (center: EsportsCenter) => void
}

// District zone polygons — rough UB city layout as SVG paths (viewBox 0 0 800 500)
const DISTRICT_ZONES = [
  {
    id: 'СХД',
    label: 'Сонгинохайрхан',
    path: 'M0,80 L180,60 L200,200 L160,260 L80,280 L0,240 Z',
    fill: 'rgba(0,212,255,0.04)',
    stroke: 'rgba(0,212,255,0.12)',
  },
  {
    id: 'ЧД',
    label: 'Чингэлтэй',
    path: 'M180,60 L400,40 L420,180 L340,200 L200,200 Z',
    fill: 'rgba(255,45,120,0.04)',
    stroke: 'rgba(255,45,120,0.10)',
  },
  {
    id: 'СБД',
    label: 'Сүхбаатар',
    path: 'M400,40 L600,60 L580,200 L420,180 Z',
    fill: 'rgba(0,212,255,0.04)',
    stroke: 'rgba(0,212,255,0.12)',
  },
  {
    id: 'БЗД',
    label: 'Баянзүрх',
    path: 'M600,60 L800,80 L800,300 L620,280 L580,200 Z',
    fill: 'rgba(255,45,120,0.04)',
    stroke: 'rgba(255,45,120,0.10)',
  },
  {
    id: 'БГД',
    label: 'Баянгол',
    path: 'M160,260 L200,200 L340,200 L360,360 L240,400 L100,380 Z',
    fill: 'rgba(34,197,94,0.04)',
    stroke: 'rgba(34,197,94,0.10)',
  },
  {
    id: 'ХУД',
    label: 'Хан-Уул',
    path: 'M240,400 L360,360 L580,200 L620,280 L600,460 L360,500 L200,480 Z',
    fill: 'rgba(168,85,247,0.04)',
    stroke: 'rgba(168,85,247,0.10)',
  },
  {
    id: 'НД',
    label: 'Налайх',
    path: 'M620,280 L800,300 L800,440 L680,500 L600,460 Z',
    fill: 'rgba(234,179,8,0.04)',
    stroke: 'rgba(234,179,8,0.10)',
  },
]

// Road lines for visual effect
const ROADS = [
  'M0,170 Q400,155 800,170',
  'M0,230 Q400,215 800,230',
  'M200,0 Q210,250 220,500',
  'M380,0 Q390,250 400,500',
  'M590,0 Q600,250 610,500',
]

function StarRating({ rating }: { rating: number }) {
  return (
    <div className="flex items-center gap-0.5">
      {[1, 2, 3, 4, 5].map((i) => (
        <svg key={i} className="w-3 h-3" viewBox="0 0 12 12" fill={i <= Math.round(rating) ? '#f59e0b' : '#1e3a5f'}>
          <path d="M6 1l1.2 3.6H11L8 6.9l1.2 3.7L6 8.5 2.8 10.6 4 6.9 1 4.6h3.8z" />
        </svg>
      ))}
      <span className="text-xs text-muted-foreground ml-1">{rating}</span>
    </div>
  )
}

function CenterNode({
  center,
  onBook,
  onMyPC,
  svgWidth,
  svgHeight,
}: {
  center: EsportsCenter
  onBook: (c: EsportsCenter) => void
  onMyPC: (c: EsportsCenter) => void
  svgWidth: number
  svgHeight: number
}) {
  const [hovered, setHovered] = useState(false)

  // Convert percent to SVG coordinates
  const cx = (center.x / 100) * svgWidth
  const cy = (center.y / 100) * svgHeight

  function openDirections() {
    const query = encodeURIComponent(center.address + ', Улаанбаатар, Монгол')
    window.open(`https://www.google.com/maps/dir/?api=1&destination=${query}`, '_blank')
  }

  // Decide card offset: flip to left if too close to right edge, flip up if near bottom
  const cardX = cx > svgWidth * 0.65 ? cx - 260 - 12 : cx + 16
  const cardY = cy > svgHeight * 0.65 ? cy - 300 : cy - 8

  return (
    <g
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{ cursor: 'pointer' }}
    >
      {/* Outer ping ring */}
      <circle
        cx={cx}
        cy={cy}
        r={hovered ? 22 : 14}
        fill="none"
        stroke={center.color}
        strokeWidth="1"
        opacity={hovered ? 0.5 : 0.25}
        style={{ transition: 'r 0.3s ease, opacity 0.3s ease' }}
      />
      {/* Animated pulse ring */}
      <circle
        cx={cx}
        cy={cy}
        r="18"
        fill="none"
        stroke={center.color}
        strokeWidth="0.8"
        opacity="0.2"
      >
        <animate attributeName="r" from="10" to="26" dur="2.5s" repeatCount="indefinite" />
        <animate attributeName="opacity" from="0.4" to="0" dur="2.5s" repeatCount="indefinite" />
      </circle>

      {/* Core dot */}
      <circle
        cx={cx}
        cy={cy}
        r={hovered ? 9 : 6}
        fill={center.color}
        opacity="0.9"
        style={{
          transition: 'r 0.2s ease',
          filter: `drop-shadow(0 0 ${hovered ? 8 : 4}px ${center.color})`,
        }}
      />
      {/* Inner white dot */}
      <circle cx={cx} cy={cy} r="2" fill="white" opacity="0.9" />

      {/* Hover info card — rendered as foreignObject */}
      {hovered && (
        <foreignObject x={cardX} y={cardY} width="262" height="318">
          <div
            style={{
              background: 'rgba(5,16,30,0.98)',
              border: `1px solid ${center.color}55`,
              boxShadow: `0 0 28px ${center.color}30, 0 8px 32px rgba(0,0,0,0.8)`,
              borderRadius: '14px',
              overflow: 'hidden',
              fontFamily: 'inherit',
            }}
          >
            {/* Top accent bar */}
            <div style={{ height: '2px', background: center.color }} />

            {/* Header */}
            <div
              style={{
                padding: '10px 14px',
                borderBottom: `1px solid ${center.color}20`,
                display: 'flex',
                alignItems: 'flex-start',
                justifyContent: 'space-between',
                gap: '8px',
              }}
            >
              <div>
                <div
                  style={{
                    fontFamily: 'var(--font-heading)',
                    fontWeight: 800,
                    fontSize: '13px',
                    color: '#e2f4ff',
                    lineHeight: 1.2,
                    marginBottom: '2px',
                  }}
                >
                  {center.name}
                </div>
                <div style={{ fontSize: '11px', color: '#4a7fa5' }}>{center.district} дүүрэг</div>
              </div>
              <div
                style={{
                  background: `${center.color}20`,
                  border: `1px solid ${center.color}35`,
                  color: center.color,
                  fontFamily: 'var(--font-heading)',
                  fontWeight: 800,
                  fontSize: '11px',
                  padding: '2px 7px',
                  borderRadius: '6px',
                  whiteSpace: 'nowrap',
                }}
              >
                {center.pcCount} PC
              </div>
            </div>

            {/* Body */}
            <div style={{ padding: '10px 14px', display: 'flex', flexDirection: 'column', gap: '7px' }}>
              {/* Address */}
              <div style={{ display: 'flex', gap: '6px', alignItems: 'flex-start' }}>
                <svg style={{ width: 12, height: 12, flexShrink: 0, marginTop: 2, color: '#4a7fa5' }} viewBox="0 0 16 16" fill="currentColor">
                  <path d="M8 0C5.2 0 3 2.2 3 5c0 3.9 5 11 5 11s5-7.1 5-11c0-2.8-2.2-5-5-5zm0 7a2 2 0 1 1 0-4 2 2 0 0 1 0 4z" />
                </svg>
                <span style={{ fontSize: '11px', color: '#4a7fa5', lineHeight: 1.4 }}>{center.address}</span>
              </div>
              {/* Hours */}
              <div style={{ display: 'flex', gap: '6px', alignItems: 'center' }}>
                <svg style={{ width: 12, height: 12, flexShrink: 0, color: '#4a7fa5' }} viewBox="0 0 16 16" fill="currentColor">
                  <path d="M8 0a8 8 0 1 0 0 16A8 8 0 0 0 8 0zm.5 11.5h-1v-5h1v5zm0-6.5h-1v-1h1v1z" />
                </svg>
                <span style={{ fontSize: '11px', color: '#4a7fa5' }}>{center.openHours}</span>
              </div>
              {/* Rating */}
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <div style={{ display: 'flex', gap: 2 }}>
                  {[1,2,3,4,5].map(i => (
                    <svg key={i} style={{ width: 11, height: 11 }} viewBox="0 0 12 12" fill={i <= Math.round(center.rating) ? '#f59e0b' : '#1e3a5f'}>
                      <path d="M6 1l1.2 3.6H11L8 6.9l1.2 3.7L6 8.5 2.8 10.6 4 6.9 1 4.6h3.8z" />
                    </svg>
                  ))}
                  <span style={{ fontSize: '11px', color: '#4a7fa5', marginLeft: 3 }}>{center.rating}</span>
                </div>
                <span style={{ fontSize: '10px', color: '#3a5f7a' }}>({center.reviewCount})</span>
              </div>
              {/* Amenities */}
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 4 }}>
                {center.amenities.slice(0, 3).map(a => (
                  <span
                    key={a}
                    style={{
                      fontSize: '10px',
                      padding: '2px 6px',
                      borderRadius: '4px',
                      background: 'rgba(255,255,255,0.06)',
                      color: '#4a7fa5',
                      border: '1px solid rgba(255,255,255,0.08)',
                    }}
                  >
                    {a}
                  </span>
                ))}
              </div>
              {/* Price */}
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingTop: 2 }}>
                <span style={{ fontFamily: 'var(--font-heading)', fontWeight: 900, fontSize: '18px', color: center.color }}>
                  ₮{center.pricePerHour.toLocaleString()}
                  <span style={{ fontSize: '11px', fontWeight: 400, color: '#4a7fa5' }}>/цаг</span>
                </span>
              </div>
            </div>

            {/* Action buttons */}
            <div style={{ padding: '0 14px 6px', display: 'flex', gap: 6 }}>
              <button
                onClick={(e) => { e.stopPropagation(); onBook(center) }}
                style={{
                  flex: 1,
                  padding: '8px 0',
                  borderRadius: '8px',
                  background: center.color,
                  color: '#05101e',
                  fontFamily: 'var(--font-heading)',
                  fontWeight: 800,
                  fontSize: '11px',
                  letterSpacing: '0.08em',
                  border: 'none',
                  cursor: 'pointer',
                  boxShadow: `0 0 12px ${center.color}50`,
                }}
              >
                ЗАХИАЛАХ
              </button>
              <button
                onClick={(e) => { e.stopPropagation(); openDirections() }}
                style={{
                  padding: '8px 10px',
                  borderRadius: '8px',
                  background: 'transparent',
                  color: center.color,
                  border: `1px solid ${center.color}45`,
                  fontSize: '11px',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 3,
                }}
              >
                <svg style={{ width: 11, height: 11 }} viewBox="0 0 16 16" fill="currentColor">
                  <path d="M8 0L3 6h3v4h4V6h3L8 0zM3 10h10v2H3v-2z" />
                </svg>
                Зам
              </button>
            </div>
            {/* My PC button */}
            <div style={{ padding: '0 14px 12px' }}>
              <button
                onClick={(e) => { e.stopPropagation(); onMyPC(center) }}
                style={{
                  width: '100%',
                  padding: '7px 0',
                  borderRadius: '8px',
                  background: 'transparent',
                  color: center.color,
                  border: `1px solid ${center.color}35`,
                  fontFamily: 'var(--font-heading)',
                  fontWeight: 700,
                  fontSize: '10px',
                  letterSpacing: '0.06em',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: 5,
                }}
              >
                <svg style={{ width: 11, height: 11 }} viewBox="0 0 16 16" fill="currentColor">
                  <path d="M1 3a1 1 0 0 1 1-1h12a1 1 0 0 1 1 1v7a1 1 0 0 1-1 1H9v1h2v1H5v-1h2v-1H2a1 1 0 0 1-1-1V3zm1 0v7h12V3H2z"/>
                </svg>
                МИНИЙ PC ОРУУЛАХ
              </button>
            </div>
          </div>
        </foreignObject>
      )}
    </g>
  )
}

export function CentersMap({ onBook, onMyPC }: CentersMapProps) {
  const [search, setSearch] = useState('')
  const [selectedDistrict, setSelectedDistrict] = useState<string>('All')
  const [listView, setListView] = useState(false)
  const [hoveredDistrict, setHoveredDistrict] = useState<string | null>(null)

  const SVG_W = 800
  const SVG_H = 500

  const districts = ['All', ...Array.from(new Set(CENTERS.map((c) => c.district)))]
  const filtered = CENTERS.filter((c) => {
    const matchSearch =
      search === '' ||
      c.name.toLowerCase().includes(search.toLowerCase()) ||
      c.district.toLowerCase().includes(search.toLowerCase())
    const matchDistrict = selectedDistrict === 'All' || c.district === selectedDistrict
    return matchSearch && matchDistrict
  })

  return (
    <section id="centers" className="py-24 px-4 sm:px-6 max-w-7xl mx-auto">
      {/* Section header */}
      <div className="mb-8">
        <p className="text-xs text-neon-cyan uppercase tracking-widest mb-2 font-mono">
          // ESPORTS CENTERS
        </p>
        <h2
          className="text-3xl sm:text-4xl font-black text-foreground mb-4"
          style={{ fontFamily: 'var(--font-heading)' }}
        >
          ЗАЛ <span className="neon-text-magenta">ХАЙХ</span>
        </h2>
        <p className="text-muted-foreground max-w-xl">
          Улаанбаатар хотын шилдэг eSports залуудыг газрын зурган дээр харж захиалга өгнө үү.
        </p>
      </div>

      {/* Search + filter row */}
      <div className="flex flex-col sm:flex-row gap-3 mb-6 flex-wrap">
        <div className="relative flex-1 max-w-md">
          <svg
            className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground"
            viewBox="0 0 16 16"
            fill="currentColor"
          >
            <path d="M11.7 10.3a6 6 0 1 0-1.4 1.4l3.3 3.3 1.4-1.4-3.3-3.3zm-5.7 1a4 4 0 1 1 0-8 4 4 0 0 1 0 8z" />
          </svg>
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Зал нэр, дүүрэг хайх..."
            className="w-full pl-9 pr-4 py-2.5 bg-input border border-border rounded-lg text-sm text-foreground placeholder-muted-foreground focus:outline-none focus:border-neon-cyan focus:ring-1 focus:ring-neon-cyan transition-colors"
          />
        </div>

        <div className="flex gap-2 flex-wrap">
          {districts.map((d) => (
            <button
              key={d}
              onClick={() => setSelectedDistrict(d)}
              className={`px-3 py-2 text-xs rounded-lg border transition-all duration-200 ${
                selectedDistrict === d
                  ? 'bg-neon-cyan text-background border-neon-cyan font-bold'
                  : 'border-border text-muted-foreground hover:border-neon-cyan hover:text-neon-cyan'
              }`}
            >
              {d}
            </button>
          ))}
        </div>

        <button
          onClick={() => setListView(!listView)}
          className="px-3 py-2 text-xs rounded-lg border border-border text-muted-foreground hover:border-neon-cyan hover:text-neon-cyan transition-all duration-200 ml-auto shrink-0"
        >
          {listView ? 'Газрын зураг' : 'Жагсаалт'}
        </button>
      </div>

      {listView ? (
        /* List view */
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered.map((center) => (
            <div
              key={center.id}
              className="glass-card rounded-xl p-5 relative border transition-all duration-300 group"
              style={{ borderColor: `${center.color}25` }}
            >
              <div className="flex items-start justify-between mb-3">
                <div>
                  <h3
                    className="font-bold text-foreground text-sm"
                    style={{ fontFamily: 'var(--font-heading)' }}
                  >
                    {center.name}
                  </h3>
                  <p className="text-xs text-muted-foreground">{center.district}</p>
                </div>
                <span
                  className="text-xs font-bold px-2 py-1 rounded shrink-0"
                  style={{
                    background: `${center.color}20`,
                    color: center.color,
                    border: `1px solid ${center.color}30`,
                    fontFamily: 'var(--font-heading)',
                  }}
                >
                  {center.pcCount} PC
                </span>
              </div>

              <div className="flex flex-col gap-1.5 text-xs text-muted-foreground mb-4">
                <span>{center.address}</span>
                <span>{center.openHours}</span>
                <div className="flex items-center justify-between">
                  <StarRating rating={center.rating} />
                  <span>({center.reviewCount} үнэлгээ)</span>
                </div>
              </div>

              <div className="flex flex-col gap-2">
                <div className="flex gap-2">
                  <button
                    onClick={() => onBook(center)}
                    className="flex-1 py-2 rounded-lg text-xs font-bold text-background transition-all duration-200"
                    style={{
                      background: center.color,
                      boxShadow: `0 0 10px ${center.color}50`,
                      fontFamily: 'var(--font-heading)',
                    }}
                  >
                    ЗАХИАЛАХ
                  </button>
                  <button
                    onClick={() =>
                      window.open(
                        `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(center.address + ', Улаанбаатар')}`,
                        '_blank'
                      )
                    }
                    className="px-3 py-2 rounded-lg text-xs border transition-all duration-200 hover:bg-muted flex items-center gap-1.5"
                    style={{ borderColor: `${center.color}40`, color: center.color }}
                  >
                    <svg className="w-3 h-3" viewBox="0 0 16 16" fill="currentColor">
                      <path d="M8 0L3 6h3v4h4V6h3L8 0zM3 10h10v2H3v-2z" />
                    </svg>
                    Зам авах
                  </button>
                </div>
                <button
                  onClick={() => onMyPC(center)}
                  className="w-full py-2 rounded-lg text-xs font-bold border transition-all duration-200 hover:bg-muted flex items-center justify-center gap-1.5"
                  style={{ borderColor: `${center.color}30`, color: center.color }}
                >
                  <svg className="w-3 h-3" viewBox="0 0 16 16" fill="currentColor">
                    <path d="M1 3a1 1 0 0 1 1-1h12a1 1 0 0 1 1 1v7a1 1 0 0 1-1 1H9v1h2v1H5v-1h2v-1H2a1 1 0 0 1-1-1V3zm1 0v7h12V3H2z"/>
                  </svg>
                  МИНИЙ PC ОРУУЛАХ
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        /* Map view */
        <div
          className="relative w-full rounded-2xl overflow-hidden border border-border"
          style={{ aspectRatio: '16/8' }}
        >
          <svg
            viewBox={`0 0 ${SVG_W} ${SVG_H}`}
            className="absolute inset-0 w-full h-full"
            style={{ background: 'rgba(2,9,19,0.97)' }}
          >
            {/* Fine dot grid */}
            <defs>
              <pattern id="dotgrid" x="0" y="0" width="20" height="20" patternUnits="userSpaceOnUse">
                <circle cx="1" cy="1" r="0.6" fill="rgba(0,212,255,0.12)" />
              </pattern>
              <pattern id="gridlines" x="0" y="0" width="80" height="80" patternUnits="userSpaceOnUse">
                <path d="M 80 0 L 0 0 0 80" fill="none" stroke="rgba(0,212,255,0.05)" strokeWidth="0.5" />
              </pattern>
              <filter id="glow">
                <feGaussianBlur stdDeviation="2" result="blur" />
                <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
              </filter>
            </defs>

            <rect width={SVG_W} height={SVG_H} fill="url(#dotgrid)" />
            <rect width={SVG_W} height={SVG_H} fill="url(#gridlines)" />

            {/* Radial ambient glow center */}
            <radialGradient id="ambientGlow" cx="50%" cy="50%" r="55%">
              <stop offset="0%" stopColor="rgba(0,212,255,0.05)" />
              <stop offset="100%" stopColor="transparent" />
            </radialGradient>
            <rect width={SVG_W} height={SVG_H} fill="url(#ambientGlow)" />

            {/* District zones */}
            {DISTRICT_ZONES.map((zone) => (
              <g key={zone.id}>
                <path
                  d={zone.path}
                  fill={
                    hoveredDistrict === zone.id
                      ? zone.fill.replace('0.04', '0.10')
                      : selectedDistrict === zone.label.slice(0, 3) || selectedDistrict === zone.label
                        ? zone.fill.replace('0.04', '0.08')
                        : zone.fill
                  }
                  stroke={zone.stroke}
                  strokeWidth="1"
                  style={{ transition: 'fill 0.2s ease' }}
                  onMouseEnter={() => setHoveredDistrict(zone.id)}
                  onMouseLeave={() => setHoveredDistrict(null)}
                />
              </g>
            ))}

            {/* Road lines */}
            {ROADS.map((d, i) => (
              <path
                key={i}
                d={d}
                fill="none"
                stroke="rgba(0,212,255,0.08)"
                strokeWidth={i < 2 ? '2.5' : '1.5'}
                strokeDasharray={i < 2 ? 'none' : '6,4'}
              />
            ))}

            {/* District labels */}
            {[
              { x: 72, y: 175, label: 'СХД' },
              { x: 265, y: 115, label: 'ЧД' },
              { x: 480, y: 110, label: 'СБД' },
              { x: 670, y: 140, label: 'БЗД' },
              { x: 230, y: 310, label: 'БГД' },
              { x: 460, y: 400, label: 'ХУД' },
              { x: 700, y: 370, label: 'НД' },
            ].map((d) => (
              <text
                key={d.label}
                x={d.x}
                y={d.y}
                textAnchor="middle"
                fill="rgba(0,212,255,0.18)"
                fontSize="11"
                fontWeight="700"
                letterSpacing="2"
                style={{ fontFamily: 'var(--font-heading)', userSelect: 'none' }}
              >
                {d.label}
              </text>
            ))}

            {/* City label top-left */}
            <text
              x="14"
              y="20"
              fill="rgba(0,212,255,0.35)"
              fontSize="9"
              letterSpacing="3"
              style={{ fontFamily: 'var(--font-heading)', userSelect: 'none' }}
            >
              УЛААНБААТАР / ULAANBAATAR
            </text>

            {/* Center nodes — render last so hover cards appear on top */}
            {filtered.map((center) => (
              <CenterNode
                key={center.id}
                center={center}
                onBook={onBook}
                onMyPC={onMyPC}
                svgWidth={SVG_W}
                svgHeight={SVG_H}
              />
            ))}

            {/* Legend bottom-right */}
            <g transform={`translate(${SVG_W - 110}, ${SVG_H - 34})`}>
              <rect width="106" height="26" rx="6" fill="rgba(5,16,30,0.85)" stroke="rgba(0,212,255,0.15)" strokeWidth="0.8" />
              <circle cx="14" cy="13" r="4" fill="rgba(0,212,255,0.7)">
                <animate attributeName="opacity" values="0.7;0.3;0.7" dur="2s" repeatCount="indefinite" />
              </circle>
              <text x="24" y="17" fill="rgba(0,212,255,0.55)" fontSize="9" letterSpacing="1" style={{ fontFamily: 'var(--font-heading)' }}>
                {filtered.length} ЗАЛ ОЛДЛОО
              </text>
            </g>
          </svg>
        </div>
      )}
    </section>
  )
}
