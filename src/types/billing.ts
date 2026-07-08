export type BillType = 'customer' | 'supplier'

export interface LineItem {
  id: string
  name: string
  qty: number
  unitPrice: number
  total: number
}
