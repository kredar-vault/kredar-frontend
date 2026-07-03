export default function KredarLogo({ hideText = false }: { hideText?: boolean }) {
  return (
    <div className="flex items-center gap-2.5">
      {/* Icon mark */}
      <div className="w-8 h-8 bg-[#081b10] rounded-lg flex items-center justify-center flex-shrink-0">
        <img src="/images/Vector(1).png" alt="Kredar Icon" />
      </div>
      {/* Wordmark in Lexend Zetta font */}
      {!hideText && (
        <span
          style={{
            color: '#169E5C',
            fontFamily: 'var(--font-lexend-zetta)',
            fontSize: '12.278px',
            fontStyle: 'normal',
            fontWeight: 400,
            lineHeight: '11.814px',
            letterSpacing: '1.351px',
          }}
          className="uppercase select-none leading-none mt-0.5"
        >
          KREDAR
        </span>
      )}
    </div>
  );
}
