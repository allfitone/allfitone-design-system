"use client"

import * as React from "react"
import { LazyMotion, domAnimation, m, type Variants } from "motion/react"

import {
  brandColors,
  brandDimensions,
  brandGeometry,
  type BrandSurface,
} from "@allfitone/brand"

type AnimatedBrandLockupProps = Omit<
  React.ComponentProps<typeof m.svg>,
  "animate" | "color" | "initial" | "onAnimationComplete" | "title" | "variants"
> & {
  /** Selects the neutral wordmark color for a dark or light surface. */
  surface?: BrandSurface
  /** Accessible name. When omitted, the lockup is decorative. */
  label?: string
  /** Change this value to replay the entrance from its first frame. */
  replayKey?: React.Key
  /** Called after the entrance sequence reaches its final frame. */
  onRevealComplete?: () => void
}

const revealEase = [0.22, 1, 0.36, 1] as const
const impactEase = [0.16, 1, 0.3, 1] as const

const markVariants = {
  hidden: { opacity: 0, rotate: -3.5, scale: 0.86, x: -72 },
  visible: {
    opacity: [0, 1, 1],
    rotate: [-3.5, 1.1, 0],
    scale: [0.86, 1.025, 1],
    x: [-72, 9, 0],
    transition: {
      duration: 0.48,
      ease: impactEase,
      times: [0, 0.74, 1],
    },
  },
} satisfies Variants

const allfitLetterVariants = {
  hidden: { opacity: 0, scaleX: 0.82, x: -28 },
  visible: (index = 0) => ({
    opacity: 1,
    x: 0,
    scaleX: 1,
    transition: {
      delay: 0.22 + index * 0.035,
      duration: 0.3,
      ease: revealEase,
    },
  }),
} satisfies Variants

const oneLetterVariants = {
  hidden: { opacity: 0, scaleX: 0.76, x: 34 },
  visible: (index = 0) => ({
    opacity: 1,
    scaleX: [0.76, 1.04, 1],
    x: [34, -4, 0],
    transition: {
      delay: 0.57 + index * 0.045,
      duration: 0.32,
      ease: impactEase,
      times: [0, 0.72, 1],
    },
  }),
} satisfies Variants

function useReducedMotionPreference() {
  const [prefersReducedMotion, setPrefersReducedMotion] = React.useState<
    boolean | null
  >(null)

  React.useLayoutEffect(() => {
    const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)")
    const updatePreference = () => setPrefersReducedMotion(mediaQuery.matches)

    updatePreference()
    mediaQuery.addEventListener("change", updatePreference)

    return () => mediaQuery.removeEventListener("change", updatePreference)
  }, [])

  return prefersReducedMotion
}

/**
 * Web-only ALLFIT ONE lockup entrance.
 *
 * The final frame uses the same canonical geometry as BrandLockup. Motion is
 * kept in this explicit component entry point so static brand imports remain
 * free of the animation runtime.
 */
function AnimatedBrandLockup({
  surface = "dark",
  label,
  replayKey = 0,
  onRevealComplete,
  ...props
}: AnimatedBrandLockupProps) {
  const prefersReducedMotion = useReducedMotionPreference()
  const neutral = surface === "dark" ? brandColors.chalk : brandColors.ink
  const initial = prefersReducedMotion === false ? "hidden" : false
  const motionPreference = prefersReducedMotion === null
    ? "pending"
    : prefersReducedMotion
      ? "reduced"
      : "full"

  return (
    <LazyMotion features={domAnimation} strict>
      <m.svg
        key={`${String(replayKey)}-${motionPreference}`}
        {...props}
        data-slot="animated-brand-lockup"
        data-reveal-duration="960"
        data-motion-reduced={
          prefersReducedMotion === null
            ? "pending"
            : prefersReducedMotion
              ? "true"
              : "false"
        }
        viewBox={brandDimensions.lockup.viewBox}
        role={label ? "img" : "presentation"}
        aria-label={label}
        aria-hidden={label ? undefined : true}
        focusable="false"
        initial={initial}
        animate="visible"
        {...(onRevealComplete && prefersReducedMotion !== null
          ? { onAnimationComplete: () => onRevealComplete() }
          : {})}
      >
        {label ? <title>{label}</title> : null}

        <m.g
          variants={markVariants}
          style={{ transformBox: "fill-box", transformOrigin: "center" }}
        >
          <path
            fill={brandColors.cyan}
            d={brandGeometry.logoPath}
            transform="translate(44 58) scale(.318)"
          />
        </m.g>

        <g transform="translate(272 337) scale(.28 -.28)" fill={neutral}>
          {brandGeometry.allfitLetters.map(([path, x], index) => (
            <m.g
              key={index}
              custom={index}
              variants={allfitLetterVariants}
              style={{ transformBox: "fill-box", transformOrigin: "left center" }}
            >
              <path key={index} d={path} transform={`translate(${x} 0)`} />
            </m.g>
          ))}
        </g>

        <g
          transform="translate(1000 337) scale(.28 -.28)"
          fill={brandColors.cyan}
        >
          {brandGeometry.oneLetters.map(([path, x], index) => (
            <m.g
              key={index}
              custom={index}
              variants={oneLetterVariants}
              style={{ transformBox: "fill-box", transformOrigin: "left center" }}
            >
              <path d={path} transform={`translate(${x - 2600} 0)`} />
            </m.g>
          ))}
        </g>
      </m.svg>
    </LazyMotion>
  )
}

export { AnimatedBrandLockup }
export type { AnimatedBrandLockupProps }
