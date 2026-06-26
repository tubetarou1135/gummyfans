'use client'

type Props = {
  value: number
  onChange?: (v: number) => void
  readonly?: boolean
  size?: 'sm' | 'md'
}

export default function StarRating({ value, onChange, readonly = false, size = 'md' }: Props) {
  const sizeClass = size === 'sm' ? 'text-base' : 'text-2xl'

  return (
    <div className="flex gap-0.5">
      {[1, 2, 3, 4, 5].map((star) => (
        <button
          key={star}
          type="button"
          disabled={readonly}
          onClick={() => onChange?.(star)}
          className={`${sizeClass} ${readonly ? 'cursor-default' : 'cursor-pointer hover:scale-110 transition-transform'} ${star <= value ? 'text-yellow-400' : 'text-gray-300'}`}
        >
          ★
        </button>
      ))}
    </div>
  )
}
