import type { ReactNode } from "react";
import { ArrowUpRight } from "lucide-react";
import CanvasTabs from "./CanvasTabs";

/** Everything the public Space Canvas configurator prices and draws. */
export default function CanvasLayout({ children }: { children: ReactNode }) {
  return (
    <>
      <header className="topbar">
        <div>
          <div className="crumb">VELORA — CONTENT</div>
          <h1>Space Canvas</h1>
        </div>
        <div className="topbar-actions">
          <a className="btn btn-outline btn-sm" href="/space-canvas/" target="_blank" rel="noreferrer">
            OPEN THE CONFIGURATOR <ArrowUpRight size={13} strokeWidth={1.4} />
          </a>
        </div>
      </header>
      <CanvasTabs />
      <div className="content">{children}</div>
    </>
  );
}
