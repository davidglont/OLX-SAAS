import { useTranslations } from "next-intl";
import { Star, TrendingUp, TrendingDown, Minus } from "lucide-react";
import type { PhotoScore } from "@/lib/ai";

interface PhotoCardProps {
  photo: PhotoScore;
  file: File;
}

function ScoreBar({ score }: { score: number }) {
  const color = score >= 7 ? "#16A34A" : score >= 4 ? "#D97706" : "#DC2626";
  return (
    <div style={{ height: "6px", borderRadius: "3px", background: "var(--color-muted)", overflow: "hidden", marginTop: "4px" }}>
      <div style={{ height: "100%", width: "100%", background: color, borderRadius: "3px", transform: `scaleX(${score / 10})`, transformOrigin: "left", transition: "transform 0.5s ease" }} />
    </div>
  );
}

export default function PhotoCard({ photo, file }: PhotoCardProps) {
  const t = useTranslations("tool");
  const url = URL.createObjectURL(file);
  const scoreClass = photo.score >= 7 ? "score-high" : photo.score >= 4 ? "score-medium" : "score-low";
  const ScoreIcon = photo.score >= 7 ? TrendingUp : photo.score >= 4 ? Minus : TrendingDown;

  return (
    <div className="card" style={{ padding: "0", overflow: "hidden" }}>
      <div style={{ position: "relative" }}>
        <img src={url} alt={`Photo ${photo.index + 1}`} style={{ width: "100%", height: "140px", objectFit: "cover", display: "block" }} onLoad={() => URL.revokeObjectURL(url)} />
        <div style={{ position: "absolute", top: "8px", left: "8px", background: "rgba(0,0,0,0.65)", borderRadius: "8px", padding: "4px 8px", display: "flex", alignItems: "center", gap: "4px" }}>
          <ScoreIcon size={12} color={photo.score >= 7 ? "#4ADE80" : photo.score >= 4 ? "#FCD34D" : "#F87171"} />
          <span style={{ fontSize: "12px", fontWeight: 700, fontFamily: "Rubik, sans-serif", color: photo.score >= 7 ? "#4ADE80" : photo.score >= 4 ? "#FCD34D" : "#F87171" }}>
            {photo.score}/10
          </span>
        </div>
        {photo.isRecommendedCover && (
          <div style={{ position: "absolute", top: "8px", right: "8px", background: "var(--color-primary)", borderRadius: "8px", padding: "3px 8px", display: "flex", alignItems: "center", gap: "4px" }}>
            <Star size={10} color="white" fill="white" />
            <span style={{ fontSize: "10px", color: "white", fontWeight: 700, fontFamily: "Rubik, sans-serif" }}>
              {t("cover_badge")}
            </span>
          </div>
        )}
      </div>

      <div style={{ padding: "14px 16px" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "4px" }}>
          <span style={{ fontSize: "12px", fontWeight: 600, color: "var(--color-muted-foreground)", fontFamily: "Rubik, sans-serif" }}>
            {t("score_label")} #{photo.index + 1}
          </span>
          <span className={scoreClass} style={{ fontSize: "14px", fontWeight: 800, fontFamily: "Rubik, sans-serif" }}>
            {photo.score}/10
          </span>
        </div>
        <ScoreBar score={photo.score} />
        <p style={{ fontSize: "12px", color: "var(--color-muted-foreground)", marginTop: "10px", lineHeight: 1.55 }}>
          {photo.feedback}
        </p>
      </div>
    </div>
  );
}
