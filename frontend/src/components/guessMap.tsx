import { useEffect, useRef } from "react";
import { Box } from "@chakra-ui/react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

// Fix de íconos por defecto de Leaflet en Vite
import markerIcon2x from "leaflet/dist/images/marker-icon-2x.png";
import markerIcon from "leaflet/dist/images/marker-icon.png";
import markerShadow from "leaflet/dist/images/marker-shadow.png";

delete (L.Icon.Default.prototype as unknown as Record<string, unknown>)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: markerIcon2x,
  iconUrl: markerIcon,
  shadowUrl: markerShadow,
});

interface GuessMapProps {
  selectedCoords: { lat: number; lng: number } | null;
  onSelectCoords: (lat: number, lng: number) => void;
  realCoords?: { lat: number; lng: number } | null;
  disabled?: boolean;
}

const CABA_CENTER: [number, number] = [-34.6037, -58.3816];

export const GuessMap = ({
  selectedCoords,
  onSelectCoords,
  realCoords,
  disabled = false,
}: GuessMapProps) => {
  const mapContainerRef = useRef<HTMLDivElement | null>(null);
  const mapRef = useRef<L.Map | null>(null);
  const guessMarkerRef = useRef<L.Marker | null>(null);
  const realMarkerRef = useRef<L.CircleMarker | null>(null);
  const lineRef = useRef<L.Polyline | null>(null);

  // Inicializar mapa
  useEffect(() => {
    if (!mapContainerRef.current || mapRef.current) return;

    const map = L.map(mapContainerRef.current).setView(CABA_CENTER, 12);

  L.tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png", {
        maxZoom: 19,
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
      }).addTo(map);

    mapRef.current = map;

    return () => {
      map.remove();
      mapRef.current = null;
    };
  }, []);

  // Manejar clics del usuario para colocar su pin
  useEffect(() => {
    const map = mapRef.current;
    if (!map) return;

    const handleClick = (e: L.LeafletMouseEvent) => {
      if (disabled) return;
      onSelectCoords(e.latlng.lat, e.latlng.lng);
    };

    map.on("click", handleClick);
    return () => {
      map.off("click", handleClick);
    };
  }, [disabled, onSelectCoords]);

  // Actualizar pin del jugador
  useEffect(() => {
    const map = mapRef.current;
    if (!map) return;

    if (selectedCoords) {
      if (!guessMarkerRef.current) {
        guessMarkerRef.current = L.marker([selectedCoords.lat, selectedCoords.lng]).addTo(map);
      } else {
        guessMarkerRef.current.setLatLng([selectedCoords.lat, selectedCoords.lng]);
      }
    } else if (guessMarkerRef.current) {
      guessMarkerRef.current.remove();
      guessMarkerRef.current = null;
    }
  }, [selectedCoords]);

  // Mostrar ubicación real y línea de distancia al terminar la ronda
  useEffect(() => {
    const map = mapRef.current;
    if (!map) return;

    if (realMarkerRef.current) {
      realMarkerRef.current.remove();
      realMarkerRef.current = null;
    }
    if (lineRef.current) {
      lineRef.current.remove();
      lineRef.current = null;
    }

    if (realCoords && selectedCoords) {
      realMarkerRef.current = L.circleMarker([realCoords.lat, realCoords.lng], {
        radius: 9,
        color: "#14b8a6",
        fillColor: "#2dd4bf",
        fillOpacity: 0.9,
      }).addTo(map);

      lineRef.current = L.polyline(
        [
          [selectedCoords.lat, selectedCoords.lng],
          [realCoords.lat, realCoords.lng],
        ],
        { color: "#f43f5e", weight: 3, dashArray: "6, 6" }
      ).addTo(map);

      const bounds = L.latLngBounds([
        [selectedCoords.lat, selectedCoords.lng],
        [realCoords.lat, realCoords.lng],
      ]);
      map.fitBounds(bounds, { padding: [40, 40] });
    } else if (!realCoords && !selectedCoords) {
      map.setView(CABA_CENTER, 12);
    }
  }, [realCoords, selectedCoords]);

  return (
    <Box
      ref={mapContainerRef}
      w="full"
      h="340px"
      borderRadius="lg"
      overflow="hidden"
      border="1px solid"
      borderColor="gray.700"
      zIndex={1}
    />
  );
};