"use client";

import { useEffect, useRef } from "react";

// ── Types ────────────────────────────────────────────────────────
export type TrackingEventType = "IMPRESSION" | "CLICK" | "VIEW";
export type TrackingEntityType = "GIG" | "VENDOR";

export interface TrackingEventItem {
  type: TrackingEventType;
  entityType: TrackingEntityType;
  entityId: string;
  metadata?: Record<string, any>;
}

// ── Session & Visitor Identification ─────────────────────────────
const VISITOR_KEY = "ophir_vid";
const SESSION_KEY = "ophir_sid";

export function getVisitorId(): string {
  if (typeof window === "undefined") return "server-visitor";
  try {
    let vid = localStorage.getItem(VISITOR_KEY);
    if (!vid) {
      vid = typeof crypto !== "undefined" && crypto.randomUUID
        ? crypto.randomUUID()
        : `v_${Date.now()}_${Math.random().toString(36).slice(2, 9)}`;
      localStorage.setItem(VISITOR_KEY, vid);
    }
    return vid;
  } catch {
    return `v_temp_${Date.now()}`;
  }
}

export function getSessionId(): string {
  if (typeof window === "undefined") return "server-session";
  try {
    let sid = sessionStorage.getItem(SESSION_KEY);
    if (!sid) {
      sid = typeof crypto !== "undefined" && crypto.randomUUID
        ? crypto.randomUUID()
        : `s_${Date.now()}_${Math.random().toString(36).slice(2, 9)}`;
      sessionStorage.setItem(SESSION_KEY, sid);
    }
    return sid;
  } catch {
    return `s_temp_${Date.now()}`;
  }
}

// ── Client-side Deduplication Cache ──────────────────────────────
const clientDedupeMap = new Map<string, number>();

function isClientDuplicate(type: TrackingEventType, entityType: TrackingEntityType, entityId: string): boolean {
  const ttlMs =
    type === "IMPRESSION" ? 300_000 : // 5 minutes
    type === "CLICK" ? 5_000 :        // 5 seconds
    1800_000;                        // 30 minutes for page view

  const key = `${type}:${entityType}:${entityId}`;
  const now = Date.now();
  const lastTime = clientDedupeMap.get(key);

  if (lastTime && now - lastTime < ttlMs) {
    return true; // Already tracked recently!
  }

  clientDedupeMap.set(key, now);
  // Clean up older keys
  if (clientDedupeMap.size > 500) {
    for (const [k, v] of clientDedupeMap.entries()) {
      if (now - v > 3600_000) clientDedupeMap.delete(k);
    }
  }
  return false;
}

// ── Batch Queue & Flusher ─────────────────────────────────────────
let eventQueue: TrackingEventItem[] = [];
let flushTimeout: any = null;

function getApiUrl(): string {
  const baseUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4005/api/v1";
  return `${baseUrl.replace(/\/$/, "")}/analytics/track`;
}

export function flushQueue() {
  if (eventQueue.length === 0 || typeof window === "undefined") return;

  const eventsToSend = [...eventQueue];
  eventQueue = [];

  if (flushTimeout) {
    clearTimeout(flushTimeout);
    flushTimeout = null;
  }

  const payload = {
    visitorId: getVisitorId(),
    sessionId: getSessionId(),
    events: eventsToSend,
  };

  const url = getApiUrl();
  const jsonStr = JSON.stringify(payload);

  if (typeof navigator !== "undefined" && navigator.sendBeacon) {
    const blob = new Blob([jsonStr], { type: "application/json" });
    const success = navigator.sendBeacon(url, blob);
    if (success) return;
  }

  // Fallback to fetch
  fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: jsonStr,
    keepalive: true,
  }).catch(() => {
    // Fail silently to not impact user experience
  });
}

function scheduleFlush() {
  if (flushTimeout) return;
  flushTimeout = setTimeout(() => {
    flushQueue();
  }, 600);
}

// Setup unload & visibility listeners once in browser
if (typeof window !== "undefined") {
  window.addEventListener("visibilitychange", () => {
    if (document.visibilityState === "hidden") {
      flushQueue();
    }
  });
  window.addEventListener("beforeunload", () => {
    flushQueue();
  });
}

// ── Public Tracking API ──────────────────────────────────────────
export function trackEvent(type: TrackingEventType, entityType: TrackingEntityType, entityId: string, metadata?: Record<string, any>) {
  if (!entityId || typeof window === "undefined") return;
  if (isClientDuplicate(type, entityType, entityId)) return;

  eventQueue.push({ type, entityType, entityId, metadata });
  scheduleFlush();
}

export function trackImpression(entityType: TrackingEntityType, entityId: string, metadata?: Record<string, any>) {
  trackEvent("IMPRESSION", entityType, entityId, metadata);
}

export function trackClick(entityType: TrackingEntityType, entityId: string, metadata?: Record<string, any>) {
  trackEvent("CLICK", entityType, entityId, metadata);
}

export function trackView(entityType: TrackingEntityType, entityId: string, metadata?: Record<string, any>) {
  trackEvent("VIEW", entityType, entityId, metadata);
}

// ── React Hooks ──────────────────────────────────────────────────
/**
 * Fire page/detail view event on mount (with client-side deduplication).
 */
export function useTrackView(entityType: TrackingEntityType, entityId: string | undefined | null) {
  useEffect(() => {
    if (!entityId) return;
    trackView(entityType, entityId);
  }, [entityType, entityId]);
}

/**
 * Attach intersection observer to a card ref to track impressions when visible.
 */
export function useTrackImpression(entityType: TrackingEntityType, entityId: string | undefined | null) {
  const elementRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!entityId || !elementRef.current || typeof IntersectionObserver === "undefined") return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && entry.intersectionRatio >= 0.25) {
            trackImpression(entityType, entityId);
            observer.disconnect(); // Once tracked, disconnect observer for this card
          }
        });
      },
      { threshold: 0.25 }
    );

    observer.observe(elementRef.current);
    return () => observer.disconnect();
  }, [entityType, entityId]);

  return elementRef;
}
