import { Lock } from 'lucide-react';

export function FeatureGate({
  enabled,
  children,
  message = 'Disponible en plan Pro',
}: {
  enabled: boolean;
  children: React.ReactNode;
  message?: string;
}) {
  if (enabled) return <>{children}</>;
  return (
    <div className="relative rounded-xl overflow-hidden">
      <div className="opacity-30 pointer-events-none select-none">{children}</div>
      <div className="absolute inset-0 flex items-center justify-center bg-white/80 backdrop-blur-[2px] rounded-xl">
        <div className="flex flex-col items-center gap-3 text-center px-6 py-5 bg-white rounded-xl shadow-lg border border-line max-w-xs">
          <span className="text-[9px] font-bold uppercase tracking-[3px] text-brand bg-brand-soft px-2 py-0.5 rounded">Plan Pro</span>
          <Lock className="h-5 w-5 text-ink-muted" />
          <p className="text-sm font-medium text-ink">{message}</p>
          <a
            href="mailto:info@didigitalstudio.com?subject=Consulta%20plan%20Pro%20-%20Atrio"
            className="text-xs text-brand hover:underline font-medium"
          >
            Contactar a DI Digital Studio →
          </a>
        </div>
      </div>
    </div>
  );
}
