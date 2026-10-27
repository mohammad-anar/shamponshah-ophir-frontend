"use client";

import React, { useState, useEffect } from "react";
import { Cookie, X } from "lucide-react";

export default function CookieBanner() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const consent = localStorage.getItem("ophir_cookie_consent");
    if (!consent) {
      const timer = setTimeout(() => setIsVisible(true), 1500);
      return () => clearTimeout(timer);
    }
  }, []);

  const handleAccept = () => {
    localStorage.setItem("ophir_cookie_consent", "accepted");
    setIsVisible(false);
  };

  const handleCustomize = () => {
    localStorage.setItem("ophir_cookie_consent", "customized");
    setIsVisible(false);
  };

  if (!isVisible) return null;

  return (
    <div className="fixed bottom-4 right-4 max-w-md w-[calc(100%-2rem)] z-50 bg-surface/95 backdrop-blur-md rounded-2xl p-4 sm:p-5 shadow-luxury-lg border border-border animate-in slide-in-from-bottom-5 duration-300">
      <div className="flex items-start gap-3">
        <div className="w-8 h-8 rounded-xl bg-warning-soft text-warning flex items-center justify-center flex-shrink-0 mt-0.5">
          <Cookie className="w-4 h-4" />
        </div>

        <div className="space-y-2 flex-1">
          <div className="flex items-center justify-between">
            <h4 className="font-serif text-sm font-bold text-obsidian">
              We value your celebration privacy
            </h4>
            <button
              onClick={() => setIsVisible(false)}
              className="text-foreground-muted hover:text-foreground-secondary transition-colors"
              aria-label="Dismiss cookie notice"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          <p className="text-[11px] text-foreground-muted leading-relaxed">
            Ophir Reserve uses essential escrow tracking cookies and analytical signals to curate optimal hospitality matches.
          </p>

          <div className="flex items-center gap-2 pt-1">
            <button
              onClick={handleAccept}
              className="px-3.5 py-1.5 bg-brand hover:bg-brand-hover text-on-brand text-xs font-semibold rounded-none shadow-xs transition-all cursor-pointer"
            >
              Accept all cookies
            </button>

            <button
              onClick={handleCustomize}
              className="px-3.5 py-1.5 bg-surface-sunken hover:bg-surface-elevated text-foreground-secondary text-xs font-medium rounded-none transition-colors border border-border cursor-pointer"
            >
              Customize preferences
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
