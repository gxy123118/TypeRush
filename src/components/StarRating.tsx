"use client";

interface StarRatingProps {
  stars: number;
  maxStars?: number;
  size?: "sm" | "md" | "lg";
}

export default function StarRating({ stars, maxStars = 3, size = "md" }: StarRatingProps) {
  const sizeClasses = { sm: "text-sm", md: "text-lg", lg: "text-2xl" };
  return (
    <span className={`inline-flex gap-0.5 ${sizeClasses[size]}`}>
      {Array.from({ length: maxStars }, (_, i) => (
        <span key={i} className={i < stars ? "text-yellow-400" : "text-gray-700"}>
          ★
        </span>
      ))}
    </span>
  );
}
