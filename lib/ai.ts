import Groq from "groq-sdk";

const VISION_MODEL = "meta-llama/llama-4-scout-17b-16e-instruct";
const TEXT_MODEL = "meta-llama/llama-4-scout-17b-16e-instruct";

function getClient(): Groq {
  const apiKey = process.env.GROQ_API_KEY;
  if (!apiKey) throw new Error("GROQ_API_KEY nu este setat in variabilele de mediu.");
  return new Groq({ apiKey });
}

export interface PhotoScore {
  index: number;
  score: number;
  feedback: string;
  isRecommendedCover: boolean;
}

export interface MarketInsight {
  priceRange: { min: number; max: number };
  currency: string;
  demand: string;
  bestDays: string[];
  seasonality: string;
  tips: string[];
}

export interface AnalysisResult {
  photos: PhotoScore[];
  category: string;
  title: string;
  description: string;
  tags: string[];
  market?: MarketInsight;
}

export interface PriceEstimate {
  min: number;
  max: number;
  currency: string;
  suggestedPrice: number;
  justification: string;
  negotiationTips: string[];
}

export interface TitleVariant {
  title: string;
  explanation: string;
  platform: string;
}

export interface ListingCheck {
  overallScore: number;
  titleScore: number;
  descriptionScore: number;
  titleFeedback: string;
  descriptionFeedback: string;
  improvements: string[];
  strengths: string[];
}

