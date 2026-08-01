export type Currency = "NGN";

export interface Product {
  id: string;
  slug: string;
  name: string;
  brand: string;
  description: string;
  imagePath: string;          // /shoes/<id>.png
  extraImages: string[];
  sourcePrice: number;        // ₦ original (sourced price)
  salePrice: number;          // ₦ your selling price
  currency: Currency;
  sizesUk: number[];
  colors: string[];
  category: ProductCategory;
  rating: number;
  reviews: number;
  isFeatured: boolean;
  inStock: boolean;
}

export type ProductCategory =
  | "sneakers"
  | "formal"
  | "boots"
  | "loafers"
  | "sandals"
  | "athletic";

export interface CartItem {
  slug: string;
  name: string;
  imagePath: string;
  sizeUk: number;             // UK size
  color: string;
  qty: number;
  unitPrice: number;          // ₦
}

export interface CustomerInfo {
  fullName: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  state: string;
}

export interface Order {
  id: string;
  ref: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  deliveryAddress: string;
  deliveryCity: string;
  deliveryState: string;
  items: CartItem[];
  subtotal: number;
  deliveryFee: number;
  total: number;
  paymentMethod: "card" | "crypto";
  paymentStatus: "pending" | "paid" | "failed";
  fulfillmentStatus: "new" | "processing" | "shipped" | "delivered" | "cancelled";
  paidAt?: string;
  createdAt: string;
}

export const NGN_SIZE = (uk: number): number => uk + 35; // UK 10 = NGN 45
export const NG_STATES = [
  "Abia","Adamawa","Akwa Ibom","Anambra","Bauchi","Bayelsa","Benue","Borno",
  "Cross River","Delta","Ebonyi","Edo","Ekiti","Enugu","FCT - Abuja","Gombe",
  "Imo","Jigawa","Kaduna","Kano","Katsina","Kebbi","Kogi","Kwara","Lagos",
  "Nasarawa","Niger","Ogun","Ondo","Osun","Oyo","Plateau","Rivers","Sokoto",
  "Taraba","Yobe","Zamfara"
] as const;
