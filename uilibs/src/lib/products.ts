// ============================================================
//  ADISA product catalog - source-of-truth seed data.
//
//  Each product lives at /public/products/<slug>/NN.png (one
//  folder per shoe). imagePath is the first image (01.png);
//  extraImages is every other image in the same folder — used
//  by the ImageCarousel on the product detail page.
//
//  These rows are also pushed to Supabase on first run, but
//  everything reads from them locally so the site works even
//  without Supabase (useful for previews).
// ============================================================
import type { Product } from "./types";
import { convertToAdisaPrice } from "./pricing";

// Image folder URL base — must match the filesystem slug exactly.
const IMG = (slug: string, n: number) => `/products/${slug}/${String(n).padStart(2, "0")}.png`;

// Helper to build a [01..N] image list for a product folder.
const ALL_IMAGES = (slug: string, count: number): string[] =>
  Array.from({ length: count }, (_, i) => IMG(slug, i + 1));

interface RawShoe {
  slug: string;
  name: string;
  sourcePrice: number; // ₦ in the source country
  imageCount: number;
  sizes: number[];
  colors: string[];
  category: Product["category"];
  shortDesc: string; // single-sentence summary used by product cards
  description: string; // full description, gender-rewritten as men's
  rating: number;
  reviews: number;
}

