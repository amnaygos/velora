"use client";

import { useActionState } from "react";
import { signIn } from "@/app/admin/actions/auth";

export default function LoginPage() {
  const [state, formAction, pending] = useActionState(signIn, { error: null });

  return (
    <div className="login-wrap">
      <div className="login-visual">
        <img src="/images/dark-gym.jpg" alt="" />
        <div className="veil" />
        <div className="q">
          <p>The studio behind the standard.<br />One place to run every project.</p>
          <span>VELORA — OPERATIONS</span>
        </div>
      </div>

      <div className="login-form">
        <img
          src="/images/logo full velora.svg"
          alt="VELORA"
          style={{ height: 26, width: "auto", filter: "brightness(0) invert(1)", marginBottom: 10 }}
        />
        <div className="brand-sub">ADMIN</div>
        <h2>SIGN IN TO YOUR WORKSPACE</h2>

        <form action={formAction}>
          {state.error && <div className="login-error">{state.error}</div>}

          <div className="field">
            <label>Email Address</label>
            <input type="email" name="email" placeholder="you@velora.qa" required autoFocus />
          </div>
          <div className="field">
            <label>Password</label>
            <input type="password" name="password" placeholder="••••••••••" required />
          </div>

          <button type="submit" disabled={pending} className="btn btn-primary w-full" style={{ justifyContent: "center", padding: "15px", marginTop: 8 }}>
            {pending ? "SIGNING IN…" : "ENTER WORKSPACE"}
          </button>
        </form>

        <p className="dim mt-40" style={{ fontSize: 8, letterSpacing: "0.25em" }}>
          RESTRICTED ACCESS — VELORA PRINCIPALS &amp; STUDIO TEAM ONLY
        </p>
      </div>
    </div>
  );
}
