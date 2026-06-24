import Anthropic from "@anthropic-ai/sdk";

const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

export interface PhotoScore {
  index: number;
  score: number;
  feedback: string;
  isRecommendedCover: boolean;
}

export interface AnalysisResult {
  photos: PhotoScore[];
  category: string;
  title: string;
  description: string;
  tags: string[];
}

export async function analyzeListingImages(
  imageBase64List: { data: string; mediaType: string }[],
  description: string,
  platform: string,
  language: "ro" | "en"
): Promise<AnalysisResult> {
  const langInstructions =
    language === "ro"
      ? "Răspunde EXCLUSIV în limba română. Titlul, descrierea și tagurile trebuie să fie în română."
      : "Respond EXCLUSIVELY in English. Title, description and tags must be in English.";

  const platformNote =
    platform === "olx"
      ? "Optimizează pentru OLX România (titlu max 70 caractere, descriere persuasivă, preț negociabil)."
      : platform === "vinted"
      ? "Optimizează pentru Vinted (categorie îmbrăcăminte/accesorii, stare articol, dimensiuni)."
      : "Optimizează atât pentru OLX cât și pentru Vinted.";

  const imageContent = imageBase64List.map((img, i) => ({
    type: "image" as const,
    source: {
      type: "base64" as const,
      media_type: img.mediaType as "image/jpeg" | "image/png" | "image/webp" | "image/gif",
      data: img.data,
    },
  }));

  const response = await client.messages.create({
    model: "claude-sonnet-4-6",
    max_tokens: 2000,
    messages: [
      {
        role: "user",
        content: [
          ...imageContent,
          {
            type: "text",
            text: `${langInstructions}

${platformNote}

Descriere furnizată de utilizator: "${description || "Nicio descriere"}"

Ești un expert în vânzări online. Analizează pozele produsului și returnează un JSON valid cu această structură exactă:

{
  "photos": [
    {
      "index": 0,
      "score": 8,
      "feedback": "Iluminare bună, fundal curat. Sugestie: adaugă o poză cu detaliul produsului.",
      "isRecommendedCover": true
    }
  ],
  "category": "Electronice > Telefoane",
  "title": "Titlu optimizat max 70 caractere",
  "description": "Descriere convingătoare de 100-200 cuvinte care include: stare, caracteristici principale, de ce merită cumpărat",
  "tags": ["tag1", "tag2", "tag3", "tag4", "tag5", "tag6", "tag7", "tag8"]
}

Reguli pentru evaluarea pozelor (scor 1-10):
- Iluminare: bine luminat = +3 puncte, întunecat/supraexpus = -3
- Claritate: poză clară = +2, neclară/blurată = -3
- Fundal: fundal curat/neutru = +2, dezordonat = -2
- Unghi: multiple unghiuri/detalii = +2, un singur unghi = 0
- Prezentare: produs vizibil clar = +1

Returnează DOAR JSON-ul, fără alt text.`,
          },
        ],
      },
    ],
  });

  const text = response.content[0].type === "text" ? response.content[0].text : "";

  const jsonMatch = text.match(/\{[\s\S]*\}/);
  if (!jsonMatch) throw new Error("Invalid AI response format");

  return JSON.parse(jsonMatch[0]) as AnalysisResult;
}