export async function analyzeListingImages(
  imageBase64List: { data: string; mediaType: string }[],
  description: string,
  platform: string,
  language: "ro" | "en",
  vintedType?: "original" | "replica"
): Promise<AnalysisResult> {
  const langBlock =
    language === "ro"
      ? `LIMBA: Raspunde EXCLUSIV in romana. Titlul, descrierea si tagurile trebuie scrise corect in limba romana, fara anglicisme inutile.`
      : `LANGUAGE: Respond EXCLUSIVELY in English. Title, description and tags must be in English.`;

  const platformBlock =
    platform === "olx"
      ? `PLATFORMA: OLX Romania.
- Titlu max 70 caractere - contorizeaza strict
- Cumparatorii cauta: brand + model + specificatii + stare
- Tonul descrierii: direct, de incredere, fara exagerari
- Pretul nu se mentioneaza in descriere`
      : platform === "vinted"
      ? `PLATFORMA: Vinted.
- Titlu max 60 caractere
- Focus pe: brand, tip articol, culoare/print, marime, stare
- Cumparatorii cauta autenticitate si transparenta despre stare
- Mentioneaza materialul si eventualele defecte minor
${vintedType === "replica" ? "- IMPORTANT: Produsul este o REPLICA / REP. Specifica OBLIGATORIU in titlu si descriere ca este replica, NU original. Este ilegal sa vinzi replica ca original pe Vinted." : "- Produsul este ORIGINAL / AUTENTIC - subliniaza autenticitatea"}`
      : `PLATFORMA: OLX si Vinted (optimizeaza pentru ambele).
- Titlu max 65 caractere, versatil pentru ambele platforme
- Echilibru intre specificatii tehnice si detalii de stare`;

  const imageContent = imageBase64List.map((img) => ({
    type: "image_url" as const,
    image_url: { url: `data:${img.mediaType};base64,${img.data}` },
  }));

  const prompt = `Esti un expert marketplace copywriter cu 10+ ani experienta pe OLX si Vinted Romania. Stii exact ce cauta cumparatorii, ce titluri primesc click si cum sa scrii descrieri care vand rapid.

${langBlock}

${platformBlock}

DESCRIERE UTILIZATOR: "${description || "Fara descriere suplimentara - deduce din imagini."}"

SCORING FOTOGRAFII (noteaza fiecare 1-10):
+3p  Iluminare perfecta - produs clar vizibil, fara umbre dure
+2p  Claritate si rezolutie ridicata - nu e blur, nu e pixelat
+2p  Fundal neutru/curat - alb, gri, sau non-distractiv
+1p  Unghiuri multiple sau detalii relevante
+1p  Prezentare profesionala - cadraj, compozitie
+1p  Starea produsului vizibila si corect prezentata
-2p  Fotografie intunecata, neclara, pixelata
-1p  Fundal aglomerat sau distractiv
-1p  Unghi care ascunde defecte sau detalii importante

FEEDBACK-ul trebuie sa fie SPECIFIC si ACTIONABIL:
Bun: "Fundal inchis la culoare - fotografiaza pe o masa alba langa geam pentru lumina naturala"
Prost: "Iluminare slaba"

FORMULA TITLU:
OLX:    [Brand] [Model] [Spec-cheie] [Stare] - [Hook/Avantaj]
Vinted: [Brand] [Tip articol] [Culoare/Print] [Marime] [Stare]

Reguli titlu:
- Pune cuvantul cel mai cautat PRIMUL (brand sau tip produs)
- Include cifre/specificatii: "256GB", "XL", "2024", "6 luni"
- Cuvinte de stare care convertesc: "Ca Nou", "Impecabil", "Sigilat", "Fara Defecte"
- Hook diferentiator: "Garantie", "Factura", "Cutie Originala", "Livrare Rapida"
- NU: majuscule excesive, "!!!", "URGENT", "SUPER OFERTA" - scad credibilitatea
- Exemplu bun OLX: "iPhone 14 Pro 128GB Negru - Impecabil, Garantie Apple"
- Exemplu bun Vinted: "Zara rochie maxi floral S Noua, etichete"

FORMULA DESCRIERE (120-220 cuvinte):
Structura pentru OLX:
1. HOOK (1 propozitie): Cel mai puternic beneficiu sau caracteristica
2. SPECIFICATII: 4-6 bullet points concise cu detalii tehnice esentiale
3. STARE: Descriere sincera si specifica - zgarieturi? Cutie? Accesorii incluse?
4. INCREDERE: Un detaliu care construieste credibilitate (cumparat in [an], folosit [luni])
5. CTA: "Suna sau trimite mesaj pentru mai multe detalii sau sa stabilim intalnire."

Structura pentru Vinted:
1. Prezentare scurta (brand, tip, material)
2. Marime exacta + masuratori daca e imbracaminte
3. Stare detaliata (purtat de cate ori? defecte?)
4. Motivul vanzarii (optional, umanizeaza)

TAGURI (8-12 taguri):
Strategie: 3 exact-match + 3 categorie broad + 2-3 use-case + 2 stare/tip
- Brand + model exact (cum cauta oamenii)
- Categorie generica (telefon, haine, pantofi)
- Sinonime si variante de scriere
- Stare: "second hand", "ca nou", "sigilat"
- Platform-keywords populare pe OLX/Vinted Romania

CATEGORIE:
Foloseste categoriile standard OLX: "Electronice > Telefoane Mobile", "Moda > Femei > Rochii", etc.

ANALIZA DE PIATA:
Estimeaza bazat pe produsul identificat din imagini si descriere:
- priceRange.min: pretul la care s-ar vinde rapid pe piata romaneasca (RON)
- priceRange.max: pretul ideal de start pentru negociere (RON)
- demand: "scazut" | "mediu" | "ridicat" - cererea pentru aceasta categorie pe OLX/Vinted Romania
- bestDays: 2-3 zile din saptamana cu cel mai mult trafic pentru aceasta categorie
- seasonality: un singur rand despre sezonalitate (max 60 caractere)
- tips: exact 3 sfaturi specifice si actionabile pentru ACEST produs concret

OUTPUT - returneaza EXCLUSIV JSON valid, fara text inainte sau dupa:
{
  "photos": [
    {
      "index": 0,
      "score": 8,
      "feedback": "Iluminare buna si fundal curat. Adauga un unghi din spate pentru a arata starea completa.",
      "isRecommendedCover": true
    }
  ],
  "category": "Electronice > Telefoane Mobile",
  "title": "iPhone 14 Pro 128GB Negru - Impecabil, Garantie Apple",
  "description": "Descriere completa 120-220 cuvinte conform formulei de mai sus.",
  "tags": ["iPhone 14 Pro","Apple","telefon","smartphone","128GB","5G","iOS","second hand","ca nou","garantie","iPhone","mobile"],
  "market": {
    "priceRange": { "min": 3200, "max": 3800 },
    "currency": "RON",
    "demand": "ridicat",
    "bestDays": ["Marti","Joi","Sambata"],
    "seasonality": "Produs cautat tot anul, varf in septembrie-octombrie",
    "tips": [
      "Mentioneaza garantia ramasa si include factura - creste pretul cu 15%",
      "Fotografiaza ecranul pornit si bateria din Setari pentru mai multa incredere",
      "Posteaza intre 18:00-20:00 cand traficul OLX este maxim"
    ]
  }
}`;

  const response = await getClient().chat.completions.create({
    model: VISION_MODEL,
    max_tokens: 3000,
    temperature: 0.3,
    messages: [
      {
        role: "user",
        content: [
          ...imageContent,
          { type: "text" as const, text: prompt },
        ],
      },
    ],
  });

  const text = response.choices[0]?.message?.content ?? "";
  const jsonMatch = text.match(/\{[\s\S]*\}/);
  if (!jsonMatch) throw new Error("Invalid AI response format");

  return JSON.parse(jsonMatch[0]) as AnalysisResult;
}

