"use client";

import { useGameStore } from "@/store/gameStore";
import { SHOP_ITEMS, THEME_STYLES, type ShopItemType } from "@/lib/gameData";
import { useState } from "react";
import CoinDisplay from "@/components/CoinDisplay";

const TABS: { key: ShopItemType; label: string; icon: string }[] = [
  { key: "theme", label: "主题", icon: "🎨" },
  { key: "effect", label: "特效", icon: "✨" },
  { key: "title", label: "称号", icon: "🏷️" },
];

export default function ShopPage() {
  const [activeTab, setActiveTab] = useState<ShopItemType>("theme");
  const { coins, ownedItems, equippedTheme, equippedEffect, equippedTitle, buyItem, equipTheme, equipEffect, equipTitle, ownsItem } = useGameStore();

  const items = SHOP_ITEMS.filter((item) => item.type === activeTab);

  const handleBuy = (item: typeof SHOP_ITEMS[0]) => {
    if (ownsItem(item.id)) return;
    if (coins < item.price) return;
    buyItem(item.id, item.price);
  };

  const handleEquip = (item: typeof SHOP_ITEMS[0]) => {
    if (!ownsItem(item.id)) return;
    if (item.type === "theme") equipTheme(item.id.replace("theme-", ""));
    else if (item.type === "effect") equipEffect(item.id);
    else if (item.type === "title") equipTitle(item.name);
  };

  const isEquipped = (item: typeof SHOP_ITEMS[0]) => {
    if (item.type === "theme") return equippedTheme === item.id.replace("theme-", "");
    if (item.type === "effect") return equippedEffect === item.id;
    if (item.type === "title") return equippedTitle === item.name;
    return false;
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-white">🛒 商店</h1>
        <CoinDisplay amount={coins} size="lg" />
      </div>

      {/* Tabs */}
      <div className="flex gap-2">
        {TABS.map((tab) => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key)}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              activeTab === tab.key
                ? "bg-emerald-600 text-white"
                : "bg-gray-800 text-gray-400 hover:text-white hover:bg-gray-700"
            }`}
          >
            {tab.icon} {tab.label}
          </button>
        ))}
      </div>

      {/* Items grid */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {items.map((item) => {
          const owned = ownsItem(item.id);
          const equipped = isEquipped(item);
          const canAfford = coins >= item.price;
          const themePreview = item.type === "theme" && item.preview ? THEME_STYLES[item.preview] : null;

          return (
            <div
              key={item.id}
              className={`rounded-xl border p-5 transition-all ${
                equipped
                  ? "border-emerald-500/50 bg-emerald-500/10"
                  : owned
                  ? "border-white/20 bg-gray-800/50"
                  : "border-white/10 bg-gray-800/30"
              }`}
            >
              {/* Theme preview strip */}
              {themePreview && (
                <div className={`h-2 rounded-full mb-3 ${themePreview.bg.replace("bg-", "bg-gradient-to-r from-")} to-transparent`} />
              )}

              <div className="flex items-start justify-between mb-3">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-xl">{item.preview}</span>
                    <span className="text-white font-bold">{item.name}</span>
                    {equipped && (
                      <span className="text-[10px] px-1.5 py-0.5 rounded bg-emerald-500/20 text-emerald-400 font-medium">
                        使用中
                      </span>
                    )}
                  </div>
                  <p className="text-sm text-gray-400 mt-1">{item.description}</p>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-yellow-400 font-bold">🪙 {item.price}</span>
                {owned ? (
                  equipped ? (
                    <span className="text-sm text-emerald-400">✓ 已装备</span>
                  ) : (
                    <button
                      onClick={() => handleEquip(item)}
                      className="px-4 py-1.5 text-sm bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg font-medium transition-colors"
                    >
                      装备
                    </button>
                  )
                ) : (
                  <button
                    onClick={() => handleBuy(item)}
                    disabled={!canAfford}
                    className={`px-4 py-1.5 text-sm rounded-lg font-medium transition-colors ${
                      canAfford
                        ? "bg-yellow-500 hover:bg-yellow-400 text-black"
                        : "bg-gray-700 text-gray-500 cursor-not-allowed"
                    }`}
                  >
                    {canAfford ? "购买" : "金币不足"}
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
