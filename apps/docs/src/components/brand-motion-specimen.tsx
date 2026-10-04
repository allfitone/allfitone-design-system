"use client";

import { useState } from "react";

import { AnimatedBrandLockup } from "@allfitone/react/components/animated-brand-lockup";
import { Button } from "@allfitone/react/components/button";

export function BrandMotionSpecimen() {
  const [replayKey, setReplayKey] = useState(0);

  const replay = () => {
    setReplayKey((current) => current + 1);
  };

  return (
    <article className="brand-motion-specimen" aria-labelledby="brand-motion-title">
      <header className="brand-motion-specimen__header">
        <div>
          <span>Brand entrance / Web</span>
          <h3 id="brand-motion-title">Allfit One reveal</h3>
          <p>
            A compressed impulse lands the logo, resolves ALLFIT in cadence,
            then hands the final beat to ONE in signal cyan.
          </p>
        </div>
        <Button
          className="brand-motion-specimen__replay"
          type="button"
          size="sm"
          variant="outline"
          onClick={replay}
        >
          <svg viewBox="0 0 20 20" aria-hidden="true">
            <path d="M15.2 5.1A7 7 0 1 0 17 10h-1.8a5.2 5.2 0 1 1-1.5-3.7L11 9h7V2l-2.8 3.1Z" />
          </svg>
          Replay entrance
        </Button>
      </header>

      <div className="brand-motion-specimen__stage">
        <div className="brand-motion-specimen__stage-meta" aria-hidden="true">
          <span>Entrance choreography</span>
          <span>00:00:960</span>
        </div>
        <AnimatedBrandLockup
          className="brand-motion-specimen__lockup"
          label="Allfit One"
          replayKey={replayKey}
        />
        <ol
          className="brand-motion-specimen__sequence"
          key={`sequence-${replayKey}`}
          aria-label="Reveal sequence"
        >
          <li><span>Impact</span><strong>01</strong></li>
          <li><span>Resolve</span><strong>02</strong></li>
          <li><span>Signal</span><strong>03</strong></li>
        </ol>
      </div>

      <dl className="brand-motion-specimen__contract">
        <div><dt>Geometry</dt><dd>Canonical lockup</dd></div>
        <div><dt>Choreography</dt><dd>3-beat impulse</dd></div>
        <div><dt>Reduced motion</dt><dd>Final frame</dd></div>
        <div><dt>Runtime</dt><dd>Motion for React</dd></div>
      </dl>
    </article>
  );
}
