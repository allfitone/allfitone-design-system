import { brandColors, brandGeometry } from "@allfitone/react/brand";
import { PulseMark } from "@allfitone/react/components/pulse-mark";

type AllfitOsSurface = "adaptive" | "dark" | "light";

const osLetterS =
  "M26 178V209Q26 214 29.5 217.5Q33 221 38 221H178Q183 221 186.5 217.5Q190 214 190 209V186Q190 162 201.5 148Q213 134 231 134Q249 134 260.5 147.5Q272 161 272 182Q272 205 254 223.5Q236 242 182 281Q132 317 100 345.5Q68 374 45 416.5Q22 459 22 515Q22 572 47.5 616Q73 660 119.5 684Q166 708 226 708Q287 708 333.5 683.5Q380 659 405.5 614.5Q431 570 431 512V488Q431 483 427.5 479.5Q424 476 419 476H280Q275 476 271.5 479.5Q268 483 268 488V516Q268 538 256 552Q244 566 226 566Q208 566 197 552Q186 538 186 515Q186 490 203 470Q220 450 272 412Q335 365 367 336Q399 307 417 271.5Q435 236 435 188Q435 98 378.5 45Q322 -8 230 -8Q169 -8 123 15.5Q77 39 51.5 81.5Q26 124 26 178Z";

export function AllfitOsMark({ title }: { title?: string }) {
  return <PulseMark className="allfit-os-mark" width={40} label={title} />;
}

export function AllfitOsWordmark({
  surface,
}: {
  surface: AllfitOsSurface;
}) {
  const neutral =
    surface === "adaptive"
      ? "var(--afo-color-text-primary)"
      : surface === "dark"
        ? brandColors.chalk
        : brandColors.ink;

  return (
    <svg
      className="allfit-os-wordmark"
      data-surface={surface}
      viewBox="0 0 3536 756"
      role="img"
      aria-label="Allfit OS"
      focusable="false"
    >
      <g transform="translate(20 728) scale(1 -1)" fill={neutral}>
        {brandGeometry.allfitLetters.map(([path, x], index) => (
          <path key={index} d={path} transform={`translate(${x} 0)`} />
        ))}
      </g>
      <g transform="translate(20 728) scale(1 -1)" fill={brandColors.cyan}>
        <path
          d={brandGeometry.oneLetters[0][0]}
          transform={`translate(${brandGeometry.oneLetters[0][1]} 0)`}
        />
        <path d={osLetterS} transform="translate(3061.143 0)" />
      </g>
    </svg>
  );
}

export function AllfitOsLockup({
  surface,
}: {
  surface: AllfitOsSurface;
}) {
  return (
    <span
      className="allfit-os-lockup"
      data-surface={surface}
      role="img"
      aria-label="Allfit OS"
    >
      <AllfitOsMark />
      <span aria-hidden="true">
        <AllfitOsWordmark surface={surface} />
      </span>
    </span>
  );
}
