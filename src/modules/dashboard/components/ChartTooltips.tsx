'use client';

/** Recharts tooltip for the revenue area chart. */
export function GoldTooltip({
  active,
  payload,
  label,
}: {
  active?: boolean;
  payload?: Array<{ value: number; dataKey: string }>;
  label?: string;
}) {
  if (!active || !payload?.length) return null;
  return (
    <div className="glass-card px-4 py-3 border-[#d4a853]/30 shadow-lg shadow-black/40">
      <p className="text-sm text-[#8a8578] mb-1">{label}</p>
      <p className="text-lg font-bold text-[#d4a853]">
        {payload[0].value.toLocaleString('ar-SA')} ر.س
      </p>
    </div>
  );
}

/** Recharts tooltip for the hourly orders bar chart. */
export function BarTooltip({
  active,
  payload,
  label,
}: {
  active?: boolean;
  payload?: Array<{ value: number }>;
  label?: string;
}) {
  if (!active || !payload?.length) return null;
  return (
    <div className="glass-card px-4 py-3 border-[#d4a853]/30 shadow-lg shadow-black/40">
      <p className="text-sm text-[#8a8578] mb-1">{label}</p>
      <p className="text-lg font-bold text-[#d4a853]">{payload[0].value} طلب</p>
    </div>
  );
}
