"use client";

import { useEffect, useRef } from "react";
import "leaflet/dist/leaflet.css";

export default function VeloraMap() {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!ref.current) return;
    let map: ReturnType<typeof import("leaflet")["map"]> | null = null;

    import("leaflet").then((L) => {
      if (!ref.current || ref.current.dataset.init) return;
      ref.current.dataset.init = "1";

      map = L.map(ref.current, {
        center: [25.2296, 51.5024],
        zoom: 15,
        zoomControl: false,
        scrollWheelZoom: false,
        attributionControl: false,
      });

      L.tileLayer("https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png", {
        maxZoom: 19,
      }).addTo(map);

      const icon = L.divIcon({
        html: `<div style="
          width:10px;height:10px;
          background:#91928D;
          border-radius:50%;
          box-shadow:0 0 0 5px rgba(145,146,141,0.18),0 0 0 11px rgba(145,146,141,0.07);
        "></div>`,
        className: "",
        iconSize: [10, 10],
        iconAnchor: [5, 5],
      });

      L.marker([25.2296, 51.5024], { icon })
        .addTo(map)
        .bindPopup(
          `<div style="font-family:Montserrat,sans-serif;font-size:11px;letter-spacing:0.05em;line-height:1.7;color:#fff;background:#242426;border:none;padding:10px 14px;min-width:200px">
            <strong style="letter-spacing:0.12em;font-size:10px">VELORA</strong><br/>
            Safwa Building, Gate 20<br/>Second Floor<br/>Barwa Commercial Avenue<br/>Doha, Qatar
          </div>`,
          { className: "velora-popup" }
        )
        .openPopup();
    });

    return () => { map?.remove(); };
  }, []);

  return (
    <div ref={ref} className="w-full h-full" style={{ background: "#1C1C1C" }} />
  );
}
