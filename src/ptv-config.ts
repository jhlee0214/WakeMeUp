// PTV API Configuration
export const PTV_API_KEY = process.env.EXPO_PUBLIC_PTV_API_KEY || "your_ptv_api_key_here";
export const PTV_USER_ID = process.env.EXPO_PUBLIC_PTV_USER_ID || "your_ptv_user_id_here";
export const PTV_BASE_URL = "https://timetableapi.ptv.vic.gov.au";

// Route types mapping
export const ROUTE_TYPES = {
  train: 0,
  tram: 1,
  bus: 2,
  vline: 3,
  nightbus: 4,
} as const;