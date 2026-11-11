'use client';

import { useEffect, useRef, useState } from 'react';

const POINT_A = { lat: 10.441365, lng: 105.165108 }; 


const POINT_B = { lat: 10.0341, lng: 105.7883 };

type Route = {
  id: string;
  label: string;
  color: string;
  distance: number;
  duration: number;
  coordinates: [number, number][];
};

export default function MapPage() {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<any>(null);
  const routeLayersRef = useRef<Map<string, any>>(new Map());

  const [routes, setRoutes] = useState<Route[]>([]);
  const [selectedRoute, setSelectedRoute] = useState('fastest');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    let cancelled = false;

    const initMap = async () => {
      const L = (await import('leaflet')).default;
      if (cancelled || !mapContainerRef.current) return;

      if (!document.getElementById('leaflet-css')) {
        const link = document.createElement('link');
        link.id = 'leaflet-css';
        link.rel = 'stylesheet';
        link.href = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.css';
        document.head.appendChild(link);
      }

      delete (L.Icon.Default.prototype as any)._getIconUrl;
      L.Icon.Default.mergeOptions({
        iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
        iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
        shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
      });

      if ((mapContainerRef.current as any)._leaflet_id) return;

      const map = L.map(mapContainerRef.current).setView([POINT_A.lat, POINT_A.lng], 14);
      mapRef.current = map;

      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; OpenStreetMap contributors',
        maxZoom: 19,
      }).addTo(map);

      L.marker([POINT_A.lat, POINT_A.lng]).addTo(map).bindPopup('Điểm A');
      L.marker([POINT_B.lat, POINT_B.lng]).addTo(map).bindPopup('Điểm B');

      try {
        const response = await fetch('/api/routes', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ start: POINT_A, end: POINT_B }),
        });

        const data = await response.json();
        if (!response.ok) throw new Error(data.error || 'Không thể tìm đường');
        if (cancelled) return;

        const routeList: Route[] = data.routes;
        setRoutes(routeList);
        if (routeList.length === 0) throw new Error('Không tìm thấy tuyến đường');

        const allLayers: any[] = [];
        routeList.forEach((route) => {
          const coordinates = route.coordinates.map(([lng, lat]) => [lat, lng] as [number, number]);
          const polyline = L.polyline(coordinates, {
            color: route.color,
            weight: route.id === 'fastest' ? 7 : 5,
            opacity: 0.85,
          }).addTo(map);

          polyline.bindPopup(`
            <b>${route.label}</b><br/>
            Khoảng cách: ${(route.distance / 1000).toFixed(2)} km<br/>
            Thời gian: ${Math.round(route.duration / 60)} phút
          `);

          polyline.on('click', () => setSelectedRoute(route.id));
          routeLayersRef.current.set(route.id, polyline);
          allLayers.push(polyline);
        });

        const group = L.featureGroup(allLayers);
        map.fitBounds(group.getBounds(), { padding: [50, 50] });
      } catch (err) {
        if (!cancelled) setError(err instanceof Error ? err.message : 'Có lỗi xảy ra');
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    initMap();

    return () => {
      cancelled = true;
      if (mapRef.current) {
        mapRef.current.remove();
        mapRef.current = null;
      }
      routeLayersRef.current.clear();
    };
  }, []);

  useEffect(() => {
    routeLayersRef.current.forEach((layer, id) => {
      const isSelected = id === selectedRoute;
      layer.setStyle({ weight: isSelected ? 8 : 4, opacity: isSelected ? 1 : 0.45 });
      if (isSelected) layer.bringToFront();
    });
  }, [selectedRoute, routes]);

  const formatDuration = (duration: number) => {
    const minutes = Math.round(duration / 60);
    if (minutes < 60) return minutes + ' phút';
    return `${Math.floor(minutes / 60)} giờ ${minutes % 60} phút`;
  };

  return (
    <div className="relative h-[calc(100vh-80px)] w-full">
      <div ref={mapContainerRef} className="h-full w-full z-0" />

      {loading && (
        <div className="absolute top-4 left-1/2 -translate-x-1/2 z-[1000] bg-white shadow-lg rounded-lg px-5 py-3">
          Đang tìm các tuyến đường...
        </div>
      )}

      {error && (
        <div className="absolute top-4 left-1/2 -translate-x-1/2 z-[1000] bg-red-50 text-red-600 shadow-lg rounded-lg px-5 py-3">
          {error}
        </div>
      )}

      {!loading && routes.length > 0 && (
        <div className="absolute top-4 left-4 z-[1000] w-[320px] max-w-[calc(100vw-32px)] bg-white rounded-xl shadow-xl p-4">
          <h2 className="text-lg font-bold text-gray-800 mb-1">Lựa chọn tuyến đường</h2>
          <div className="space-y-3 mt-4">
            {routes.map((route) => {
              const active = selectedRoute === route.id;
              return (
                <button
                  key={route.id}
                  onClick={() => setSelectedRoute(route.id)}
                  className={`w-full text-left border rounded-lg p-3 transition ${
                    active ? 'border-blue-500 bg-blue-50' : 'border-gray-200 hover:bg-gray-50'
                  }`}
                >
                  <div className="flex items-center gap-2 mb-2">
                    <span className="w-3 h-3 rounded-full" style={{ backgroundColor: route.color }} />
                    <span className="font-semibold text-sm text-gray-800">{route.label}</span>
                    {active && <span className="ml-auto text-xs text-blue-600 font-semibold">Đang chọn</span>}
                  </div>
                  <div className="flex justify-between text-xs text-gray-500">
                    <span>{(route.distance / 1000).toFixed(2)} km</span>
                    <span>{formatDuration(route.duration)}</span>
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}