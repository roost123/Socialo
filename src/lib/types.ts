export interface MenuItem {
  name: string;
  description: string | null;
  price: string | null;
  imageUrl: string | null;
}

export interface MenuCategory {
  name: string;
  items: MenuItem[];
}

export interface MenuBranding {
  restaurantName: string;
  logoUrl: string | null;
  tagline: string | null;
}

export interface MenuData {
  id: string;
  createdAt: string;
  originalLanguage: string;
  branding: MenuBranding;
  categories: MenuCategory[];
}

export interface MenuTranslation {
  categories: MenuCategory[];
}

// Every language in the world that matters — grouped by region
export const ALL_LANGUAGES = [
  // Europe - Western
  { code: "en", name: "English", native: "English", flag: "🇬🇧", region: "Europe" },
  { code: "nl", name: "Dutch", native: "Nederlands", flag: "🇳🇱", region: "Europe" },
  { code: "de", name: "German", native: "Deutsch", flag: "🇩🇪", region: "Europe" },
  { code: "fr", name: "French", native: "Français", flag: "🇫🇷", region: "Europe" },
  { code: "es", name: "Spanish", native: "Español", flag: "🇪🇸", region: "Europe" },
  { code: "it", name: "Italian", native: "Italiano", flag: "🇮🇹", region: "Europe" },
  { code: "pt", name: "Portuguese", native: "Português", flag: "🇵🇹", region: "Europe" },
  { code: "ca", name: "Catalan", native: "Català", flag: "🏴", region: "Europe" },
  { code: "gl", name: "Galician", native: "Galego", flag: "🏴", region: "Europe" },
  { code: "eu", name: "Basque", native: "Euskara", flag: "🏴", region: "Europe" },
  // Europe - Nordic
  { code: "da", name: "Danish", native: "Dansk", flag: "🇩🇰", region: "Europe" },
  { code: "sv", name: "Swedish", native: "Svenska", flag: "🇸🇪", region: "Europe" },
  { code: "no", name: "Norwegian", native: "Norsk", flag: "🇳🇴", region: "Europe" },
  { code: "fi", name: "Finnish", native: "Suomi", flag: "🇫🇮", region: "Europe" },
  { code: "is", name: "Icelandic", native: "Íslenska", flag: "🇮🇸", region: "Europe" },
  // Europe - Eastern
  { code: "pl", name: "Polish", native: "Polski", flag: "🇵🇱", region: "Europe" },
  { code: "cs", name: "Czech", native: "Čeština", flag: "🇨🇿", region: "Europe" },
  { code: "sk", name: "Slovak", native: "Slovenčina", flag: "🇸🇰", region: "Europe" },
  { code: "hu", name: "Hungarian", native: "Magyar", flag: "🇭🇺", region: "Europe" },
  { code: "ro", name: "Romanian", native: "Română", flag: "🇷🇴", region: "Europe" },
  { code: "bg", name: "Bulgarian", native: "Български", flag: "🇧🇬", region: "Europe" },
  { code: "hr", name: "Croatian", native: "Hrvatski", flag: "🇭🇷", region: "Europe" },
  { code: "sr", name: "Serbian", native: "Српски", flag: "🇷🇸", region: "Europe" },
  { code: "sl", name: "Slovenian", native: "Slovenščina", flag: "🇸🇮", region: "Europe" },
  { code: "uk", name: "Ukrainian", native: "Українська", flag: "🇺🇦", region: "Europe" },
  { code: "ru", name: "Russian", native: "Русский", flag: "🇷🇺", region: "Europe" },
  { code: "el", name: "Greek", native: "Ελληνικά", flag: "🇬🇷", region: "Europe" },
  { code: "tr", name: "Turkish", native: "Türkçe", flag: "🇹🇷", region: "Europe" },
  { code: "lt", name: "Lithuanian", native: "Lietuvių", flag: "🇱🇹", region: "Europe" },
  { code: "lv", name: "Latvian", native: "Latviešu", flag: "🇱🇻", region: "Europe" },
  { code: "et", name: "Estonian", native: "Eesti", flag: "🇪🇪", region: "Europe" },
  { code: "sq", name: "Albanian", native: "Shqip", flag: "🇦🇱", region: "Europe" },
  { code: "mk", name: "Macedonian", native: "Македонски", flag: "🇲🇰", region: "Europe" },
  { code: "bs", name: "Bosnian", native: "Bosanski", flag: "🇧🇦", region: "Europe" },
  { code: "mt", name: "Maltese", native: "Malti", flag: "🇲🇹", region: "Europe" },
  // Asia - East
  { code: "zh", name: "Chinese (Simplified)", native: "简体中文", flag: "🇨🇳", region: "Asia" },
  { code: "zh-TW", name: "Chinese (Traditional)", native: "繁體中文", flag: "🇹🇼", region: "Asia" },
  { code: "ja", name: "Japanese", native: "日本語", flag: "🇯🇵", region: "Asia" },
  { code: "ko", name: "Korean", native: "한국어", flag: "🇰🇷", region: "Asia" },
  { code: "mn", name: "Mongolian", native: "Монгол", flag: "🇲🇳", region: "Asia" },
  // Asia - Southeast
  { code: "th", name: "Thai", native: "ไทย", flag: "🇹🇭", region: "Asia" },
  { code: "vi", name: "Vietnamese", native: "Tiếng Việt", flag: "🇻🇳", region: "Asia" },
  { code: "id", name: "Indonesian", native: "Bahasa Indonesia", flag: "🇮🇩", region: "Asia" },
  { code: "ms", name: "Malay", native: "Bahasa Melayu", flag: "🇲🇾", region: "Asia" },
  { code: "tl", name: "Filipino", native: "Filipino", flag: "🇵🇭", region: "Asia" },
  { code: "my", name: "Myanmar (Burmese)", native: "မြန်မာ", flag: "🇲🇲", region: "Asia" },
  { code: "km", name: "Khmer", native: "ខ្មែរ", flag: "🇰🇭", region: "Asia" },
  { code: "lo", name: "Lao", native: "ລາວ", flag: "🇱🇦", region: "Asia" },
  // Asia - South
  { code: "hi", name: "Hindi", native: "हिन्दी", flag: "🇮🇳", region: "Asia" },
  { code: "bn", name: "Bengali", native: "বাংলা", flag: "🇧🇩", region: "Asia" },
  { code: "ur", name: "Urdu", native: "اردو", flag: "🇵🇰", region: "Asia" },
  { code: "ta", name: "Tamil", native: "தமிழ்", flag: "🇮🇳", region: "Asia" },
  { code: "te", name: "Telugu", native: "తెలుగు", flag: "🇮🇳", region: "Asia" },
  { code: "mr", name: "Marathi", native: "मराठी", flag: "🇮🇳", region: "Asia" },
  { code: "gu", name: "Gujarati", native: "ગુજરાતી", flag: "🇮🇳", region: "Asia" },
  { code: "kn", name: "Kannada", native: "ಕನ್ನಡ", flag: "🇮🇳", region: "Asia" },
  { code: "ml", name: "Malayalam", native: "മലയാളം", flag: "🇮🇳", region: "Asia" },
  { code: "pa", name: "Punjabi", native: "ਪੰਜਾਬੀ", flag: "🇮🇳", region: "Asia" },
  { code: "si", name: "Sinhala", native: "සිංහල", flag: "🇱🇰", region: "Asia" },
  { code: "ne", name: "Nepali", native: "नेपाली", flag: "🇳🇵", region: "Asia" },
  // Middle East
  { code: "ar", name: "Arabic", native: "العربية", flag: "🇸🇦", region: "Middle East" },
  { code: "fa", name: "Persian", native: "فارسی", flag: "🇮🇷", region: "Middle East" },
  { code: "he", name: "Hebrew", native: "עברית", flag: "🇮🇱", region: "Middle East" },
  { code: "ku", name: "Kurdish", native: "کوردی", flag: "🏴", region: "Middle East" },
  // Africa
  { code: "sw", name: "Swahili", native: "Kiswahili", flag: "🇰🇪", region: "Africa" },
  { code: "am", name: "Amharic", native: "አማርኛ", flag: "🇪🇹", region: "Africa" },
  { code: "ha", name: "Hausa", native: "Hausa", flag: "🇳🇬", region: "Africa" },
  { code: "yo", name: "Yoruba", native: "Yorùbá", flag: "🇳🇬", region: "Africa" },
  { code: "ig", name: "Igbo", native: "Igbo", flag: "🇳🇬", region: "Africa" },
  { code: "zu", name: "Zulu", native: "isiZulu", flag: "🇿🇦", region: "Africa" },
  { code: "af", name: "Afrikaans", native: "Afrikaans", flag: "🇿🇦", region: "Africa" },
  // Americas
  { code: "pt-BR", name: "Brazilian Portuguese", native: "Português (Brasil)", flag: "🇧🇷", region: "Americas" },
  { code: "es-MX", name: "Mexican Spanish", native: "Español (México)", flag: "🇲🇽", region: "Americas" },
  { code: "ht", name: "Haitian Creole", native: "Kreyòl Ayisyen", flag: "🇭🇹", region: "Americas" },
  // Central Asia
  { code: "ka", name: "Georgian", native: "ქართული", flag: "🇬🇪", region: "Asia" },
  { code: "hy", name: "Armenian", native: "Հայերեն", flag: "🇦🇲", region: "Asia" },
  { code: "az", name: "Azerbaijani", native: "Azərbaycan", flag: "🇦🇿", region: "Asia" },
  { code: "kk", name: "Kazakh", native: "Қазақ", flag: "🇰🇿", region: "Asia" },
  { code: "uz", name: "Uzbek", native: "Oʻzbek", flag: "🇺🇿", region: "Asia" },
] as const;

export type LanguageCode = (typeof ALL_LANGUAGES)[number]["code"];
