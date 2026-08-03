"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
  type ComponentProps,
  type MouseEvent,
  type ReactNode,
} from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { AnimatePresence } from "framer-motion";
import { PageTransition } from "@/components/layout/PageTransition";
import { useReducedMotion } from "@/hooks/useReducedMotion";

type TransitionState = { label: string; targetPath: string } | null;

const RouteTransitionContext = createContext<{
  navigate: (href: string, label: string) => void;
} | null>(null);

export function useRouteTransition() {
  const ctx = useContext(RouteTransitionContext);
  if (!ctx) {
    throw new Error(
      "useRouteTransition must be used inside RouteTransitionProvider",
    );
  }
  return ctx;
}

/** How long the panel takes to fully cover the page before navigation. */
const COVER_MS = 700;
/** Minimum time the destination label stays readable after navigation. */
const HOLD_MS = 350;

export function RouteTransitionProvider({ children }: { children: ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const reducedMotion = useReducedMotion();
  const [transition, setTransition] = useState<TransitionState>(null);
  const pushedRef = useRef(false);

  const navigate = useCallback(
    (href: string, label: string) => {
      if (href === pathname) return;
      if (reducedMotion) {
        router.push(href);
        return;
      }
      pushedRef.current = false;
      setTransition({ label, targetPath: href });
    },
    [pathname, reducedMotion, router],
  );

  // Cover the page, then perform the actual Next.js navigation behind it.
  useEffect(() => {
    if (!transition || pushedRef.current) return;
    const timer = setTimeout(() => {
      pushedRef.current = true;
      router.push(transition.targetPath);
    }, COVER_MS);
    return () => clearTimeout(timer);
  }, [transition, router]);

  // Once the destination route has rendered underneath, release the panel.
  useEffect(() => {
    if (!transition || !pushedRef.current) return;
    if (pathname !== transition.targetPath) return;
    const timer = setTimeout(() => setTransition(null), HOLD_MS);
    return () => clearTimeout(timer);
  }, [pathname, transition]);

  return (
    <RouteTransitionContext.Provider value={{ navigate }}>
      {children}
      <AnimatePresence>
        {transition ? <PageTransition label={transition.label} /> : null}
      </AnimatePresence>
    </RouteTransitionContext.Provider>
  );
}

type TransitionLinkProps = ComponentProps<typeof Link> & {
  href: string;
  /** Overlay label, e.g. "VELORA — ABOUT". */
  transitionLabel: string;
  /** Called when an intercepted (animated) navigation begins. */
  onNavigateStart?: () => void;
};

/**
 * Internal link that plays the cinematic overlay before navigating.
 * Modified clicks, middle clicks, and external targets fall through to
 * default browser behavior; keyboard activation works via the click event.
 */
export function TransitionLink({
  href,
  transitionLabel,
  onNavigateStart,
  onClick,
  children,
  ...rest
}: TransitionLinkProps) {
  const { navigate } = useRouteTransition();

  const handleClick = (event: MouseEvent<HTMLAnchorElement>) => {
    onClick?.(event);
    if (event.defaultPrevented) return;
    if (
      event.metaKey ||
      event.ctrlKey ||
      event.shiftKey ||
      event.altKey ||
      event.button !== 0
    ) {
      return;
    }
    if (rest.target && rest.target !== "_self") return;
    event.preventDefault();
    onNavigateStart?.();
    navigate(href, transitionLabel);
  };

  return (
    <Link href={href} onClick={handleClick} {...rest}>
      {children}
    </Link>
  );
}