export async function estimatePrice(
  description: string,
  language: "ro" | "en",
  productType?: "original" | "replica"
): Promise<PriceEstimate> {
  const isRo = language === "ro";

  const systemMessage = productType === "replica"
    ? (isRo
      ? `Esti expert in preturi second-hand Romania. REGULA ABSOLUTA: Produsul este o REPLICA/CONTRAFACUTA, NU original. Pretul OBLIGATORIU trebuie sa fie de 5-15% din pretul originalului. Exemple REPLICA pe piata romaneasca: Jordan/Nike/Adidas replica=50-180 RON | Louis Vuitton replica=80-200 RON | Geanta luxury replica=60-250 RON | Ceas luxury replica=40-200 RON | Haine brand replica=30-120 RON. NICIODATA nu estima replica la pretul originalului. Mentioneaza explicit in justificare ca este replica.`
      : `You are a Romanian second-hand market expert. ABSOLUTE RULE: This is a REPLICA/FAKE product. Price it at 5-15% of the original's value. NEVER price a replica at original price. Note it's a replica in the justification.`)
    : productType === "original"
    ? (isRo
      ? `Esti expert in preturi second-hand Romania. Produsul este ORIGINAL / AUTENTIC. Estimeaza la pretul de piata pentru produse autentice. Calibrare 2025: Jordan 4 original nou=900-1400 RON | Jordan 4 second=600-1000 RON | Nike SB Dunk original=700-2500 RON | Sneakers Nike/Adidas original nou=400-1200 RON | Adidas Yeezy=800-2500 RON.`
      : `You are a Romanian second-hand market expert. This is an AUTHENTIC/ORIGINAL product. Price it at authentic market value.`)
    : (isRo
      ? `Esti expert in preturi pe piata second-hand din Romania (OLX, Vinted, Facebook Marketplace). Estimeaza pretul real de vanzare in RON.`
      : `You are a Romanian second-hand market pricing expert. Estimate the real selling price in RON.`);

  const calibration = isRo ? `
CALIBRARE PIATA ROMANEASCA 2025:
Telefoane second-hand: iPhone 16 Pro Max=5500-6500 RON | iPhone 15 Pro Max=4200-5000 RON | iPhone 14 Pro=3000-3800 RON | iPhone 13=1800-2500 RON | Samsung S25 Ultra=4500-5500 RON | Samsung S24=2500-3200 RON
Laptopuri: MacBook Air M2=4000-5500 RON | MacBook Pro M3=7000-10000 RON | Laptop gaming=2500-4500 RON
Console: PS5 nou=2200-2500 RON | PS5 second=1700-2100 RON | Nintendo Switch=1400-1800 RON
Electronice: AirPods Pro 2=700-1000 RON | iPad Air=2000-3000 RON | Apple Watch S9=1500-2200 RON
Sneakers ORIGINAL: Jordan 4=900-1400 RON nou | Nike SB Dunk=700-2500 RON | Yeezy=800-2500 RON | Nike/Adidas clasic=300-800 RON
Sneakers REPLICA: Jordan/Nike/Adidas replica=50-180 RON (OBLIGATORIU mult mai mic decat originalul)
Genti luxury ORIGINAL second: Louis Vuitton=1500-4000 RON | Gucci=1200-3500 RON
Genti luxury REPLICA: LV replica=80-200 RON | Gucci replica=80-250 RON

REGULI:
- Second-hand = 50-70% din pretul de nou pentru electronice
- Tine cont de stare: nou=100%, ca nou=85%, buna=70%, acceptabila=55%
- Replica = INTOTDEAUNA 5-15% din pretul originalului` : "";

  const userPrompt = isRo
    ? `${calibration}

PRODUS: "${description}"

Returneaza EXCLUSIV JSON valid:
{
  "min": 150,
  "max": 250,
  "currency": "RON",
  "suggestedPrice": 200,
  "justification": "2-3 propozitii despre pretul corect pe piata romaneasca",
  "negotiationTips": ["Sfat 1 specific", "Sfat 2", "Sfat 3"]
}`
    : `PRODUCT: "${description}"

Return ONLY valid JSON:
{
  "min": 150,
  "max": 250,
  "currency": "RON",
  "suggestedPrice": 200,
  "justification": "2-3 sentence explanation for the Romanian market",
  "negotiationTips": ["Tip 1", "Tip 2", "Tip 3"]
}`;

  const response = await getClient().chat.completions.create({
    model: TEXT_MODEL,
    max_tokens: 800,
    temperature: 0.2,
    messages: [
      { role: "system", content: systemMessage },
      { role: "user", content: userPrompt },
    ],
  });

  const text = response.choices[0]?.message?.content ?? "";
  const jsonMatch = text.match(/\{[\s\S]*\}/);
  if (!jsonMatch) throw new Error("Invalid AI response");
  return JSON.parse(jsonMatch[0]) as PriceEstimate;
}