// ============================================================
//  29 products. Descriptions are taken from the supplier
//  .docx files (see /public/products/<slug>/) and lightly
//  rewritten to present every shoe as a MEN's shoe line, per
//  ADISA brand direction.
// ============================================================
const SHOES: RawShoe[] = [
  {
    slug: "adisa-cosy-loafer",
    name: "ADISA Cosy Loafer",
    sourcePrice: 17188,
    imageCount: 12,
    sizes: [6, 6.5, 7.5, 8, 9, 9.5],
    colors: ["Black", "Beige", "Brown"],
    category: "loafers",
    shortDesc: "Versatile lazy-day loafer with a low heel and soft footbed for all-day wear.",
    description:
      "An everyday men's slip-on loafer refined for the man who moves quietly through his day. " +
      "Plain round toe in supple man-made fibre, solid colour finish, and a non-fatiguing low heel " +
      "that carries you from morning commute to evening schmooze without protest. Wears like a " +
      "sneaker, looks like a loafer. Brand: ADISA Select. Available in three colours. Free insured " +
      "shipping; arrives in Nigeria in as little as 5 days.",
    rating: 4.8,
    reviews: 882,
  },
  {
    slug: "adisa-classic-runner",
    name: "ADISA Classic Runner",
    sourcePrice: 11979,
    imageCount: 7,
    sizes: [6, 6.5, 7.5, 8, 8.5],
    colors: ["Grey", "Brown"],
    category: "sneakers",
    shortDesc: "Lace-up low-top sneaker with a TPR sole and a clean retro silhouette.",
    description:
      "A classic men's casual trainer built on a low-top chassis. Lace-up closure locks the foot " +
      "down for a secure, adjustable fit; the TPR sole gives traction and flex for street and road. " +
      "Solid colour pattern, retro preppy silhouette — a year-round wardrobe staple that pairs with " +
      "jeans, chinos, or a tracksuit. 4.8 / 5 reviewer rating; fits true to size for 95% of men.",
    rating: 4.8,
    reviews: 882,
  },
  {
    slug: "adisa-zosivc-trainer",
    name: "ADISA ZOSIVC Trainer",
    sourcePrice: 17924,
    imageCount: 11,
    sizes: [6, 7, 7.5, 8.5],
    colors: ["White", "Black", "Green", "Purple", "Burgundy", "Yellow", "Blue"],
    category: "sneakers",
    shortDesc: "Lace-up soft-soled sports trainer in a bold eight-colour palette.",
    description:
      "A men's lightweight sports shoe for the everyday walkabout. Soft-soled lace-up construction " +
      "lets you wear it from the office to the gym without a change. Engineered for breathability and " +
      "a quiet stride. Eight colour options mean you can match it to your fit, your mood, or your team. " +
      "Standard shipping is free on all orders.",
    rating: 4.6,
    reviews: 410,
  },
  {
    slug: "adisa-dexun-skater",
    name: "ADISA DeXun Skater",
    sourcePrice: 14164,
    imageCount: 7,
    sizes: [6, 6.5, 7, 8, 8.5],
    colors: ["White Grey", "Black"],
    category: "sneakers",
    shortDesc: "Skate-style sneaker with a solid colourway, lace-up closure, all-season build.",
    description:
      "A men's skate shoe built to take a beating. Lace-up closure keeps the foot locked in for " +
      "skateboard tricks or city commutes; the solid colourway stays clean even after a long week. " +
      "All-season build means this sneaker runs through spring rain, summer pavement and harmattam " +
      "with the same grip. 4.9 / 5 reviewer rating with over 1.1K sold. Fits true to size for 88% of men.",
    rating: 4.9,
    reviews: 1120,
  },
  {
    slug: "adisa-cosy-flat",
    name: "ADISA Cosy Flat",
    sourcePrice: 19047,
    imageCount: 4,
    sizes: [4.5, 5, 5.5, 6, 6.5, 7, 7.5, 8, 8.5],
    colors: ["Black", "Khaki", "Brown"],
    category: "loafers",
    shortDesc: "Round-toe flat loafer with a simple low heel for everyday comfort.",
    description:
      "A men's flat loafer in plain round toe — the quietest shoe in the ADISA line. Solid colourway, " +
      "simple low heel, comfortable flat sole that wears like a memory after a week. Suits office wear, " +
      "easy travel, and weekend alike. Free shipping on all orders; arrives in Nigeria in as little as 5 days.",
    rating: 4.6,
    reviews: 240,
  },
  {
    slug: "adisa-retro-flats",
    name: "ADISA Retro Court",
    sourcePrice: 16382,
    imageCount: 8,
    sizes: [5, 6.5, 7, 8, 8.5, 9.5, 10],
    colors: ["Black", "White/Black", "White/Khaki"],
    category: "sneakers",
    shortDesc: "Retro low-top sneaker with a gum rubber sole and a three-colour palette.",
    description:
      "A men's retro court silhouette refreshed for the city. Classic retro design with a plain toe " +
      "and solid colourway; the gum rubber sole is the tell — that distinctive foxing line that keeps " +
      "the shoe timeless. Lace-up closure locks the fit for daily wear. Three colour ways: clean Black, " +
      "White-with-Black, and White-with-Khaki to match anything you put on.",
    rating: 4.5,
    reviews: 320,
  },
  {
    slug: "adisa-versatile-loafer",
    name: "ADISA Versatile Loafer",
    sourcePrice: 17943,
    imageCount: 9,
    sizes: [4, 5, 6, 6.5, 7.5, 8, 9, 9.5],
    colors: ["Black", "Beige", "Brown"],
    category: "loafers",
    shortDesc: "Fashionable slip-on loafer with a non-fatiguing low heel.",
    description:
      "An easy men's everyday loafer. Non-fatiguing low heel, plain toe, solid colourway — pure easy. " +
      "Three classic colours to choose from. Slip-on construction makes this a one-second shoe when " +
      "you're walking out the door. Free shipping; arrives in Nigeria in as little as 5 days.",
    rating: 4.7,
    reviews: 510,
  },
  {
    slug: "adisa-wklniag-runner",
    name: "ADISA Wklniag Runner",
    sourcePrice: 14077,
    imageCount: 5,
    sizes: [5.5, 6, 6.5, 7, 7.5, 8],
    colors: ["Brown", "Black", "Grey", "Sand"],
    category: "sneakers",
    shortDesc: "Vintage-style flat runner with a lightweight fabric upper for all-day wear.",
    description:
      "A men's casual sneaker cut from man-made fibers and a breathable fabric upper — engineered for " +
      "a lightweight feel that holds up to all-day wear. Vintage plain-toe silhouette carries a retro " +
      "preppy pedigree. Lace-up closure secures the fit for casual or running use. 4.6 stars, over 34K " +
      "sold — one of the most-loved silhouettes in the catalogue.",
    rating: 4.6,
    reviews: 612,
  },
  {
    slug: "adisa-cosy-buckle",
    name: "ADISA Buckle Loafer",
    sourcePrice: 19310,
    imageCount: 7,
    sizes: [6, 6.5, 7, 7.5, 8, 8.5],
    colors: ["Beige", "Brown"],
    category: "loafers",
    shortDesc: "Loafer with a decorative strap and metal buckle accent for sharp men.",
    description:
      "A men's loafer with personality — a decorative strap and metal buckle accent lift it above " +
      "the standard slip-on. Cut from supple man-made fibre, lined for comfort, finished in two " +
      "earth-friendly colours. Stand out without standing on ceremony.",
    rating: 4.8,
    reviews: 180,
  },
  {
    slug: "adisa-softon-loafer",
    name: "ADISA Soft-On Loafer",
    sourcePrice: 15845,
    imageCount: 3,
    sizes: [5.5, 6, 6.5, 7.5, 8, 8.5],
    colors: ["Pink", "Beige", "Brown"],
    category: "loafers",
    shortDesc: "Full-coverage soft-soled slip-on with easy daily comfort.",
    description:
      "A men's full-coverage slip-on built for daily comfort. Soft-soled construction keeps the walk " +
      "quiet and the footbed forgiving, no matter how many hours you put in. Simple, stylish, " +
      "versatile — a one-shoe answer to most of the week. 4.5 stars. Fits true to size for 82% of men.",
    rating: 4.5,
    reviews: 566,
  },
  {
    slug: "adisa-textured-sneaker",
    name: "ADISA Textured Court",
    sourcePrice: 16356,
    imageCount: 6,
    sizes: [5.5, 6, 6.5, 7, 7.5],
    colors: ["Coffee Brown", "Green", "Black"],
    category: "sneakers",
    shortDesc: "Casual lace-up sneakers with a textured gum sole and panel detail.",
    description:
      "A men's casual lace-up sneaker with a textured gum sole and paneled upper — the kind of detail " +
      "that earns a second look without saying a word. Three colourways including a deep Coffee Brown " +
      "and an easy Green. 4.8 stars with 11K+ sold. Fits true to size for 94% of men. Standard free " +
      "shipping; arrives in Nigeria in as little as 5 days.",
    rating: 4.8,
    reviews: 1534,
  },
  {
    slug: "adisa-allmatch-sneaker",
    name: "ADISA All-Match Sneaker",
    sourcePrice: 13108,
    imageCount: 5,
    sizes: [6, 6.5, 7, 7.5, 8, 8.5, 9, 9.5, 10, 10.5],
    colors: ["White", "White/Green", "White/Brown"],
    category: "sneakers",
    shortDesc: "All-match white sneaker with subtle colour accents and a wide-fit comfort option.",
    description:
      "A men's all-match sneaker in white with quiet colour accents — for men who want a clean shoe " +
      "that still has a personality. Soft insole, breathable upper, and a wide-fit option that gives " +
      "extra room for those who need it. Multi-scene design built for long walks and daily commutes. " +
      "4.7 stars, 7.9K+ sold. Fits true to size for 92% of men.",
    rating: 4.7,
    reviews: 219,
  },
  {
    slug: "adisa-breathable-runner",
    name: "ADISA Breathable Runner",
    sourcePrice: 14236,
    imageCount: 7,
    sizes: [5.5, 6, 6.5, 7, 7.5, 8, 8.5],
    colors: ["White"],
    category: "athletic",
    shortDesc: "Breathable runner engineered for outdoor use across all four seasons.",
    description:
      "A men's breathable runner built for outdoor miles — engineered for skateboarding, running, " +
      "and the long road that connects them. Suitable for all seasons; structured for pronation " +
      "support so you ride steady on long days. 4.7 stars with 9K+ sold. Standard free shipping.",
    rating: 4.7,
    reviews: 410,
  },
  {
    slug: "adisa-battle-athletic",
    name: "ADISA Battle Athletic",
    sourcePrice: 17779,
    imageCount: 12,
    sizes: [5.5, 6, 6.5, 7, 7.5, 8, 8.5, 9, 9.5, 10, 10.5, 12.5],
    colors: ["Green", "Yellow", "Black/Red"],
    category: "athletic",
    shortDesc: "Men's running athletic shoe with lace closure and a fabric insole.",
    description:
      "A men's running athletic shoe from the BATTLE SHEEP line — built for the daily run and the " +
      "daily walkabout alike. Lace closure for a secure adjustable fit; fabric insole for soft " +
      "cushioning underfoot; solid colourway that wears clean year-round. 4.7 stars with 56K+ sold and " +
      "8,708 reviews — one of the most-repurchased shoes in the catalogue. Fits true to size for 94% " +
      "of men. Free standard shipping; arrives in Nigeria in as little as 5 days.",
    rating: 4.7,
    reviews: 8708,
  },
  {
    slug: "adisa-skate-casual",
    name: "ADISA Skate Casual",
    sourcePrice: 13278,
    imageCount: 4,
    sizes: [5.5, 6, 6.5, 7, 7.5, 8, 8.5, 9, 9.5, 10],
    colors: ["White"],
    category: "sneakers",
    shortDesc: "Casual lace-up skate sneaker with a solid colour flat sole.",
    description:
      "A men's skate-style sneaker cut for everyday casual wear. Lace-up closure; solid colourway; " +
      "flat-sole construction for a stable ride. Versatile enough for denim, shorts, or trousers. " +
      "4.4 stars with 5.5K+ sold. Fits true to size for 84% of men.",
    rating: 4.4,
    reviews: 58,
  },
  {
    slug: "adisa-nonslip-laceup",
    name: "ADISA Herringbone Court",
    sourcePrice: 13553,
    imageCount: 8,
    sizes: [6, 6.5, 7, 7.5, 8, 8.5, 9, 9.5],
    colors: ["Black", "White"],
    category: "sneakers",
    shortDesc: "EVA-sole sneaker with herringbone pattern for non-slip daily wear.",
    description:
      "A men's non-slip daily sneaker. The herringbone EVA outsole grips wet and dry floors alike — " +
      "purpose-built for the commute, the office, the date, the trip. Lace-up closure lets you tune " +
      "the fit. Two classic colourways. 5.0 stars with 9 reviews; ranked #7 Best Seller from this line.",
    rating: 5.0,
    reviews: 9,
  },
  {
    slug: "adisa-sports-outdoor",
    name: "ADISA Sports Outdoor",
    sourcePrice: 11763,
    imageCount: 7,
    sizes: [5.5, 6, 6.5, 7, 7.5, 8, 8.5, 9, 9.5, 10, 10.5, 12],
    colors: ["Black", "Grey", "Yellow"],
    category: "athletic",
    shortDesc: "Men's sports & outdoor shoe with a breathable knit upper and lace closure.",
    description:
      "A men's sports & outdoor shoe engineered for the long road and the rough ground. Breathable " +
      "knit upper keeps the foot cool under load; lace-up closure secures the fit through any activity; " +
      "the outsole is built for grip and the inner collar features a quiet pattern detail. 4.7 stars " +
      "with 2,765 ratings. Fits true to size for 95% of men. Standard free shipping; arrives in " +
      "Nigeria in as little as 5 days.",
    rating: 4.7,
    reviews: 2765,
  },
  {
    slug: "adisa-road-runner",
    name: "ADISA Road Runner",
    sourcePrice: 10987,
    imageCount: 6,
    sizes: [5.5, 6, 6.5, 7, 7.5, 8, 8.5, 9, 9.5],
    colors: ["Blue", "Green", "Black", "Pink", "White/Grey"],
    category: "athletic",
    shortDesc: "Classic retro road runner with a soft-soled height-increasing TPR sole.",
    description:
      "A men's classic retro road runner. Fabric upper and man-made fibres give a breathable build " +
      "that helps the foot stay cool through daily fitness and outdoor use. Stabilizing support and " +
      "pronation control keep the ride level on long runs. A soft, height-increasing TPR sole adds " +
      "comfort and a quiet lift for casual outings — shopping, dating, daily walkabout. 4.9 stars with " +
      "49 reviews. Fits true to size for 92% of men.",
    rating: 4.9,
    reviews: 49,
  },
  {
    slug: "adisa-platform-loafer",
    name: "ADISA Platform Loafer",
    sourcePrice: 16191,
    imageCount: 2,
    sizes: [6, 6.5, 7, 7.5, 8, 8.5],
    colors: ["Black", "Brown", "Tan", "Leopard"],
    category: "loafers",
    shortDesc: "Platform height-increasing low-top loafer for all-day casual comfort.",
    description:
      "A men's platform loafer with a quiet height-increasing lift. Low-top silhouette gives a " +
      "comfortable fit around the ankle for all-day casual wear; lace-up closure secures the foot. " +
      "Four colourways including a Leopard print for the man who wants to be remembered. 4.8 stars " +
      "with 199 reviews; #2 Best Seller from this line. Fits true to size for 92% of men.",
    rating: 4.8,
    reviews: 199,
  },
  {
    slug: "adisa-stability-runner",
    name: "ADISA Stability Runner",
    sourcePrice: 12282,
    imageCount: 15,
    sizes: [5.5, 6, 6.5, 7, 7.5, 8, 8.5, 9, 9.5, 10],
    colors: ["Black", "Grey", "White"],
    category: "athletic",
    shortDesc: "Stability road runner with pronation support for flat-footed men.",
    description:
      "A men's road-running shoe built around stability. Pronation support keeps the foot aligned " +
      "for flat-footed runners; the low-top upper height lets the ankle move freely through the " +
      "stride. Lace-up closure secures the fit through athletic activity. 4.4 stars. Fits true to " +
      "size for 86% of men. Pre-order; delivery estimated between August 8–20.",
    rating: 4.4,
    reviews: 7,
  },
  {
    slug: "adisa-slipon-sport",
    name: "ADISA Slip-On Sport",
    sourcePrice: 13388,
    imageCount: 9,
    sizes: [5.5, 6, 6.5, 7, 7.5, 8, 8.5, 9, 9.5, 10, 10.5, 11, 12, 12.5, 13],
    colors: ["Black", "Grey"],
    category: "loafers",
    shortDesc: "Slip-on sport shoe suitable for running, training, and hiking.",
    description:
      "A men's slip-on sport shoe that takes you from running to training to hiking without unlacing. " +
      "Slip-on closure for quick, hassle-free wear; solid colourway keeps it clean. Designed for " +
      "all-season wear across athletic, training, and outdoor use. 4.6 stars with 31K+ sold and 3,625 " +
      "reviews. Fits true to size for 95% of men.",
    rating: 4.6,
    reviews: 3625,
  },
  {
    slug: "adisa-lifestyle-lowtop",
    name: "ADISA Lifestyle Low-Top",
    sourcePrice: 15625,
    imageCount: 9,
    sizes: [5.5, 6, 6.5, 7, 7.5, 8, 8.5, 9, 9.5, 10, 10.5, 11],
    colors: ["Black", "White"],
    category: "sneakers",
    shortDesc: "Fashion lace-up low-top with a fabric lining for comfortable all-day walking.",
    description:
      "A men's lifestyle low-top sneaker built for daily casual and outdoor walking. Round toe, " +
      "fabric lining, and a low-top profile keep the foot comfortable through long days. Trendy " +
      "minimalist styling lets it pair with anything. All-season wear — spring rain to harmattam " +
      "dust. 4.7 stars with 3.1K+ sold and 364 reviews. Fits true to size for 94% of men.",
    rating: 4.7,
    reviews: 364,
  },
  {
    slug: "adisa-breathable-trainer",
    name: "ADISA Breathable Trainer",
    sourcePrice: 11332,
    imageCount: 8,
    sizes: [5.5, 6, 6.5, 7, 7.5, 8, 8.5, 9, 9.5, 10, 10.5, 11.5],
    colors: ["Black", "Grey"],
    category: "athletic",
    shortDesc: "Breathable light low-top training shoe with a durable non-slip outdoor sole.",
    description:
      "A men's breathable trainer — light, low-top, and built for the daily run. The non-slip " +
      "outsole gives traction on rough outdoor ground; engineered mesh upper keeps the foot cool " +
      "when the work picks up. Two colourways. 5.0 stars. Free standard shipping; arrives in Nigeria " +
      "in as little as 5 days.",
    rating: 5.0,
    reviews: 30,
  },
  {
    slug: "adisa-fashion-loafer",
    name: "ADISA Fashion Loafer",
    sourcePrice: 10979,
    imageCount: 11,
    sizes: [6, 6.5, 7, 7.5, 8, 8.5, 9, 9.5, 10],
    colors: ["Black", "Tan", "Brown", "Burgundy"],
    category: "loafers",
    shortDesc: "Fashionable slip-on loafer suitable for both running and casual wear.",
    description:
      "A men's fashion slip-on loafer that bridges running shoe and casual shoe. Slip-on construction " +
      "for fast mornings; the footbed is built for both comfort and some athletic give. Four " +
      "colourways to match work, weekend, and travel fits. 4.7 stars with 1,355 reviews and 21K+ sold. " +
      "Fits true to size for 94% of men. Standard free shipping; arrives in Nigeria in as little as 5 days.",
    rating: 4.7,
    reviews: 1355,
  },
  {
    slug: "adisa-plover-loafer",
    name: "ADISA Plover British Loafer",
    sourcePrice: 13761,
    imageCount: 9,
    sizes: [5.5, 6, 6.5, 7, 7.5, 8, 8.5, 9, 9.5, 11],
    colors: ["Brown", "Black"],
    category: "loafers",
    shortDesc: "Retro British-style loafer with round toe and wear-resistant slip-on build.",
    description:
      "A men's doudou low-top casual loafer in a retro British silhouette. Slip-on closure for easy " +
      "wear; round toe gives the foot room; wear-resistant build means the shoe keeps its composure " +
      "through daily work commutes and casual outings. Two colourways. 4.8 stars with 792 sold. " +
      "Fits true to size for 92% of men. Standard free shipping; arrives in Nigeria in as little as 5 days.",
    rating: 4.8,
    reviews: 47,
  },
  {
    slug: "adisa-zhenyuez-slipon",
    name: "ADISA Slip-On Summer",
    sourcePrice: 12174,
    imageCount: 5,
    sizes: [5.5, 6, 6.5, 7, 7.5, 8, 8.5, 9, 9.5, 10.5],
    colors: ["Black", "Beige", "Grey"],
    category: "loafers",
    shortDesc: "Summer minimalist slip-on loafer for casual daily wear and outdoor hiking.",
    description:
      "A men's summer slip-on built for the heat. Fabric upper and lining keeps the air moving; the " +
      "slip-on closure is fast and forgiving. Suits daily casual wear, dining, and outdoor hiking — " +
      "one shoe that goes anywhere in the warm months. Three colourways. 4.5 stars. Fits true to size " +
      "for 87% of men.",
    rating: 4.5,
    reviews: 57,
  },
  {
    slug: "adisa-tikp-thong",
    name: "ADISA Thong Slide",
    sourcePrice: 8019,
    imageCount: 8,
    sizes: [4.5, 5.5, 6.5, 7.5, 8.5, 9],
    colors: ["Black", "Navy", "Brown", "Olive"],
    category: "sandals",
    shortDesc: "Men's textile thong sandal with woven strap, EVA sole, summer build.",
    description:
      "A men's casual thong sandal with a woven strap — purpose-built for hot summer days. EVA sole " +
      "gives non-slip traction; EVA insole gives cushioning and comfort; the lightweight man-made " +
      "fibre fabric upper lets the air through. Four colourways. 4.6 stars with 148 reviews and 2.1K+ " +
      "sold. Fits true to size for 84% of men. Free standard shipping via Speedaf and GIG; arrives in " +
      "Nigeria in as little as 5 days. 90-day returns, N1,600 credit for delays, return protection.",
    rating: 4.6,
    reviews: 148,
  },
  {
    slug: "adisa-2026-casual",
    name: "ADISA 2026 Casual Slide",
    sourcePrice: 12105,
    imageCount: 6,
    sizes: [5.5, 6, 6.5, 7, 7.5, 8, 8.5, 9, 9.5, 10],
    colors: ["Black"],
    category: "sandals",
    shortDesc: "2026 hot style single-strap slip-on sandal for beach, vacation, daily wear.",
    description:
      "A men's 2026 hot-style slip-on sandal. Single-strap construction keeps the foot secure; the " +
      "slip-on closure makes for easy wear and a fit that holds. Designed for indoor and outdoor home " +
      "use — beach, vacation, daily casual occasions, anywhere the warm weather carries you. Solid " +
      "Black colourway. 4.5 stars with 96 reviews and 1.8K sold. Fits true to size for 87% of men. " +
      "Free shipping via Speedaf and GIG; arrives in Nigeria in as little as 5 days.",
    rating: 4.5,
    reviews: 96,
  },
  {
    slug: "adisa-homehot-slide",
    name: "ADISA Woven Slide",
    sourcePrice: 9896,
    imageCount: 8,
    sizes: [7, 7.5, 8, 8.5, 9, 9.5, 10, 10.5, 11, 11.5, 12, 12.5, 13],
    colors: ["Brown", "Black"],
    category: "sandals",
    shortDesc: "Men's indoor / outdoor slip-on sandal with a non-slip woven build.",
    description:
      "A men's slip-on sandal built for indoor and outdoor wear. Non-slip woven design keeps the " +
      "foot planted wet or dry. By HOMEHOT. Two colourways. 4.6 stars with 1,816 reviews and 28K+ sold; " +
      "ranked #14 Best-Selling Item in Men's Sandals. Fits true to size for 95% of men. Free standard " +
      "shipping via Speedaf and GIG; arrives in Nigeria in as little as 5 days.",
    rating: 4.6,
    reviews: 1816,
  },
];

