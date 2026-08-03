"use client";

import { useCallback, useRef } from "react";
import Image from "next/image";
import { getMedia, cssRatio } from "@/lib/media";
import { gsap, useGSAP, EASE } from "@/lib/gsap";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import { clamp, cn } from "@/lib/utils";

type BeforeAfterProps = {
  /** Media asset id — the space as found. */
  beforeId: string;
  /** Media asset id — the space as delivered. */
  afterId: string;
  className?: string;
  sizes?: string;
  /** Where the divider settles after the intro sweep. */
  restPosition?: number;
  /** Cap the frame height so wide-ratio sources never overflow the viewport. */
  maxHeightVh?: number;
  eager?: boolean;
};

/**
 * Same-camera transformation viewer. Both frames are photographed from an
 * identical position, so a hard vertical wipe reads as the room changing
 * rather than as two pictures side by side.
 *
 * The divider sweeps in from fully-before to its rest position when the
 * frame enters the viewport, then belongs to the visitor: drag anywhere
 * on the image, or focus the handle and use the arrow keys. Reduced
 * motion skips the sweep and starts at rest.
 */
export function BeforeAfter({
  beforeId,
  afterId,
  className,
  sizes = "100vw",
  restPosition = 50,
  maxHeightVh = 76,
  eager = false,
}: BeforeAfterProps) {
  const before = getMedia(beforeId);
  const after = getMedia(afterId);
  const [ratioW, ratioH] = after.aspectRatio.split(":").map(Number);
  // Never let the frame grow taller than maxHeightVh of the viewport:
  // cap the width at (height budget × ratio) and center what remains.
  const widthCap = `min(100%, calc(${maxHeightVh}vh * ${(
    (ratioW || 16) / (ratioH || 9)
  ).toFixed(4)}))`;

  const containerRef = useRef<HTMLDivElement>(null);
  const beforeLayerRef = useRef<HTMLDivElement>(null);
  const dividerRef = useRef<HTMLDivElement>(null);
  const handleRef = useRef<HTMLDivElement>(null);
  const beforeLabelRef = useRef<HTMLSpanElement>(null);
  const afterLabelRef = useRef<HTMLSpanElement>(null);

  const posRef = useRef(100);
  const draggingRef = useRef(false);
  const introRef = useRef<gsap.core.Tween | null>(null);
  const reducedMotion = useReducedMotion();

  /** Writes the divider position straight to the DOM — no re-render per frame. */
  const setPosition = useCallback((next: number) => {
    const p = clamp(next, 0, 100);
    posRef.current = p;
    if (beforeLayerRef.current) {
      beforeLayerRef.current.style.clipPath = `inset(0 ${100 - p}% 0 0)`;
    }
    if (dividerRef.current) {
      dividerRef.current.style.left = `${p}%`;
    }
    if (handleRef.current) {
      handleRef.current.setAttribute("aria-valuenow", String(Math.round(p)));
    }
    if (beforeLabelRef.current) {
      beforeLabelRef.current.style.opacity = p > 14 ? "1" : "0";
    }
    if (afterLabelRef.current) {
      afterLabelRef.current.style.opacity = p < 86 ? "1" : "0";
    }
  }, []);

  useGSAP(
    () => {
      if (!containerRef.current) return;

      if (reducedMotion) {
        setPosition(restPosition);
        return;
      }

      setPosition(100);
      const proxy = { value: 100 };
      introRef.current = gsap.to(proxy, {
        value: restPosition,
        duration: 1.8,
        ease: EASE,
        onUpdate: () => setPosition(proxy.value),
        scrollTrigger: {
          trigger: containerRef.current,
          start: "top 72%",
          once: true,
        },
      });
    },
    { scope: containerRef, dependencies: [reducedMotion, restPosition] },
  );

  const positionFromClientX = (clientX: number) => {
    const rect = containerRef.current?.getBoundingClientRect();
    if (!rect || rect.width === 0) return posRef.current;
    return ((clientX - rect.left) / rect.width) * 100;
  };

  /** Any interaction takes the wipe away from the intro tween. */
  const claim = () => {
    introRef.current?.kill();
    introRef.current = null;
  };

  const onPointerDown = (event: React.PointerEvent<HTMLDivElement>) => {
    claim();
    draggingRef.current = true;
    containerRef.current?.setPointerCapture(event.pointerId);
    containerRef.current?.setAttribute("data-dragging", "true");
    setPosition(positionFromClientX(event.clientX));
  };

  const onPointerMove = (event: React.PointerEvent<HTMLDivElement>) => {
    if (!draggingRef.current) return;
    setPosition(positionFromClientX(event.clientX));
  };

  const endDrag = (event: React.PointerEvent<HTMLDivElement>) => {
    if (!draggingRef.current) return;
    draggingRef.current = false;
    containerRef.current?.releasePointerCapture(event.pointerId);
    containerRef.current?.removeAttribute("data-dragging");
  };

  const onKeyDown = (event: React.KeyboardEvent<HTMLDivElement>) => {
    const step = event.shiftKey ? 10 : 2;
    let next: number | null = null;
    if (event.key === "ArrowLeft") next = posRef.current - step;
    if (event.key === "ArrowRight") next = posRef.current + step;
    if (event.key === "Home") next = 0;
    if (event.key === "End") next = 100;
    if (next === null) return;
    event.preventDefault();
    claim();
    setPosition(next);
  };

  return (
    <figure className={cn("group/ba", className)}>
      <div className="mx-auto w-full" style={{ maxWidth: widthCap }}>
      <div
        ref={containerRef}
        data-cursor-label="DRAG"
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={endDrag}
        onPointerCancel={endDrag}
        className="relative w-full select-none overflow-hidden bg-shadow"
        style={{
          aspectRatio: cssRatio(after.aspectRatio),
          // Vertical page scrolling still belongs to the visitor.
          touchAction: "pan-y",
        }}
      >
        {/* AFTER — the delivered room, always beneath */}
        {after.src ? (
          <Image
            src={after.src}
            alt={after.alt}
            fill
            sizes={sizes}
            loading={eager ? "eager" : "lazy"}
            fetchPriority={eager ? "high" : undefined}
            className="pointer-events-none object-cover"
            draggable={false}
          />
        ) : null}

        {/* BEFORE — the room as found, clipped from the left */}
        <div
          ref={beforeLayerRef}
          className="absolute inset-0 will-change-[clip-path]"
          style={{ clipPath: "inset(0 0% 0 0)" }}
        >
          {before.src ? (
            <Image
              src={before.src}
              alt={before.alt}
              fill
              sizes={sizes}
              loading={eager ? "eager" : "lazy"}
              className="pointer-events-none object-cover"
              draggable={false}
            />
          ) : null}
          {/* the unfinished side sits a shade colder and darker */}
          <div
            aria-hidden="true"
            className="absolute inset-0 bg-carbon/25 mix-blend-multiply"
          />
        </div>

        {/* corner labels */}
        <span
          ref={beforeLabelRef}
          aria-hidden="true"
          className="pointer-events-none absolute left-4 top-4 border border-white/25 bg-carbon/70 px-3 py-2 text-[9px] font-medium uppercase tracking-[0.28em] text-white/85 transition-opacity duration-300 sm:left-6 sm:top-6"
        >
          AS FOUND
        </span>
        <span
          ref={afterLabelRef}
          aria-hidden="true"
          className="pointer-events-none absolute right-4 top-4 border border-olive/50 bg-carbon/70 px-3 py-2 text-[9px] font-medium uppercase tracking-[0.28em] text-olive transition-opacity duration-300 sm:right-6 sm:top-6"
        >
          AS DELIVERED
        </span>

        {/* the divider: one architectural line */}
        <div
          ref={dividerRef}
          className="pointer-events-none absolute inset-y-0 z-10 w-px -translate-x-1/2 bg-olive"
          style={{ left: "100%" }}
        >
          {/* upper and lower tick marks */}
          <span
            aria-hidden="true"
            className="absolute left-1/2 top-0 h-6 w-px -translate-x-1/2 bg-white/70"
          />
          <span
            aria-hidden="true"
            className="absolute bottom-0 left-1/2 h-6 w-px -translate-x-1/2 bg-white/70"
          />

          <div
            ref={handleRef}
            role="slider"
            tabIndex={0}
            aria-label={`Reveal the transformation. Left of the line: the space as found. Right: as delivered.`}
            aria-valuemin={0}
            aria-valuemax={100}
            aria-valuenow={100}
            aria-valuetext="Showing the space as found"
            onKeyDown={onKeyDown}
            className="pointer-events-auto absolute left-1/2 top-1/2 flex h-12 w-12 -translate-x-1/2 -translate-y-1/2 cursor-ew-resize items-center justify-center border border-white/60 bg-carbon/80 backdrop-blur-[2px] transition-colors duration-500 hover:border-olive focus-visible:border-olive group-[[data-dragging]]/ba:border-olive"
          >
            <span
              aria-hidden="true"
              className="flex items-center gap-[3px] text-white"
            >
              <svg width="6" height="10" viewBox="0 0 6 10" fill="none">
                <path d="M5 1 1 5l4 4" stroke="currentColor" strokeWidth="1" />
              </svg>
              <span className="h-4 w-px bg-white/30" />
              <svg width="6" height="10" viewBox="0 0 6 10" fill="none">
                <path d="M1 1l4 4-4 4" stroke="currentColor" strokeWidth="1" />
              </svg>
            </span>
          </div>
        </div>
      </div>

      <figcaption className="mt-4 flex items-center justify-between gap-6 text-[10px] uppercase tracking-[0.24em] text-white/35">
        <span>DRAG · OR USE THE ARROW KEYS</span>
        <span className="hidden sm:block">SAME CAMERA POSITION</span>
      </figcaption>
      </div>
    </figure>
  );
}
