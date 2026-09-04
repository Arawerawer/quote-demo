// 欄位元件 樣式組合函式

export type FormControlStatus = 'default' | 'error' | 'warning'
export type FormControlSize = 'sm' | 'md' | 'lg'

const baseClasses =
  'form-control w-full rounded-lg border bg-white text-brand-900 outline-none placeholder:text-nurse-300 disabled:cursor-not-allowed disabled:bg-nurse-100 disabled:text-nurse-500'

const readonlyClasses =
  'read-only:cursor-default read-only:bg-nurse-50 read-only:text-nurse-500'

const sizeClasses: Record<FormControlSize, string> = {
  sm: 'h-9 px-2.5 text-sm',
  md: 'h-11 px-3 text-base',
  lg: 'h-13 px-4 text-lg',
}

const statusClasses: Record<FormControlStatus, string> = {
  default:
    'border-nurse-200 focus:border-brand-500 focus:ring-2 focus:ring-brand-50',
  error:
    'border-rose-500 focus:border-rose-600 focus:ring-2 focus:ring-rose-50',
  warning:
    'border-desert-500 focus:border-desert-600 focus:ring-2 focus:ring-desert-100',
}

export function useFormControlStyles(
  size: FormControlSize = 'md',
  status: FormControlStatus = 'default',
  supportsReadonly = false,
) {
  return [
    baseClasses,
    supportsReadonly ? readonlyClasses : '',
    sizeClasses[size],
    statusClasses[status],
  ]
}
