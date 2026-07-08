import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { useSpeechRecognition } from '../../lib/speech/useSpeechRecognition'
import { parseVoiceBillText } from '../../lib/billing/parseVoiceBill'
import { useSettingsStore } from '../../store/useSettingsStore'
import { db } from '../../lib/db/db'
import type { BillType, LineItem } from '../../types/billing'

const SPEECH_LANG: Record<string, string> = {
  hi: 'hi-IN',
  en: 'en-IN',
}

function emptyItem(): LineItem {
  return { id: crypto.randomUUID(), name: '', qty: 1, unitPrice: 0, total: 0 }
}

type Props = {
  type: BillType
}

export function VoiceBillingPage({ type }: Props) {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const language = useSettingsStore((s) => s.language)
  const [items, setItems] = useState<LineItem[]>([])
  const [typedText, setTypedText] = useState('')
  const [saved, setSaved] = useState(false)

  const { isListening, interimText, isSupported, start, stop } = useSpeechRecognition(
    SPEECH_LANG[language] ?? 'hi-IN',
  )

  const handleFinalResult = (transcript: string) => {
    const parsed = parseVoiceBillText(transcript)
    if (parsed.length > 0) {
      setItems((prev) => [...prev, ...parsed])
    }
  }

  const handleMicTap = () => {
    if (isListening) {
      stop()
    } else {
      start(handleFinalResult)
    }
  }

  const handleTypedParse = () => {
    if (!typedText.trim()) return
    const parsed = parseVoiceBillText(typedText.trim())
    if (parsed.length > 0) {
      setItems((prev) => [...prev, ...parsed])
    }
    setTypedText('')
  }

  const updateItem = (id: string, patch: Partial<Pick<LineItem, 'name' | 'qty' | 'unitPrice'>>) => {
    setItems((prev) =>
      prev.map((item) => {
        if (item.id !== id) return item
        const next = { ...item, ...patch }
        next.total = Math.round(next.qty * next.unitPrice * 100) / 100
        return next
      }),
    )
  }

  const removeItem = (id: string) => {
    setItems((prev) => prev.filter((item) => item.id !== id))
  }

  const addBlankItem = () => {
    setItems((prev) => [...prev, emptyItem()])
  }

  const grandTotal = items.reduce((sum, item) => sum + item.total, 0)

  const handleSave = async () => {
    await db.bills.add({
      type,
      items,
      total: grandTotal,
      createdAt: Date.now(),
    })
    setSaved(true)
  }

  const handleNewBill = () => {
    setItems([])
    setTypedText('')
    setSaved(false)
  }

  const title = type === 'customer' ? t('billing.customerBillTitle') : t('billing.supplierBillTitle')

  if (saved) {
    return (
      <div className="flex min-h-[70vh] flex-col items-center justify-center text-center">
        <div className="mb-4 text-6xl">✅</div>
        <h1 className="mb-6 text-2xl font-bold text-gray-900">{t('billing.savedTitle')}</h1>
        <div className="flex w-full flex-col gap-3">
          <button
            type="button"
            onClick={handleNewBill}
            className="min-h-16 w-full rounded-2xl bg-green-600 text-lg font-semibold text-white active:bg-green-700"
          >
            {t('billing.newBill')}
          </button>
          <button
            type="button"
            onClick={() => navigate('/billing')}
            className="min-h-16 w-full rounded-2xl border-2 border-gray-200 bg-white text-lg font-semibold text-gray-700 active:bg-gray-100"
          >
            {t('billing.backToBilling')}
          </button>
        </div>
      </div>
    )
  }

  return (
    <div>
      <button
        type="button"
        onClick={() => navigate('/billing')}
        className="mb-4 text-sm font-medium text-gray-500"
      >
        ← {t('billing.back')}
      </button>

      <h1 className="mb-4 text-2xl font-bold text-gray-900">{title}</h1>

      {isSupported ? (
        <div className="mb-6 flex flex-col items-center">
          <button
            type="button"
            onClick={handleMicTap}
            className={`flex h-24 w-24 items-center justify-center rounded-full text-4xl shadow-md transition-colors ${
              isListening ? 'animate-pulse bg-red-500' : 'bg-green-600'
            }`}
            aria-pressed={isListening}
          >
            🎤
          </button>
          <p className="mt-3 text-center text-sm font-medium text-gray-600">
            {isListening ? t('billing.listening') : items.length > 0 ? t('billing.tapMicAgain') : t('billing.tapMicToSpeak')}
          </p>
          {interimText && (
            <p className="mt-2 rounded-xl bg-gray-100 px-4 py-2 text-center text-sm text-gray-700">
              {interimText}
            </p>
          )}
        </div>
      ) : (
        <p className="mb-4 rounded-xl bg-yellow-50 px-4 py-3 text-sm text-yellow-800">
          {t('billing.micNotSupported')}
        </p>
      )}

      <div className="mb-6">
        <p className="mb-2 text-center text-xs font-medium text-gray-400">{t('billing.orTypeInstead')}</p>
        <textarea
          value={typedText}
          onChange={(e) => setTypedText(e.target.value)}
          placeholder={t('billing.typePlaceholder')}
          rows={2}
          className="w-full rounded-xl border-2 border-gray-200 px-4 py-3 text-base text-gray-900 focus:border-green-600 focus:outline-none"
        />
        <button
          type="button"
          onClick={handleTypedParse}
          className="mt-2 w-full rounded-xl border-2 border-gray-200 bg-white py-2 text-sm font-semibold text-gray-700 active:bg-gray-100"
        >
          {t('billing.parse')}
        </button>
      </div>

      <div className="mb-3 flex items-center justify-between">
        <h2 className="text-lg font-bold text-gray-900">{t('billing.confirmTitle')}</h2>
      </div>
      {items.length > 0 && <p className="mb-4 -mt-2 text-xs text-gray-500">{t('billing.confirmSubtitle')}</p>}

      {items.length === 0 ? (
        <p className="mb-6 rounded-xl border-2 border-dashed border-gray-200 px-4 py-6 text-center text-sm text-gray-400">
          {t('billing.noItems')}
        </p>
      ) : (
        <div className="mb-4 flex flex-col gap-3">
          {items.map((item) => (
            <div key={item.id} className="rounded-2xl border-2 border-gray-200 bg-white p-4">
              <div className="mb-3 flex items-center gap-2">
                <input
                  type="text"
                  value={item.name}
                  onChange={(e) => updateItem(item.id, { name: e.target.value })}
                  placeholder={t('billing.itemNamePlaceholder')}
                  className="flex-1 rounded-lg border border-gray-200 px-3 py-2 text-base font-medium text-gray-900 focus:border-green-600 focus:outline-none"
                />
                <button
                  type="button"
                  onClick={() => removeItem(item.id)}
                  aria-label={t('billing.delete')}
                  className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-red-50 text-lg text-red-600"
                >
                  🗑️
                </button>
              </div>

              <div className="flex items-end gap-3">
                <div>
                  <label className="mb-1 block text-xs font-medium text-gray-400">{t('billing.qty')}</label>
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => updateItem(item.id, { qty: Math.max(0, item.qty - 1) })}
                      className="flex h-10 w-10 items-center justify-center rounded-lg bg-gray-100 text-lg font-bold text-gray-700"
                    >
                      −
                    </button>
                    <input
                      type="number"
                      value={item.qty}
                      onChange={(e) => updateItem(item.id, { qty: parseFloat(e.target.value) || 0 })}
                      className="w-14 rounded-lg border border-gray-200 px-2 py-2 text-center text-base focus:border-green-600 focus:outline-none"
                    />
                    <button
                      type="button"
                      onClick={() => updateItem(item.id, { qty: item.qty + 1 })}
                      className="flex h-10 w-10 items-center justify-center rounded-lg bg-gray-100 text-lg font-bold text-gray-700"
                    >
                      +
                    </button>
                  </div>
                </div>

                <div className="flex-1">
                  <label className="mb-1 block text-xs font-medium text-gray-400">{t('billing.price')}</label>
                  <input
                    type="number"
                    value={item.unitPrice}
                    onChange={(e) => updateItem(item.id, { unitPrice: parseFloat(e.target.value) || 0 })}
                    className="w-full rounded-lg border border-gray-200 px-3 py-2 text-base focus:border-green-600 focus:outline-none"
                  />
                </div>

                <div className="text-right">
                  <p className="mb-1 text-xs font-medium text-gray-400">{t('billing.lineTotal')}</p>
                  <p className="py-2 text-base font-semibold text-gray-900">₹{item.total}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      <button
        type="button"
        onClick={addBlankItem}
        className="mb-6 w-full rounded-xl border-2 border-dashed border-gray-300 py-3 text-sm font-semibold text-gray-500"
      >
        + {t('billing.addItem')}
      </button>

      {items.length > 0 && (
        <>
          <div className="mb-4 flex items-center justify-between rounded-2xl bg-green-50 px-5 py-4">
            <span className="text-base font-semibold text-green-900">{t('billing.grandTotal')}</span>
            <span className="text-xl font-bold text-green-900">₹{grandTotal.toFixed(2)}</span>
          </div>

          <button
            type="button"
            onClick={handleSave}
            className="min-h-16 w-full rounded-2xl bg-green-600 text-lg font-semibold text-white active:bg-green-700"
          >
            {t('billing.saveBill')}
          </button>
        </>
      )}
    </div>
  )
}
