'use client'

import { useState } from 'react'
import { CENTERS } from '@/lib/data'

interface MyPCModalProps {
  onClose: () => void
}

const GPU_OPTIONS = [
  'RTX 4090', 'RTX 4080 Super', 'RTX 4080', 'RTX 4070 Ti Super',
  'RTX 4070 Ti', 'RTX 4070 Super', 'RTX 4070', 'RTX 4060 Ti',
  'RTX 3090', 'RTX 3080 Ti', 'RTX 3080', 'RTX 3070',
  'RX 7900 XTX', 'RX 7900 XT', 'RX 7800 XT', 'RX 6800 XT', 'Бусад',
]
const CPU_OPTIONS = [
  'Intel Core i9-14900K', 'Intel Core i9-14900KF', 'Intel Core i7-14700K',
  'Intel Core i7-13700K', 'Intel Core i5-14600K', 'Intel Core i5-13600K',
  'AMD Ryzen 9 7950X', 'AMD Ryzen 9 7900X', 'AMD Ryzen 7 7800X3D',
  'AMD Ryzen 7 7700X', 'AMD Ryzen 5 7600X', 'Бусад',
]
const RAM_OPTIONS = ['8GB DDR4', '16GB DDR4', '32GB DDR4', '16GB DDR5', '32GB DDR5', '64GB DDR5']
const MONITOR_OPTIONS = [
  '1080p 60Hz', '1080p 144Hz', '1080p 165Hz', '1080p 240Hz',
  '1440p 144Hz', '1440p 165Hz', '1440p 240Hz', '4K 60Hz', '4K 144Hz',
]
const PERIPHERAL_OPTIONS = [
  'Механик гар', 'Membrane гар', 'Оптик хулгана', 'Laser хулгана',
  'Headset', 'Mousepad XL', 'RGB тохиргоо',
]

const ACCENT = '#00d4ff'

