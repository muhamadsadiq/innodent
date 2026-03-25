"use client";

import { useEffect, useRef } from "react";
import Script from "next/script";

type GoogleMapProps = {
  lat: number;
  lng: number;
  zoom?: number;
  title?: string;
  className?: string;
};

type MapLocation = { lat: number; lng: number };

type GoogleMapsLike = {
  maps: {
    Map: new (
      element: HTMLElement,
      options: {
        zoom: number;
        center: MapLocation;
        styles: Array<{
          featureType?: string;
          elementType?: string;
          stylers: Array<Record<string, string>>;
        }>;
      },
    ) => unknown;
    Marker: new (options: {
      position: MapLocation;
      map: unknown;
      title: string;
    }) => unknown;
    InfoWindow: new (options: { content: string }) => {
      open: (options: { anchor: unknown; map: unknown }) => void;
    };
  };
};

type InnodentWindow = Window & {
  google?: GoogleMapsLike;
  initInnodentMap?: () => void;
};

export default function GoogleMap({
  lat,
  lng,
  zoom = 15,
  title = "Innodent",
  className,
}: GoogleMapProps) {
  const mapRef = useRef<HTMLDivElement | null>(null);
  const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;

  useEffect(() => {
    const win = window as InnodentWindow;
    const location = { lat, lng };

    const renderMap = () => {
      if (!win.google?.maps || !mapRef.current) {
        return;
      }

      const map = new win.google.maps.Map(mapRef.current, {
        zoom,
        center: location,
        styles: [
          {
            featureType: "all",
            elementType: "geometry",
            stylers: [{ color: "#f5f5f5" }],
          },
          {
            featureType: "poi",
            stylers: [{ visibility: "off" }],
          },
        ],
      });

      const marker = new win.google.maps.Marker({
        position: location,
        map,
        title,
      });

      const infoWindow = new win.google.maps.InfoWindow({
        content: `<strong>${title}</strong>`,
      });

      infoWindow.open({ anchor: marker, map });
    };

    win.initInnodentMap = renderMap;

    if (win.google?.maps) {
      renderMap();
    }

    return () => {
      delete win.initInnodentMap;
    };
  }, [lat, lng, title, zoom]);

  if (!apiKey) {
    return (
      <div className="flex h-full w-full items-center justify-center bg-[var(--color-mist-white)] text-[var(--color-charcoal)]">
        Set NEXT_PUBLIC_GOOGLE_MAPS_API_KEY to load Google Maps.
      </div>
    );
  }

  return (
    <>
      <Script
        src={`https://maps.googleapis.com/maps/api/js?key=${apiKey}&callback=initInnodentMap`}
        strategy="afterInteractive"
      />
      <div
        id="map"
        ref={mapRef}
        className={className ?? "h-full w-full rounded-[16px]"}
      />
    </>
  );
}
