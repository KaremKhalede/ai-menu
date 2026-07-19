
/* ------------------------------------------------------------------ */
/*  Background decorations                                             */
/* ------------------------------------------------------------------ */

export function LoginBackground() {
  return (
    <div className="pointer-events-none fixed inset-0" aria-hidden>
      <div className="absolute -top-32 right-1/4 h-80 w-80 rounded-full bg-[#d4a853]/10 blur-[120px]" />
      <div className="absolute bottom-0 left-1/3 h-64 w-64 rounded-full bg-[#d4a853]/8 blur-[100px]" />
      <div className="absolute top-1/2 left-16 h-48 w-48 rounded-full bg-[#d4a853]/5 blur-[80px]" />
      {/* Subtle dot pattern */}
      <div
        className="absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage:
            'radial-gradient(circle, #d4a853 1px, transparent 1px)',
          backgroundSize: '32px 32px',
        }}
      />
    </div>
  );
}