import Dexie, { type Table } from 'dexie'
import type { BillType, LineItem } from '../../types/billing'

export interface Bill {
  id?: number
  type: BillType
  items: LineItem[]
  total: number
  createdAt: number
}

class KiranaDB extends Dexie {
  bills!: Table<Bill, number>

  constructor() {
    super('kirana-erp')
    this.version(1).stores({
      bills: '++id, type, createdAt',
    })
  }
}

export const db = new KiranaDB()
