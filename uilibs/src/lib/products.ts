// ============================================================
//  ADISA product catalog - source-of-truth seed data.
//  One entry per downloaded shoe image in /public/shoes/.
//
//  These rows are also pushed to Supabase on first run, but
//  everything reads from them locally so the site works even
//  without Supabase (useful for previews).
// ============================================================
import type { Product } from "./types";
import { convertToAdisaPrice } from "./pricing";

const SIZES_SMALL  = [6, 7, 8, 9];
const SIZES_STD    = [6, 7, 8, 9, 10, 11];
const SIZES_WIDE   = [7, 8, 9, 10, 11, 12, 13];

interface RawShoe {
  slug: string;
  name: string;
  file: string;
  sourcePrice: number; // ₦ in the source country
  sizes: number[];
  colors: string[];
  category: Product["category"];
  shortDesc: string;
}

// File IDs (without .png) from your Drive
const SHOES: RawShoe[] = [
  { slug: "oluwa-runner",       name: "OLUWA Runner",         file: "1-qJSr_PPQHNuCL5-QlNi_2YuYl4Zechj", sourcePrice: 8500, sizes: SIZES_STD, colors: ["Black","White"], category: "sneakers", shortDesc: "Lightweight breathable running shoe with a cushioned heel and durable rubber sole for everyday wear." },
  { slug: "darosa-oxford",      name: "DAROSA Oxford",        file: "10N5lr89eOLZ5hS1fJpDa3tH00ZFBmDEK", sourcePrice: 15000, sizes: SIZES_STD, colors: ["Black","Brown"], category: "formal", shortDesc: "A timeless Oxford silhouette in premium leather, Goodyear-welted sole, padded insole — an elegant men's formal shoe." },
  { slug: "iroko-boot",         name: "IROKO Boot",           file: "10zIYeCgkqyZrimCFN3sILsaNQ_Et1fDn", sourcePrice: 12000, sizes: SIZES_WIDE, colors: ["Brown","Black"], category: "boots", shortDesc: "All-day city boot: water-resistant upper, ankle support, cushioned sole. Built for Lagos streets." },
  { slug: "oris-trekker",       name: "ORIS Trekker",         file: "11UjW1nXPno6B95e36KYN-Wlu_f7yX8xZ", sourcePrice: 9000, sizes: SIZES_WIDE, colors: ["Khaki","Olive"], category: "boots", shortDesc: "Hiking-inspired boot with grippy lugged outsole and a cushioned EVA midsole for men who move on rough paths." },
  { slug: "obinze-court",       name: "OBINZE Court",         file: "12SkfD_9pXwR6625d9PsYgipW4h0y73uC", sourcePrice: 8800, sizes: SIZES_STD, colors: ["White","Navy"], category: "sneakers", shortDesc: "A minimalist leather court sneaker — clean lines, soft footbed and a vulcanised rubber outsole." },
  { slug: "sango-trainer",      name: "SANGO Trainer",        file: "12buWw_pZLkDWib13gmvZgsvQ6-4_8usk", sourcePrice: 11500, sizes: SIZES_WIDE, colors: ["Black","Red"], category: "athletic", shortDesc: "Cushioned road trainer with engineered mesh upper and responsive foam midsole — built for the daily run." },
  { slug: "ade-loafer",         name: "ADE Loafer",           file: "12pUyV9og-s-Di09x-ZQ1K-uhCMXy0sCy", sourcePrice: 10500, sizes: SIZES_STD, colors: ["Tan","Black"], category: "loafers", shortDesc: "Slip-on penny loafer in soft suede with a leather footbed — a quiet flex for business-casual days." },
  { slug: "okechukwu-boot",      name: "OKE Boot",             file: "15Fh2sRJcsRYgie-_Dpspbor1sOfBbJnj", sourcePrice: 14000, sizes: SIZES_WIDE, colors: ["Black"], category: "boots", shortDesc: "Chelsea boot silhouette with elastic side panels and a stacked heel — sharp for trousers or jeans." },
  { slug: "ore-formal",         name: "ORE Formal",          file: "16VYU37IbweHeVCQ4578GmbdO4IEmwEPy", sourcePrice: 16000, sizes: SIZES_STD, colors: ["Black"], category: "formal", shortDesc: "Cap-toe formal in polished calf leather with a Blake-stitched sole — the wedding / boardroom staple." },
  { slug: "olu-high",           name: "OLU High-Top",        file: "179XdhBE0bwU2jOepvli2aC5K9SSDimOG", sourcePrice: 9200, sizes: SIZES_STD, colors: ["Black","Cream"], category: "sneakers", shortDesc: "Padded-collar high-top sneaker in soft canvas with a quiet ankle-hugging fit." },
  { slug: "tunde-sandal",       name: "TUNDE Sandal",        file: "1Abtad6UhwrlY_t-80BGaRE5Jk-hD5tuG", sourcePrice: 8000, sizes: SIZES_SMALL, colors: ["Brown"], category: "sandals", shortDesc: "Strappy leather slide with moulded footbed — breathable, easy, and dignified." },
  { slug: "emeka-brogue",       name: "EMEKA Brogue",        file: "1Dminvtv1CDXJP0FtKBy5ntPwfzCAJKiI", sourcePrice: 17000, sizes: SIZES_STD, colors: ["Burgundy","Black"], category: "formal", shortDesc: "Wingtip brogue in burnished leather — broguing detail that earns a second look without losing authority." },
  { slug: "baba-slipon",        name: "BABA Slip-On",        file: "1Hm0ugScYj7qHs02Gi0LNi_tM-u9A32Jj", sourcePrice: 9500, sizes: SIZES_STD, colors: ["Grey"], category: "loafers", shortDesc: "Padded collar slip-on with elastic gusset for an instant pull-on-and-go day shoe." },
  { slug: "ola-chukka",        name: "OLA Chukka",          file: "1J825EJtVZBLG08tDGMKcq7BdBnMtW92C", sourcePrice: 11000, sizes: SIZES_WIDE, colors: ["Sand","Brown"], category: "boots", shortDesc: "Ankle-high chukka in suede with a crepe-textured sole — quiet, comfortable, classic." },
  { slug: "femi-lowcut",        name: "FEMI Low-Cut",        file: "1J8NSo_aVXH5GOT1KwMSz5keA6K5XHoMC", sourcePrice: 8500, sizes: SIZES_SMALL, colors: ["White","Cream"], category: "sneakers", shortDesc: "Low-cut canvas sneaker with a vintage court profile and soft comfort insole." },
  { slug: "tope-shoe",          name: "TOPE Court",          file: "1NfHnJCAyyEdW7whumFH_oOlhbsTsgJq-", sourcePrice: 9000, sizes: SIZES_STD, colors: ["Black"], category: "sneakers", shortDesc: "All-black court shoe — a single tone, one statement, day-to-night ready." },
  { slug: "yemi-runner",        name: "YEMI Runner",         file: "1PWuBdFfCD63kUIadQYFeH0Rh0Ma86lq-", sourcePrice: 11500, sizes: SIZES_WIDE, colors: ["Blue","Black"], category: "athletic", shortDesc: "Distance trainer with a rockered midsole for forward momentum and a stretch-knit upper for breathability." },
  { slug: "kola-derby",         name: "KOLA Derby",          file: "1PaxNEJSShtcfRnZMLpJbHDaAdbq9sGx9", sourcePrice: 13000, sizes: SIZES_STD, colors: ["Brown"], category: "formal", shortDesc: "Open-laced derby in tan leather — versatile between suit and denim." },
  { slug: "bayo-boot",          name: "BAYO Boot",           file: "1QFw26FCr6pZlnY130hF8WZQmvyFkzC90", sourcePrice: 12500, sizes: SIZES_WIDE, colors: ["Brown"], category: "boots", shortDesc: "A round-toe work boot in oiled pull-up leather with a cork-bed midsole and a weatherproof feel." },
  { slug: "kayode-court",       name: "KAYODE Court",        file: "1Q_bdVeqjPux4IaRHWlgHqiK1Q9l49wOT", sourcePrice: 9500, sizes: SIZES_STD, colors: ["White"], category: "sneakers", shortDesc: "Crisp white court sneaker with a leather upper and soft terry lining." },
  { slug: "adeola-runner",     name: "ADEOLA Runner",       file: "1R2C_235cecGzpRELaWhAXf8ETTpD6jQ9", sourcePrice: 11500, sizes: SIZES_WIDE, colors: ["Silver","Grey"], category: "athletic", shortDesc: "Neutral road runner with a cloud-soft midsole and reflective heel detailing." },
  { slug: "olu-ceo",              name: "OLU CEO",              file: "1RICSlHe-UeF5Q_y-RBrdEbdy7B7LItH7", sourcePrice: 17500, sizes: SIZES_STD, colors: ["Black"], category: "formal", shortDesc: "Whole-cut formal in mirror-polished leather — a single piece of leather, sleek and ceremonial." },
  { slug: "nonso-loafer",       name: "NONSO Loafer",        file: "1RSNIcvTg70kkq-c56CLM9X6hF2vFw4TH", sourcePrice: 9000, sizes: SIZES_STD, colors: ["Black"], category: "loafers", shortDesc: "Square-toe loafer in glossy patent-style leather — red-carpet ready, desk-day confident." },
  { slug: "ife-sneaker",        name: "IFE Sneaker",        file: "1SWdA3Vnm7fHoJS4ig0iCAFy-LcN3snMC", sourcePrice: 10500, sizes: SIZES_STD, colors: ["Multi"], category: "sneakers", shortDesc: "Colour-blocked lifestyle sneaker with a soft cushioned midsole — comfort with a personality." },
  { slug: "chidi-boot",          name: "CHIDI Boot",          file: "1SZk4k363LkEcSwtvO2mmmuynXfKZemmV", sourcePrice: 13500, sizes: SIZES_WIDE, colors: ["Black"], category: "boots", shortDesc: "Lace-up ankle boot with a side-zip and padded collar — all weather, all terrain." },
  { slug: "segun-runner",        name: "SEGUN Runner",       file: "1V4XKY5OvC1mfGsVxzSP7kzAtN1TeoO2S", sourcePrice: 9000, sizes: SIZES_WIDE, colors: ["Black","White"], category: "athletic", shortDesc: "Stability road runner with a contoured heel and a breathable engineered-mesh upper." },
  { slug: "obi-shoe",            name: "OBI Footwear",        file: "1VEFNs8MOBUzeTBSXkG7yWyITedzN341x", sourcePrice: 16500, sizes: SIZES_STD, colors: ["Oxblood"], category: "formal", shortDesc: "Whole-cut oxford in oxblood leather — the cult-classic evening-shoe silhouette." },
  { slug: "taiwo-boot",          name: "TAIWO Boot",          file: "1Y6qYNnqd-VLc3ydpw_DyaonQku32o_m0", sourcePrice: 11500, sizes: SIZES_WIDE, colors: ["Brown"], category: "boots", shortDesc: "Desert boot in nubuck with a gum sole from the desert-war era, updated for the city." },
  { slug: "kehinde-court",       name: "KEHINDE Court",       file: "1alJRTatQD2AO-lOHobIM1OkwN025jpd4", sourcePrice: 8800, sizes: SIZES_STD, colors: ["White"], category: "sneakers", shortDesc: "Vintage tennis court silhouette, refreshed with a clean white leather upper." },
  { slug: "sola-slip",            name: "SOLA Slip-On",        file: "1cb1sPR1SPUTOS3Ngs9r4wsCy1VlyaDBO", sourcePrice: 9000, sizes: SIZES_STD, colors: ["Grey"], category: "loafers", shortDesc: "Soft suede slip-on with a hidden elastic that hugs the foot without laces." },
  { slug: "wale-loafer",         name: "WALE Loafer",         file: "1d-XgpZjLu84Y0Cfpcc7-_F5AEWmG5IVo", sourcePrice: 9500, sizes: SIZES_STD, colors: ["Black","Burgundy"], category: "loafers", shortDesc: "Tassel-detail penny loafer in a hand-polished leather upper." },
  { slug: "chinwe-sand",          name: "CHINWE Sandal",       file: "1ddGMWTpaiR40XFDrmsCEn_ZYDHfIjgUY", sourcePrice: 8000, sizes: SIZES_SMALL, colors: ["Brown"], category: "sandals", shortDesc: "Two-strap leather sandal with a contoured footbed — built for warm-climate commuting." },
  { slug: "kunle-boot",           name: "KUNLE Boot",          file: "1fhxU25p7_cKKA-D6ntrXUOuyC4hpNEPw", sourcePrice: 12500, sizes: SIZES_WIDE, colors: ["Tan","Brown"], category: "boots", shortDesc: "Lace-up field boot in waxy grain leather with a waxy finish and grippy rubber outsole." },
  { slug: "nkechi-athletic",      name: "NKECHI Athletic",     file: "1i4PlfnU2Xzyi8IvLMETxONi35-445Ok_", sourcePrice: 12000, sizes: SIZES_WIDE, colors: ["Teal","Black"], category: "athletic", shortDesc: "Trail runner with a stone-plate underfoot and a lugged outsole for off-road grip." },
  { slug: "tito-trainer",         name: "TITO Trainer",        file: "1iOJiww5-DpsZD1pvA73KU_2ow_xtK2Xa", sourcePrice: 11500, sizes: SIZES_WIDE, colors: ["Orange","Grey"], category: "athletic", shortDesc: "Pronation-support road trainer with a structured medial post and a wide base." },
  { slug: "ebuka-formal",         name: "EBUKA Formal",        file: "1ibXDuIxGmZJF28wBkYlx7s3SDLr-_13E", sourcePrice: 16000, sizes: SIZES_STD, colors: ["Black"], category: "formal", shortDesc: "Patent formal oxford with a grosgrain bow — made for the occasions that mark a man." },
  { slug: "iman-court",           name: "IMAN Court",          file: "1ixgZAfN1CSuBZCM1uMXt_yXUILefv0D-", sourcePrice: 8500, sizes: SIZES_STD, colors: ["White","Black"], category: "sneakers", shortDesc: "Two-tone court sneaker — a soft bath of leather, a vulcanised sole." },
  { slug: "sola-derby",           name: "SOLA Derby",          file: "1j_QrJKeDdGL7b0Uie-vzDqUkwiQthfyW", sourcePrice: 13000, sizes: SIZES_STD, colors: ["Tan"], category: "formal", shortDesc: "Aerator derby with a blucher lacing and a hand-stained tan leather upper." },
  { slug: "bode-boot",             name: "BODE Boot",          file: "1jamWz3Sd9SG-s0cVuiXhzLPM8Fdws3dF", sourcePrice: 11500, sizes: SIZES_WIDE, colors: ["Espresso"], category: "boots", shortDesc: "Lace-up espresso boot with a side-zip and stack heel — city or country." },
  { slug: "gboyega-high",          name: "GBOYEGA High",        file: "1krJd7e8x9tHX7UB1_ROQxd0u-8R8_5rb", sourcePrice: 9000, sizes: SIZES_STD, colors: ["Red"], category: "sneakers", shortDesc: "Skater-style high-top with a padded tongue and reinforced ollie zone — for the city skater kid." },
  { slug: "ndidi-sand",            name: "NDIDI Slide",         file: "1l8LH3lfYyBtTnpmXy-A6iqw6c3JURor8", sourcePrice: 8000, sizes: SIZES_SMALL, colors: ["Brown"], category: "sandals", shortDesc: "Single-strap cushioned slide that wears like a memory." },
  { slug: "ifeanyi-casual",        name: "IFEANYI Casual",      file: "1lYKmekcHwLgbDjnFexHx61OrsO457VNQ", sourcePrice: 8200, sizes: SIZES_STD, colors: ["White"], category: "sneakers", shortDesc: "Old-school cup-sole sneaker with a soft leather upper and an easy-lace tongue." },
  { slug: "zino-oxford",           name: "ZINO Oxford",        file: "1m8Y2rXdlGcUqQqDD6vVciJvpPYWdAyS-", sourcePrice: 14000, sizes: SIZES_STD, colors: ["Black"], category: "formal", shortDesc: "Hand-finished oxford with a closed-lacing silhouette — the all-purpose menswear classic." },
  { slug: "uche-penny",            name: "UCHE Penny",         file: "1nbaj255a9dcZSW87-5VO2JS0Dtnnz5TT", sourcePrice: 9000, sizes: SIZES_STD, colors: ["Tan"], category: "loafers", shortDesc: "Classic penny loafer — the leather saddle creases the way you walk." },
  { slug: "emeka-slip",            name: "EMEKA Slip-On",      file: "1oAwtC9xre8Hn7OVQnGguOnN8uxtQ9UfA", sourcePrice: 9500, sizes: SIZES_STD, colors: ["Navy"], category: "loafers", shortDesc: "Slip-on driver in deep navy suede with a dotted-rubber outsole." },
  { slug: "gbenga-court",          name: "GBENGA Court",       file: "1p1FdJfYC-atK_PKY0uEZcJ6N7R3k-SOj", sourcePrice: 8800, sizes: SIZES_STD, colors: ["Black","Cream"], category: "sneakers", shortDesc: "Cup-sole sneaker with padding at the collar and a stitched-down toe cap." },
  { slug: "segun-brogue",          name: "SEGUN Brogue",       file: "1pqNFt9dbf4TC58uvkjxoC3fZBkxQzp27", sourcePrice: 13500, sizes: SIZES_STD, colors: ["Tan"], category: "formal", shortDesc: "Longwing brogue in tan with a full broguing pattern and a single oak-tanned sole." },
  { slug: "dayo-derby",            name: "DAYO Derby",          file: "1veLKP72dFDH7A8JK1P9W1O9Md8ZVGrt4", sourcePrice: 13000, sizes: SIZES_STD, colors: ["Brown"], category: "formal", shortDesc: "Plain-toe derby with a relaxed last and a hand-finished brown patina." },
  { slug: "ola-court",             name: "OLA Court",          file: "1xWbxosWdjzYlAuq6DGF_dGLgeuzBUjMh", sourcePrice: 8800, sizes: SIZES_STD, colors: ["Cream"], category: "sneakers", shortDesc: "Soft cream leather court shoe with a vulcanised midsole and warm-weather feel." },
  { slug: "nina-canvas",           name: "NINA Canvas",         file: "1yO9InkijzW8twYL5x_xTAGTLXEf8dBOO", sourcePrice: 8200, sizes: SIZES_STD, colors: ["Black","White"], category: "sneakers", shortDesc: "Hemp-canvas low-top with a recycled rubber sole — light, breathable, daily." },
];

export const PRODUCTS: Product[] = SHOES.map((s, idx) => ({
  id: `seed-${idx + 1}`,
  slug: s.slug.replace(/\s/g, ""),
  name: s.name.trim(),
  brand: "ADISA Select",
  description: `${s.shortDesc} Available in UK sizes ${Math.min(...s.sizes)}${s.sizes.length ? "-" + Math.max(...s.sizes) : ""} (Nigeria ${(Math.min(...s.sizes) + 35)}-${Math.max(...s.sizes) + 35}).`,
  imagePath: `/shoes/${s.file}.png`,
  extraImages: [],
  sourcePrice: s.sourcePrice,
  salePrice: convertToAdisaPrice(s.sourcePrice),
  currency: "NGN",
  sizesUk: s.sizes,
  colors: s.colors,
  category: s.category,
  rating: 4.4 + ((idx % 11) / 100) + (idx % 7) * 0.01,
  reviews: 30 + ((idx * 7) % 200),
  isFeatured: idx % 4 === 0,
  inStock: true,
}));

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