export async function generateAlternativeTitles(
  description: string,
  platform: string,
  language: "ro" | "en"
): Promise<TitleVariant[]> {
  const isRo = language === "ro";
  const platformInfo =
    platform === "olx"
      ? (isRo ? "OLX Romania - max 70 caractere" : "OLX Romania - max 70 chars")
      : platform === "vinted"
      ? (isRo ? "Vinted - max 60 caractere" : "Vinted - max 60 chars")
      : (isRo ? "OLX si Vinted - max 65 caractere" : "OLX and Vinted - max 65 chars");

  const prompt = isRo
    ? `Esti copywriter expert pe OLX si Vinted Romania. Genereaza 3 variante de titlu diferite pentru acelasi produs.
Fiecare varianta trebuie sa foloseasca o strategie diferita (ex: una pune accent pe brand, una pe stare, una pe beneficiu).

PRODUS: "${description}"
PLATFORMA: ${platformInfo}

Returneaza EXCLUSIV JSON valid (array cu exact 3 obiecte):
[
  {
    "title": "Titlu varianta 1",
    "explanation": "De ce functioneaza aceasta varianta - 1 propozitie",
    "platform": "${platform}"
  },
  {
    "title": "Titlu varianta 2",
    "explanation": "Explicatie",
    "platform": "${platform}"
  },
  {
    "title": "Titlu varianta 3",
    "explanation": "Explicatie",
    "platform": "${platform}"
  }
]`
    : `You are an expert copywriter for OLX and Vinted Romania. Generate 3 different title variants for the same product.
Each variant must use a different strategy (e.g., one focuses on brand, one on condition, one on benefit).

PRODUCT: "${description}"
PLATFORM: ${platformInfo}

Return ONLY valid JSON (array with exactly 3 objects):
[
  {
    "title": "Title variant 1",
    "explanation": "Why this variant works - 1 sentence",
    "platform": "${platform}"
  },
  {
    "title": "Title variant 2",
    "explanation": "Explanation",
    "platform": "${platform}"
  },
  {
    "title": "Title variant 3",
    "explanation": "Explanation",
    "platform": "${platform}"
  }
]`;

  const response = await getClient().chat.completions.create({
    model: TEXT_MODEL,
    max_tokens: 700,
    temperature: 0.5,
    messages: [{ role: "user", content: prompt }],
  });

  const text = response.choices[0]?.message?.content ?? "";
  const jsonMatch = text.match(/\[[\s\S]*\]/);
  if (!jsonMatch) throw new Error("Invalid AI response");
  return JSON.parse(jsonMatch[0]) as TitleVariant[];
}

