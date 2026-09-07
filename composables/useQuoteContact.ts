export interface QuoteContact {
  /** 希望交期，ISO yyyy-mm-dd */
  deliveryDate: string
  name: string
  company: string
  /** 公司統編，8 位數字；個人詢價可不填 */
  taxId: string
  phone: string
  email: string
  /** 送貨縣市；空字串代表未選 */
  shippingCity: string
  /** 詳細地址 */
  shippingAddress: string
}

/** 用「臺」不用「台」，跟政府正式寫法一致 */
export const TAIWAN_CITIES = [
  '基隆市',
  '臺北市',
  '新北市',
  '桃園市',
  '新竹市',
  '新竹縣',
  '苗栗縣',
  '臺中市',
  '彰化縣',
  '南投縣',
  '雲林縣',
  '嘉義市',
  '嘉義縣',
  '臺南市',
  '高雄市',
  '屏東縣',
  '宜蘭縣',
  '花蓮縣',
  '臺東縣',
  '澎湖縣',
  '金門縣',
  '連江縣',
].map((city) => ({ label: city, value: city }))

const toIsoDate = (date: Date) => {
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')

  return `${year}-${month}-${day}`
}

/**
 * 訂單層級的資訊：交期與聯絡方式。
 * 跟 useQuoteCart 分開，因為兩者生命週期不同——清空詢價清單
 * 不應該連帶清掉已經填好的聯絡資訊。
 *
 * 一樣用 useState 保存，換頁不會消失，重整才清空。
 */
export const useQuoteContact = () => {
  const contact = useState<QuoteContact>('quote-contact', () => ({
    deliveryDate: '',
    name: '',
    company: '',
    taxId: '',
    phone: '',
    email: '',
    shippingCity: '',
    shippingAddress: '',
  }))

  // 日曆的最小可選日期，同樣延到 onMounted 才給
  const todayIso = useState<string>('quote-contact-today', () => '')

  /**
   * 日期預設值延到 onMounted，避免伺服器與瀏覽器時間不一致造成 hydration mismatch。
   * 已經有值就不覆蓋——使用者可能改過了才切頁再回來。
   */
  const initDates = () => {
    const now = new Date()

    todayIso.value = toIsoDate(now)

    if (contact.value.deliveryDate) {
      return
    }

    const week = new Date(now)
    week.setDate(week.getDate() + 7)
    contact.value.deliveryDate = toIsoDate(week)
  }

  const nameError = computed(() =>
    contact.value.name.trim() ? '' : '請填寫聯絡人姓名',
  )

  // 電話只要求「至少 8 個數字」——台灣手機 10 碼、市話含區碼 9~10 碼，
  // 寫成 02-1234-5678 或帶分機都能過。擋太嚴會擋到真客戶。
  const phoneError = computed(() => {
    const value = contact.value.phone.trim()

    if (!value) {
      return '請填寫聯絡電話'
    }

    return value.replace(/\D/g, '').length >= 8 ? '' : '電話格式看起來不完整'
  })

  // Email 選填，但填了就要像個 email：有 @、@ 後面有點，且都不在頭尾
  const emailError = computed(() => {
    const value = contact.value.email.trim()

    if (!value) {
      return ''
    }

    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value) ? '' : 'Email 格式不正確'
  })

  // 統編選填，但填了就要是 8 位數字。刻意不做官方的檢查碼演算法——
  // 比照電話的寬鬆做法，擋掉打錯位數就好，不要擋到真客戶。
  const taxIdError = computed(() => {
    const value = contact.value.taxId.trim()

    if (!value) {
      return ''
    }

    return /^\d{8}$/.test(value) ? '' : '統編應為 8 位數字'
  })

  const isContactValid = computed(
    () =>
      !nameError.value &&
      !phoneError.value &&
      !emailError.value &&
      !taxIdError.value,
  )

  /** 送貨地點的顯示字串；沒填時是空字串 */
  const shippingText = computed(() =>
    `${contact.value.shippingCity}${contact.value.shippingAddress}`.trim(),
  )

  return {
    contact,
    todayIso,
    initDates,
    nameError,
    phoneError,
    emailError,
    taxIdError,
    isContactValid,
    shippingText,
  }
}
