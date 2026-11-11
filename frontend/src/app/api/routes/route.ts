import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const apiKey = process.env.OPENROUTESERVICE_API_KEY;
    if (!apiKey) {
      return NextResponse.json({ error: 'Chưa cấu hình OPENROUTESERVICE_API_KEY trong .env.local' }, { status: 500 });
    }

    const body = await request.json();
    const { start, end } = body;

    const coordinates = [[start.lng, start.lat], [end.lng, end.lat]];

    const options = [
      { id: 'fastest', label: 'Nhanh nhất', preference: 'fastest', color: '#2563eb' },
      { id: 'shortest', label: 'Ngắn nhất', preference: 'shortest', color: '#f97316' },
      { id: 'avoid-highways', label: 'Tránh cao tốc', preference: 'fastest', avoid_features: ['highways'], color: '#16a34a' },
    ];

    const results = await Promise.allSettled(
      options.map(async (opt) => {
        const res = await fetch('https://api.openrouteservice.org/v2/directions/driving-car/geojson', {
          method: 'POST',
          headers: {
            'Authorization': apiKey,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            coordinates,
            preference: opt.preference,
            ...(opt.avoid_features ? { options: { avoid_features: opt.avoid_features } } : {}),
          }),
        });

        if (!res.ok) throw new Error(`Lỗi API cho ${opt.label}`);
        const data = await res.json();
        const feature = data.features?.[0];
        
        return {
          id: opt.id,
          label: opt.label,
          color: opt.color,
          distance: feature.properties.summary.distance,
          duration: feature.properties.summary.duration,
          coordinates: feature.geometry.coordinates,
        };
      })
    );

    const routes = results
      .filter((r): r is PromiseFulfilledResult<any> => r.status === 'fulfilled')
      .map((r) => r.value);

    if (routes.length === 0) {
      return NextResponse.json({ error: 'Không tìm thấy tuyến đường nào' }, { status: 502 });
    }

    return NextResponse.json({ routes });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Lỗi server' }, { status: 500 });
  }
}