// Build the public Product array. imagePath is the first image; the rest
// (02..NN) become extraImages, used by the detail-page image carousel.
export const PRODUCTS: Product[] = SHOES.map((s, idx) => {
  const allImages = ALL_IMAGES(s.slug, s.imageCount);
  return {
    id: `seed-${idx + 1}`,
    slug: s.slug,
    name: s.name,
    brand: "ADISA Select",
    description: s.description,
    imagePath: allImages[0],                  // /products/<slug>/01.png
    extraImages: allImages.slice(1),          // /products/<slug>/02.png..NN.png
    sourcePrice: s.sourcePrice,
    salePrice: convertToAdisaPrice(s.sourcePrice),
    currency: "NGN" as const,
    sizesUk: s.sizes,
    colors: s.colors,
    category: s.category,
    rating: s.rating,
    reviews: s.reviews,
    isFeatured: idx % 4 === 0,
    inStock: true,
  };
});

export const getProductBySlug = (slug: string): Product | undefined =>
  PRODUCTS.find((p) => p.slug === slug);

export const getFeaturedProducts = (n = 8): Product[] =>
  PRODUCTS.filter((p) => p.isFeatured).slice(0, n);

export const getByCategory = (cat: Product["category"]): Product[] =>
  PRODUCTS.filter((p) => p.category === cat);

export const categoryLabel = (cat: Product["category"]): string =>
  ({
    sneakers: "Sneakers",
    formal: "Formal",
    boots: "Boots",
    loafers: "Loafers",
    sandals: "Sandals",
    athletic: "Athletic",
  }[cat] ?? "All Shoes");
