import { useTranslations } from "next-intl";
import { Star, TrendingUp, TrendingDown, Minus } from "lucide-react";
import type { PhotoScore } from "@/lib/ai";

interface PhotoCardProps {
  photo: PhotoScore;
  file: File;
}

function ScoreBar({ score }: { score: number }) {
  const color = score >= 7 ? "var(--success)" : score >= 4 ? "var(--warning)" : "var(--danger)";
  return (
    <div style={{ height: "5px", borderRadius: "3px", background: "rgba(139,92,246,0.12)", overflow: "hidden", marginTop: "6px" }}>
      <div
        style={{
          height: "100%",
          width: "100%",
          background: color,
          borderRadius: "3px",
          transform: `scaleX(${score / 10})`,
          transformOrigin: "left",
          transition: "transform 0.7s cubic-bezier(0.16,1,0.3,1)",
        }}
      />
    </div>
  );
}

export default function PhotoCard({ photo, file }: PhotoCardProps) {
  const t = useTranslations("tool");
  const url = URL.createObjectURL(file);
  const scoreColor = photo.score >= 7 ? "#4ADE80" : photo.score >= 4 ? "#FCD34D" : "#F87171";
  const ScoreIcon = photo.score >= 7 ? TrendingUp : photo.score >= 4 ? Minus : TrendingDown;

  return (
    <div className="card" style={{ padding: "0", overflow: "hidden" }}>
      <div style={{ position: "relative" }}>
        <img
          src={url}
          alt={`Photo ${photo.index + 1}`}
          style={{ width: "100%", height: "140px", objectFit: "cover", display: "block" }}
          onLoad={() => URL.revokeObjectURL(url)}
        />

        {/* Score overlay */}
        <div style={{ position: "absolute", top: "8px", left: "8px", background: "rgba(0,0,0,0.75)", backdropFilter: "blur(6px)", borderRadius: "8px", padding: "4px 8px", display: "flex", alignItems: "center", gap: "4px" }}>
          <ScoreIcon size={12} color={scoreColor} />
          <span style={{ fontSize: "12px", fontWeight: 700, fontFamily: "Rubik, sans-serif", color: scoreColor }}>
            {photo.score}/10
          </span>
        </div>

        {photo.isRecommendedCover && (
          <div style={{ position: "absolute", bottom: "8px", right: "8px", background: "var(--primary)", borderRadius: "8px", padding: "3px 8px", display: "flex", alignItems: "center", gap: "4px" }}>
            <Star size={10} color="white" fill="white" />
            <span style={{ fontSize: "10px", color: "white", fontWeight: 700, fontFamily: "Rubik, sans-serif" }}>
              {t("cover_badge")}
            </span>
          </div>
        )}
      </div>

      <div style={{ padding: "14px 16px" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <span style={{ fontSize: "11px", fontWeight: 700, color: "var(--color-muted-foreground)", fontFamily: "Rubik, sans-serif", letterSpacing: "0.04em", textTransform: "uppercase" }}>
            {t("score_label")} #{photo.index + 1}
          </span>
          <span style={{ fontSize: "14px", fontWeight: 800, fontFamily: "Rubik, sans-serif", color: scoreColor }}>
            {photo.score}/10
          </span>
        </div>
        <ScoreBar score={photo.score} />
        <p style={{ fontSize: "12px", color: "var(--color-muted-foreground)", marginTop: "10px", lineHeight: 1.6 }}>
          {photo.feedback}
        </p>
      </div>
    </div>
  );
}
