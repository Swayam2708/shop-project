import { NextResponse } from "next/server";

export async function GET() {
  try {
    // Fetch Gold Spot Price (USD/ounce) from Yahoo Finance
    const goldRes = await fetch("https://query1.finance.yahoo.com/v8/finance/chart/GC=F", {
      next: { revalidate: 60 }, // Cache for 1 minute
    });
    const goldData = await goldRes.json();
    const goldUsd = goldData?.chart?.result?.[0]?.meta?.regularMarketPrice || 2350;

    // Fetch Silver Spot Price (USD/ounce)
    const silverRes = await fetch("https://query1.finance.yahoo.com/v8/finance/chart/SI=F", {
      next: { revalidate: 60 },
    });
    const silverData = await silverRes.json();
    const silverUsd = silverData?.chart?.result?.[0]?.meta?.regularMarketPrice || 29.5;

    // Fetch USD/INR Exchange Rate
    const exchangeRes = await fetch("https://query1.finance.yahoo.com/v8/finance/chart/USDINR=X", {
      next: { revalidate: 60 },
    });
    const exchangeData = await exchangeRes.json();
    const usdInr = exchangeData?.chart?.result?.[0]?.meta?.regularMarketPrice || 83.5;

    // Calculate Indian Gold Rate per gram (INR)
    // 1 troy ounce = 31.1034768 grams
    // We add 14% to account for India import duty + local cess + market premium
    const rawGoldGramInr = (goldUsd * usdInr) / 31.1034768;
    const g24k = Math.round(rawGoldGramInr * 1.14); // 24K Gold Rate
    const g22k = Math.round(g24k * 0.916); // 22K Gold Rate
    const g18k = Math.round(g24k * 0.75); // 18K Gold Rate

    // Calculate Indian Silver Rate per gram (INR)
    const rawSilverGramInr = (silverUsd * usdInr) / 31.1034768;
    const s999 = Math.round(rawSilverGramInr * 1.12 * 100) / 100; // 999 Silver Rate

    return NextResponse.json({
      success: true,
      rates: {
        g24k,
        g22k,
        g18k,
        s999,
      },
      meta: {
        goldUsd,
        silverUsd,
        usdInr,
        timestamp: new Date().toISOString(),
      }
    });
  } catch (error: any) {
    console.error("MCX rates fetch error:", error);
    // Return fallback rates
    return NextResponse.json({
      success: false,
      error: error.message || "Failed to fetch live rates",
      rates: {
        g24k: 7650,
        g22k: 7015,
        g18k: 5740,
        s999: 92,
      }
    });
  }
}