export async function checkExistingListing(
  title: string,
  description: string,
  platform: string,
  language: "ro" | "en"
): Promise<ListingCheck> {
  const isRo = language === "ro";
  const platformName = platform === "olx" ? "OLX Romania" : platform === "vinted" ? "Vinted" : "OLX si Vinted";

  const prompt = isRo
    ? `Esti expert copywriter si consultant marketplace pe OLX si Vinted Romania.
Analizeaza acest anunt existent si ofera un scor detaliat cu sugestii de imbunatatire.

PLATFORMA: ${platformName}
TITLU: "${title}"
DESCRIERE: "${description}"

Criterii evaluare titlu (max 10): brand+model(2p), stare(2p), hook(2p), lungime(2p), cuvinte cheie(2p)
Criterii evaluare descriere (max 10): structura(2p), detalii tehnice(2p), incredere(2p), CTA(2p), fara exagerari(2p)

Returneaza EXCLUSIV JSON valid:
{
  "overallScore": 7,
  "titleScore": 6,
  "descriptionScore": 8,
  "titleFeedback": "Feedback specific despre titlu in 1-2 propozitii",
  "descriptionFeedback": "Feedback specific despre descriere in 1-2 propozitii",
  "improvements": [
    "Imbunatatire concreta 1",
    "Imbunatatire concreta 2",
    "Imbunatatire concreta 3"
  ],
  "strengths": [
    "Ce functioneaza bine 1",
    "Ce functioneaza bine 2"
  ]
}`
    : `You are an expert copywriter and marketplace consultant for OLX and Vinted Romania.
Analyze this existing listing and provide a detailed score with improvement suggestions.

PLATFORM: ${platformName}
TITLE: "${title}"
DESCRIPTION: "${description}"

Return ONLY valid JSON:
{
  "overallScore": 7,
  "titleScore": 6,
  "descriptionScore": 8,
  "titleFeedback": "Specific feedback about the title in 1-2 sentences",
  "descriptionFeedback": "Specific feedback about the description in 1-2 sentences",
  "improvements": [
    "Concrete improvement 1",
    "Concrete improvement 2",
    "Concrete improvement 3"
  ],
  "strengths": [
    "What works well 1",
    "What works well 2"
  ]
}`;

  const response = await getClient().chat.completions.create({
    model: TEXT_MODEL,
    max_tokens: 900,
    temperature: 0.2,
    messages: [{ role: "user", content: prompt }],
  });

  const text = response.choices[0]?.message?.content ?? "";
  const jsonMatch = text.match(/\{[\s\S]*\}/);
  if (!jsonMatch) throw new Error("Invalid AI response");
  return JSON.parse(jsonMatch[0]) as ListingCheck;
}