import Image from "next/image";

const brandAssetRoot = "/brand/reusable";

export function BrandLockup({ priority = false }: { priority?: boolean }) {
  return (
    <span className="brand-lockup" aria-hidden="true">
      <Image
        className="brand-lockup__asset brand-lockup__asset--dark"
        src={`${brandAssetRoot}/lockup/allfit-one-lockup-on-dark.svg`}
        alt=""
        width={1678}
        height={480}
        priority={priority}
      />
      <Image
        className="brand-lockup__asset brand-lockup__asset--light"
        src={`${brandAssetRoot}/lockup/allfit-one-lockup-on-light.svg`}
        alt=""
        width={1678}
        height={480}
        priority={priority}
      />
    </span>
  );
}

export function BrandLogo() {
  return (
    <Image
      className="brand-logo"
      src={`${brandAssetRoot}/logo/allfit-one-logo-cyan.svg`}
      alt=""
      width={405}
      height={1149}
      aria-hidden="true"
    />
  );
}
