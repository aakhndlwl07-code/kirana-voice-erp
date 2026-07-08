import type { LineItem } from '../../types/billing'

const NUMBER_WORDS: Record<string, number> = {
  ek: 1,
  एक: 1,
  do: 2,
  दो: 2,
  teen: 3,
  तीन: 3,
  char: 4,
  chaar: 4,
  चार: 4,
  paanch: 5,
  panch: 5,
  पांच: 5,
  'पाँच': 5,
  chhe: 6,
  chhah: 6,
  छह: 6,
  छे: 6,
  saat: 7,
  सात: 7,
  aath: 8,
  आठ: 8,
  nau: 9,
  नौ: 9,
  das: 10,
  दस: 10,
  gyarah: 11,
  ग्यारह: 11,
  barah: 12,
  बारह: 12,
  pandrah: 15,
  पंद्रह: 15,
  bees: 20,
  बीस: 20,
  pachees: 25,
  पच्चीस: 25,
  tees: 30,
  तीस: 30,
  pachaas: 50,
  pachas: 50,
  पचास: 50,
  sau: 100,
  सौ: 100,
}

const PRICE_WORDS = new Set([
  'rupaye',
  'rupya',
  'rupye',
  'rupee',
  'rupees',
  'rs',
  'रुपये',
  'रुपए',
  'रूपये',
])

const TOTAL_WORDS = new Set(['total', 'कुल'])

const CONNECTOR_WORDS = new Set(['ka', 'ki', 'ke', 'का', 'के', 'की', 'ek', 'एक'])

const SEGMENT_SPLIT_REGEX = /,|\band\b|\baur\b| और |\bphir\b|\bthen\b/gi

function tokenToNumber(token: string): number | null {
  const cleaned = token.replace(/[.,]/g, '')
  if (/^\d+(\.\d+)?$/.test(cleaned)) {
    return parseFloat(cleaned)
  }
  const lower = cleaned.toLowerCase()
  if (lower in NUMBER_WORDS) return NUMBER_WORDS[lower]
  if (cleaned in NUMBER_WORDS) return NUMBER_WORDS[cleaned]
  return null
}

function parseSegment(segment: string): LineItem | null {
  const rawTokens = segment.trim().split(/\s+/).filter(Boolean)
  if (rawTokens.length === 0) return null

  const numbers: { value: number; index: number }[] = []
  let hasTotalWord = false
  let hasPriceWord = false
  const nameTokens: string[] = []

  rawTokens.forEach((token, index) => {
    const lower = token.toLowerCase()
    const asNumber = tokenToNumber(token)

    if (asNumber !== null) {
      numbers.push({ value: asNumber, index })
      return
    }
    if (TOTAL_WORDS.has(lower)) {
      hasTotalWord = true
      return
    }
    if (PRICE_WORDS.has(lower)) {
      hasPriceWord = true
      return
    }
    if (CONNECTOR_WORDS.has(lower)) {
      return
    }
    nameTokens.push(token)
  })

  const name = nameTokens.join(' ').trim()

  let qty = 1
  let unitPrice = 0
  let total = 0

  if (numbers.length === 0) {
    // No numbers spoken at all — leave quantity/price at 0 for manual entry.
    unitPrice = 0
    total = 0
  } else if (numbers.length === 1) {
    if (hasTotalWord || hasPriceWord) {
      qty = 1
      total = numbers[0].value
      unitPrice = total
    } else {
      qty = numbers[0].value
      unitPrice = 0
      total = 0
    }
  } else {
    // First number spoken is treated as quantity, last as the price/total.
    qty = numbers[0].value
    const priceNumber = numbers[numbers.length - 1].value
    if (hasTotalWord) {
      total = priceNumber
      unitPrice = qty > 0 ? total / qty : total
    } else {
      unitPrice = priceNumber
      total = qty * unitPrice
    }
  }

  if (!hasTotalWord && numbers.length > 1) {
    total = qty * unitPrice
  }

  return {
    id: crypto.randomUUID(),
    name: name || 'आइटम / Item',
    qty,
    unitPrice: Math.round(unitPrice * 100) / 100,
    total: Math.round(total * 100) / 100,
  }
}

export function parseVoiceBillText(text: string): LineItem[] {
  const segments = text
    .split(SEGMENT_SPLIT_REGEX)
    .map((s) => s.trim())
    .filter(Boolean)

  const items = segments
    .map(parseSegment)
    .filter((item): item is LineItem => item !== null)

  return items.length > 0 ? items : []
}
