// ============================================================
//  ADISA delivery fees — by Nigerian state.
//
//  Lagos is cheapest (in-city courier). South-West neighbours are
//  next. North and far South-South are the most expensive due to
//  long-haul + insurance. FCT is mid-tier (central hub).
//  All prices are in Naira (whole numbers).
// ============================================================

const LAGOS_FEE = 1500;
const ZONE_FEES: { states: string[]; fee: number }[] = [
  // South-West neighbours of Lagos
  { states: ["Ogun", "Oyo", "Osun", "Ondo", "Ekiti"], fee: 2500 },
  // South-South + South-East (closer coast)
  { states: ["Rivers", "Delta", "Edo", "Bayelsa", "Akwa Ibom", "Cross River",
             "Anambra", "Imo", "Abia", "Enugu", "Ebonyi"], fee: 3500 },
  // North-Central (FCT + neighbours)
  { states: ["FCT - Abuja", "Kogi", "Nasarawa", "Benue", "Kwara", "Niger", "Plateau"], fee: 4000 },
  // North-West
  { states: ["Kaduna", "Kano", "Katsina", "Jigawa", "Sokoto", "Kebbi", "Zamfara"], fee: 5000 },
  // North-East (furthest)
  { states: ["Borno", "Yobe", "Bauchi", "Gombe", "Adamawa", "Taraba"], fee: 5500 },
];

export function deliveryFeeFor(state: string): number {
  if (!state) return 3500; // sensible default
  if (state.toLowerCase().includes("lagos")) return LAGOS_FEE;
  const match = ZONE_FEES.find((z) =>
    z.states.some((s) => s.toLowerCase() === state.toLowerCase())
  );
  return match?.fee ?? 3500;
}

export function prettyDelivery(state: string): string {
  return `₦${deliveryFeeFor(state).toLocaleString("en-NG")}`;
}

// Estimated working-day delivery window — purely informational
export function deliveryWindow(state: string): { lo: number; hi: number } {
  if (state.toLowerCase().includes("lagos")) return { lo: 1, hi: 3 };
  const highCost = ZONE_FEES.find((z) => z.fee >= 5000 && z.states.some((s) => s.toLowerCase() === state.toLowerCase()));
  return highCost ? { lo: 4, hi: 5 } : { lo: 2, hi: 4 };
}
