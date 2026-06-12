"use client";

interface CoinDisplayProps {
  amount: number;
  size?: "sm" | "md" | "lg";
  gain?: number; // show +N animation
}

export default function CoinDisplay({ amount, size = "md", gain }: CoinDisplayProps) {
  const sizeClasses = { sm: "text-xs", md: "text-sm", lg: "text-lg" };
  return (
    <span className={`inline-flex items-center gap-1 ${sizeClasses[size]} font-bold text-yellow-400`}>
      <span>🪙</span>
      <span>{amount.toLocaleString()}</span>
      {gain != null && gain > 0 && (
        <span className="text-emerald-400 animate-bounce text-xs ml-1">+{gain}</span>
      )}
    </span>
  );
}
