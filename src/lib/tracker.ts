/**
 * Client-side mock tracking utility for Omar Jewellers OJ.
 * Logs visitor actions to the developer console with premium styling.
 */

function generateUUID(): string {
  if (typeof window !== "undefined" && window.crypto && window.crypto.randomUUID) {
    return window.crypto.randomUUID();
  }
  return "session_" + Math.random().toString(36).substring(2, 15);
}

export function getSessionId(): string {
  if (typeof window === "undefined") return "";
  
  let sessionId = sessionStorage.getItem("oj_session_id");
  if (!sessionId) {
    sessionId = generateUUID();
    sessionStorage.setItem("oj_session_id", sessionId);
  }
  return sessionId;
}

interface TrackPayload {
  eventType: "PAGE_VIEW" | "PRODUCT_CLICK" | "PRODUCT_VIEW" | "TIME_SPENT" | "FORM_SUBMIT" | "WHATSAPP_CLICK" | "WISHLIST_ADD" | "SCROLL_SECTION";
  productName?: string;
  pageName?: string;
  duration?: number;
  metadata?: Record<string, any>;
}

export async function trackActivity(payload: TrackPayload) {
  if (typeof window === "undefined") return;

  const sessionId = getSessionId().substring(0, 8);
  const target = payload.productName || payload.pageName || window.location.pathname;

  // Render a beautiful, premium console log mimicking high-end telemetry
  console.log(
    `%c👑 OJ Live Analytics %c[Session: ${sessionId}] %c${payload.eventType}%c → ${target}`,
    "background: #111; color: #dfba73; padding: 3px 8px; border-radius: 4px; font-weight: bold; border: 1px solid #dfba73;",
    "color: #888; font-style: italic;",
    "color: #dfba73; font-weight: bold;",
    "color: #111; font-weight: normal;",
    payload.metadata ? payload.metadata : ""
  );
}
