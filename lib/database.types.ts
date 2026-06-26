export type GummyRow = {
  id: number
  name: string
  maker: string
  flavor: string | null
  description: string | null
  image_url: string | null
  created_at: string
}

export type GummyInsert = Omit<GummyRow, 'id' | 'created_at' | 'image_url'>

export type ReviewRow = {
  id: number
  gummy_id: number
  nickname: string
  comment: string | null
  hardness: number
  sweetness: number
  sourness: number
  value: number
  overall: number
  created_at: string
}

export type ReviewInsert = Omit<ReviewRow, 'id' | 'created_at'>

export type GummyWithAvg = GummyRow & {
  avg_overall: number | null
  avg_hardness: number | null
  avg_sweetness: number | null
  avg_sourness: number | null
  avg_value: number | null
  review_count: number
}

export type Database = {
  public: {
    Tables: {
      gummies: {
        Row: GummyRow
        Insert: GummyInsert
        Update: Partial<GummyInsert>
        Relationships: []
      }
      reviews: {
        Row: ReviewRow
        Insert: ReviewInsert
        Update: Partial<ReviewInsert>
        Relationships: []
      }
    }
    Views: {
      gummies_with_avg: {
        Row: GummyWithAvg
        Relationships: []
      }
    }
    Functions: Record<string, never>
    Enums: Record<string, never>
    CompositeTypes: Record<string, never>
  }
}

export type Gummy = GummyRow
export type Review = ReviewRow