export function MyPCModal({ onClose }: MyPCModalProps) {
  const [step, setStep] = useState<'form' | 'success'>('form')

  // PC specs
  const [gpu, setGpu] = useState('')
  const [cpu, setCpu] = useState('')
  const [ram, setRam] = useState('')
  const [monitor, setMonitor] = useState('')
  const [peripherals, setPeripherals] = useState<string[]>([])
  const [notes, setNotes] = useState('')

  // Owner info
  const [ownerName, setOwnerName] = useState('')
  const [ownerPhone, setOwnerPhone] = useState('')
  const [centerId, setCenterId] = useState('')
  const [pricePerHour, setPricePerHour] = useState('')

  function togglePeripheral(p: string) {
    setPeripherals((prev) =>
      prev.includes(p) ? prev.filter((x) => x !== p) : [...prev, p]
    )
  }

  const canSubmit = gpu && cpu && ownerName && ownerPhone && centerId

  const selectedCenter = CENTERS.find((c) => c.id === centerId)

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-background/80 backdrop-blur-sm">
      <div
        className="relative w-full max-w-lg mx-2 sm:mx-0 rounded-t-2xl sm:rounded-2xl overflow-hidden float-in"
        style={{
          background: 'rgba(7,21,37,0.98)',
          border: `1px solid ${ACCENT}40`,
          boxShadow: `0 0 40px ${ACCENT}18`,
          maxHeight: '92vh',
          display: 'flex',
          flexDirection: 'column',
        }}
      >
        {/* Top accent */}
        <div className="h-0.5 w-full shrink-0" style={{ background: ACCENT }} />

        {/* Header */}
        <div
          className="flex items-center justify-between px-6 py-4 border-b shrink-0"
          style={{ borderColor: `${ACCENT}20` }}
        >
          <div>
            <h2
              className="font-black text-lg"
              style={{ fontFamily: 'var(--font-heading)', color: ACCENT }}
            >
              PC БҮРТГҮҮЛЭХ
            </h2>
            <p className="text-xs text-muted-foreground mt-0.5">
              Өөрийн PC-г залд байрлуулж орлого олоорой
            </p>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 flex items-center justify-center rounded-lg border border-border text-muted-foreground hover:text-foreground hover:border-foreground transition-colors shrink-0"
            aria-label="Хаах"
          >
            ✕
          </button>
        </div>

        {step === 'success' ? (
          /* Success */
          <div className="px-6 py-10 flex flex-col items-center gap-5 text-center">
            <div
              className="w-20 h-20 rounded-full flex items-center justify-center"
              style={{
                background: `${ACCENT}15`,
                border: `2px solid ${ACCENT}`,
                boxShadow: `0 0 30px ${ACCENT}40`,
              }}
            >
              <svg className="w-10 h-10" viewBox="0 0 24 24" fill="none" stroke={ACCENT} strokeWidth="2.5">
                <path d="M20 6L9 17l-5-5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </div>
            <div>
              <h3
                className="text-xl font-black mb-2"
                style={{ color: ACCENT, fontFamily: 'var(--font-heading)' }}
              >
                АМЖИЛТТАЙ БҮРТГЭГДЛЭЭ!
              </h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Таны PC{' '}
                <span className="text-foreground font-semibold">{selectedCenter?.name}</span>-д
                бүртгэгдлээ. Залын ажилтан хянаж 24 цагт баталгаажуулна.
              </p>
            </div>
            <button
              onClick={onClose}
              className="w-full py-3 rounded-xl font-black text-background"
              style={{ background: ACCENT, fontFamily: 'var(--font-heading)' }}
            >
              ХААХ
            </button>
          </div>
        ) : (
          /* Form */
          <div className="overflow-y-auto flex-1 px-6 py-5 flex flex-col gap-5">

            {/* Section: Зал сонгох */}
            <div className="flex flex-col gap-3">
              <SectionLabel label="Зал сонгох" accent={ACCENT} />
              <select
                value={centerId}
                onChange={(e) => setCenterId(e.target.value)}
                className="bg-input border border-border rounded-lg px-3 py-2.5 text-sm text-foreground focus:outline-none focus:border-neon-cyan transition-colors"
              >
                <option value="">Зал сонгох...</option>
                {CENTERS.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name} — {c.district}
                  </option>
                ))}
              </select>
              {selectedCenter && (
                <div
                  className="flex items-center gap-2 px-3 py-2 rounded-lg text-xs"
                  style={{ background: `${selectedCenter.color}08`, border: `1px solid ${selectedCenter.color}25` }}
                >
                  <span className="w-2 h-2 rounded-full shrink-0" style={{ background: selectedCenter.color }} />
                  <span className="text-muted-foreground">{selectedCenter.address}</span>
                  <span className="ml-auto font-semibold" style={{ color: selectedCenter.color }}>
                    {selectedCenter.pcCount} PC · {selectedCenter.district}
                  </span>
                </div>
              )}
            </div>

            {/* Section: Эзний мэдээлэл */}
            <div className="flex flex-col gap-3">
              <SectionLabel label="Эзний мэдээлэл" accent={ACCENT} />
              <div className="grid grid-cols-2 gap-3">
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs text-muted-foreground uppercase tracking-widest">Нэр</label>
                  <input
                    type="text"
                    value={ownerName}
                    onChange={(e) => setOwnerName(e.target.value)}
                    placeholder="Овог Нэр"
                    className="bg-input border border-border rounded-lg px-3 py-2.5 text-sm text-foreground placeholder-muted-foreground focus:outline-none focus:border-neon-cyan transition-colors"
                  />
                </div>
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs text-muted-foreground uppercase tracking-widest">Утас</label>
                  <input
                    type="tel"
                    value={ownerPhone}
                    onChange={(e) => setOwnerPhone(e.target.value)}
                    placeholder="9900-0000"
                    className="bg-input border border-border rounded-lg px-3 py-2.5 text-sm text-foreground placeholder-muted-foreground focus:outline-none focus:border-neon-cyan transition-colors"
                  />
                </div>
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="text-xs text-muted-foreground uppercase tracking-widest">Цагийн үнэ (₮)</label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm text-muted-foreground">₮</span>
                  <input
                    type="number"
                    value={pricePerHour}
                    onChange={(e) => setPricePerHour(e.target.value)}
                    placeholder="1500"
                    min={0}
                    className="bg-input border border-border rounded-lg pl-7 pr-3 py-2.5 text-sm text-foreground placeholder-muted-foreground focus:outline-none focus:border-neon-cyan transition-colors w-full"
                  />
                </div>
                <p className="text-[11px] text-muted-foreground">Тоглогч нэг цагт хичнээн төлөхийг тохироорой</p>
              </div>
            </div>

            {/* Section: PC тохиргоо */}
            <div className="flex flex-col gap-3">
              <SectionLabel label="PC тохиргоо" accent={ACCENT} />

              <div className="flex flex-col gap-1.5">
                <label className="text-xs text-muted-foreground uppercase tracking-widest">Видео карт (GPU) *</label>
                <select
                  value={gpu}
                  onChange={(e) => setGpu(e.target.value)}
                  className="bg-input border border-border rounded-lg px-3 py-2.5 text-sm text-foreground focus:outline-none focus:border-neon-cyan transition-colors"
                >
                  <option value="">Сонгох...</option>
                  {GPU_OPTIONS.map((g) => <option key={g} value={g}>{g}</option>)}
                </select>
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-xs text-muted-foreground uppercase tracking-widest">Процессор (CPU) *</label>
                <select
                  value={cpu}
                  onChange={(e) => setCpu(e.target.value)}
                  className="bg-input border border-border rounded-lg px-3 py-2.5 text-sm text-foreground focus:outline-none focus:border-neon-cyan transition-colors"
                >
                  <option value="">Сонгох...</option>
                  {CPU_OPTIONS.map((c) => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs text-muted-foreground uppercase tracking-widest">RAM</label>
                  <select
                    value={ram}
                    onChange={(e) => setRam(e.target.value)}
                    className="bg-input border border-border rounded-lg px-3 py-2.5 text-sm text-foreground focus:outline-none focus:border-neon-cyan transition-colors"
                  >
                    <option value="">Сонгох...</option>
                    {RAM_OPTIONS.map((r) => <option key={r} value={r}>{r}</option>)}
                  </select>
                </div>
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs text-muted-foreground uppercase tracking-widest">Монитор</label>
                  <select
                    value={monitor}
                    onChange={(e) => setMonitor(e.target.value)}
                    className="bg-input border border-border rounded-lg px-3 py-2.5 text-sm text-foreground focus:outline-none focus:border-neon-cyan transition-colors"
                  >
                    <option value="">Сонгох...</option>
                    {MONITOR_OPTIONS.map((m) => <option key={m} value={m}>{m}</option>)}
                  </select>
                </div>
              </div>

              {/* Peripherals */}
              <div className="flex flex-col gap-2">
                <label className="text-xs text-muted-foreground uppercase tracking-widest">Тоног төхөөрөмж</label>
                <div className="flex flex-wrap gap-2">
                  {PERIPHERAL_OPTIONS.map((p) => (
                    <button
                      key={p}
                      type="button"
                      onClick={() => togglePeripheral(p)}
                      className="px-3 py-1.5 text-xs rounded-lg border transition-all duration-150 font-medium"
                      style={
                        peripherals.includes(p)
                          ? { background: `${ACCENT}20`, borderColor: ACCENT, color: ACCENT }
                          : { background: 'transparent', borderColor: 'rgba(255,255,255,0.1)', color: '#4a7fa5' }
                      }
                    >
                      {p}
                    </button>
                  ))}
                </div>
              </div>

              {/* Notes */}
              <div className="flex flex-col gap-1.5">
                <label className="text-xs text-muted-foreground uppercase tracking-widest">Нэмэлт тэмдэглэл</label>
                <textarea
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="Тусгай тохиргоо, хүсэлт..."
                  rows={2}
                  className="bg-input border border-border rounded-lg px-4 py-3 text-sm text-foreground placeholder-muted-foreground focus:outline-none focus:border-neon-cyan transition-colors resize-none leading-relaxed"
                />
              </div>
            </div>

            {/* Spec preview */}
            {(gpu || cpu) && (
              <div
                className="rounded-xl px-4 py-3 flex flex-col gap-1.5"
                style={{ background: `${ACCENT}08`, border: `1px solid ${ACCENT}20` }}
              >
                <p className="text-xs text-muted-foreground uppercase tracking-widest mb-1">Таны PC тохиргоо</p>
                {gpu && <SpecRow label="GPU" value={gpu} />}
                {cpu && <SpecRow label="CPU" value={cpu} />}
                {ram && <SpecRow label="RAM" value={ram} />}
                {monitor && <SpecRow label="Монитор" value={monitor} />}
                {peripherals.length > 0 && <SpecRow label="Тоног" value={peripherals.join(', ')} />}
                {pricePerHour && <SpecRow label="Цагийн үнэ" value={`₮${Number(pricePerHour).toLocaleString()}`} />}
              </div>
            )}

            {/* Submit */}
            <button
              onClick={() => setStep('success')}
              disabled={!canSubmit}
              className="w-full py-3 rounded-xl font-black text-background tracking-widest transition-all duration-200 disabled:opacity-40 disabled:cursor-not-allowed shrink-0"
              style={{
                background: ACCENT,
                boxShadow: canSubmit ? `0 0 20px ${ACCENT}50` : 'none',
                fontFamily: 'var(--font-heading)',
              }}
            >
              {!canSubmit ? 'ШААРДЛАГАТАЙ ТАЛБАРЫГ БӨГЛӨНӨ ҮҮ' : 'БҮРТГҮҮЛЭХ'}
            </button>

            <p className="text-[11px] text-muted-foreground text-center pb-1">
              * тэмдэглэсэн талбарыг заавал бөглөнө үү
            </p>
          </div>
        )}
      </div>
    </div>
  )
}

function SectionLabel({ label, accent }: { label: string; accent: string }) {
  return (
    <div className="flex items-center gap-2">
      <span className="w-1 h-3.5 rounded-full shrink-0" style={{ background: accent }} />
      <span
        className="text-xs font-bold uppercase tracking-widest"
        style={{ color: accent, fontFamily: 'var(--font-heading)' }}
      >
        {label}
      </span>
    </div>
  )
}

function SpecRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-start gap-2 text-xs">
      <span className="text-muted-foreground w-20 shrink-0">{label}</span>
      <span className="text-neon-cyan font-medium">{value}</span>
    </div>
  )
}
