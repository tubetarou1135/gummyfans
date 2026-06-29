export type GummyRow = {
  id: number
  name: string
  maker: string
  flavor: string | null
  description: string | null
  image_url: string | null
  rakuten_url: string | null
  created_at: string
}

export type GummyInsert = Omit<GummyRow, 'id' | 'created_at' | 'image_url' | 'rakuten_url'> & {
  image_url?: string | null
  rakuten_url?: string | null
}

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
  first_bite: number | null
  second_bounding: number | null
  gelatin_toughness: number | null
  fruit_taste: number | null
  after_flavor: number | null
  created_at: string
}

export type ReviewInsert = Omit<ReviewRow, 'id' | 'created_at' | 'first_bite' | 'second_bounding' | 'gelatin_toughness' | 'fruit_taste' | 'after_flavor'> & {
  first_bite?: number | null
  second_bounding?: number | null
  gelatin_toughness?: number | null
  fruit_taste?: number | null
  after_flavor?: number | null
}

export type GummyRequestRow = {
  id: number
  name: string
  maker: string
  flavor: string | null
  description: string | null
  status: string
  created_at: string
}

export type GummyRequestInsert = Omit<GummyRequestRow, 'id' | 'created_at' | 'status'>

export type GummyImageRow = {
  id: number
  gummy_id: number
  nickname: string
  storage_path: string
  status: string
  created_at: string
}

export type GummyImageInsert = Omit<GummyImageRow, 'id' | 'created_at' | 'status'>

export type ContactRow = {
  id: number
  name: string
  email: string
  message: string
  created_at: string
}

export type ContactInsert = Omit<ContactRow, 'id' | 'created_at'>

export type GummyWithAvg = GummyRow & {
  avg_overall: number | null
  avg_hardness: number | null
  avg_sweetness: number | null
  avg_sourness: number | null
  avg_value: number | null
  avg_first_bite: number | null
  avg_second_bounding: number | null
  avg_gelatin_toughness: number | null
  avg_fruit_taste: number | null
  avg_after_flavor: number | null
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
      gummy_requests: {
        Row: GummyRequestRow
        Insert: GummyRequestInsert
        Update: Partial<GummyRequestRow>
        Relationships: []
      }
      gummy_images: {
        Row: GummyImageRow
        Insert: GummyImageInsert
        Update: Partial<GummyImageRow>
        Relationships: []
      }
      contacts: {
        Row: ContactRow
        Insert: ContactInsert
        Update: Partial<ContactInsert>
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

export type DiscontinuedReportRow = {
  id: number
  gummy_id: number
  created_at: string
}

export type Gummy = GummyRow
export type Review = ReviewRow
