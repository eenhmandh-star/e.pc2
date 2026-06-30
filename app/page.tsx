"use client";

import { useState } from "react";
import { AuthProvider, useAuth } from "@/components/auth-context";
import { AuthModal } from "@/components/auth-modal";
import { SiteHeader } from "@/components/site-header";
import { HeroSection } from "@/components/hero-section";
import { GamesSection } from "@/components/games-section";
import { CentersMap } from "@/components/centers-map";
import { BookingModal } from "@/components/booking-modal";
import { MyPCModal } from "@/components/my-pc-modal";
import { type EsportsCenter } from "@/lib/data";
import Script from "next/script";

function AppInner() {
  const { user, isLoading } = useAuth();
  const [bookingCenter, setBookingCenter] = useState<EsportsCenter | null>(
    null,
  );
  const [myPCOpen, setMyPCOpen] = useState(false);
  const [toast, setToast] = useState<string | null>(null);

  function showToast(msg: string) {
    setToast(msg);
    setTimeout(() => setToast(null), 4000);
  }

  function handleBookingComplete(
    center: EsportsCenter,
    review: { rating: number; comment: string },
  ) {
    setBookingCenter(null);
    showToast(
      review.rating > 0
        ? `${center.name}-д ${review.rating} од өгсөн. Баярлалаа!`
        : `${center.name} захиалга амжилттай!`,
    );
  }

  if (isLoading) {
    return (
      <div className="fixed inset-0 flex items-center justify-center bg-background">
        <div className="flex flex-col items-center gap-4">
          <span
            className="text-3xl font-black neon-text-cyan neon-pulse"
            style={{ fontFamily: "var(--font-heading)" }}
          >
            E.PC
          </span>
          <div className="w-32 h-px bg-neon-cyan animate-pulse" />
        </div>
      </div>
    );
  }

  if (!user) {
    return <AuthModal />;
  }

  return (
    <>
      <SiteHeader onRegisterPC={() => setMyPCOpen(true)} />

      <main>
        <HeroSection onBook={setBookingCenter} />
        <GamesSection onRegisterPC={() => setMyPCOpen(true)} />
        <CentersMap
          onBook={setBookingCenter}
          onMyPC={() => setMyPCOpen(true)}
        />

        {/* Footer */}
        <footer
          id="booking"
          className="border-t border-border py-12 px-4 sm:px-6"
          style={{ background: "rgba(7,21,37,0.8)" }}
        >
          <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-6">
            <div>
              <span
                className="text-2xl font-black neon-text-cyan"
                style={{ fontFamily: "var(--font-heading)" }}
              >
                E.PC
              </span>
              <p className="text-xs text-muted-foreground mt-1">
                Mongolia&apos;s #1 eSports Center Platform
              </p>
            </div>
            <div className="flex flex-col sm:flex-row items-center gap-4 text-xs text-muted-foreground">
              <span>© 2025 E.PC. All rights reserved.</span>
              <span className="hidden sm:block text-border">|</span>
              <span>
                Нэвтэрсэн:{" "}
                <span className="text-neon-cyan font-semibold">
                  {user.name}
                </span>
              </span>
            </div>
          </div>
          <Script>
            {`(function(){if(!window.chatbase||window.chatbase("getState")!=="initialized"){window.chatbase=(...arguments)=>{if(!window.chatbase.q){window.chatbase.q=[]}window.chatbase.q.push(arguments)};window.chatbase=new Proxy(window.chatbase,{get(target,prop){if(prop==="q"){return target.q}return(...args)=>target(prop,...args)}})}const onLoad=function(){const script=document.createElement("script");script.src="https://www.chatbase.co/embed.min.js";script.id="bVfJ9Jrip7pN7P7ZKriGc";script.domain="www.chatbase.co";document.body.appendChild(script)};if(document.readyState==="complete"){onLoad()}else{window.addEventListener("load",onLoad)}})();`}
          </Script>
        </footer>
      </main>

      {/* My PC modal */}
      {myPCOpen && <MyPCModal onClose={() => setMyPCOpen(false)} />}

      {/* Booking modal */}
      {bookingCenter && (
        <BookingModal
          center={bookingCenter}
          onClose={() => setBookingCenter(null)}
          onComplete={handleBookingComplete}
        />
      )}

      {/* Toast notification */}
      {toast && (
        <div
          className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 px-6 py-3 rounded-xl text-sm font-semibold text-foreground float-in shadow-2xl whitespace-nowrap"
          style={{
            background: "rgba(7,21,37,0.97)",
            border: "1px solid rgba(0,212,255,0.4)",
            boxShadow: "0 0 20px rgba(0,212,255,0.2)",
          }}
        >
          {toast}
        </div>
      )}
    </>
  );
}

export default function Page() {
  return (
    <AuthProvider>
      <AppInner />
    </AuthProvider>
  );
}
