import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, waitFor, act } from "@testing-library/react";
import { App } from "../src/App";
import { AuthProvider, useAuth } from "../src/lib/auth";
import { AUTH_EXPIRED_EVENT } from "../src/lib/apiKey";

beforeEach(() => {
  localStorage.clear();
  vi.stubGlobal("fetch", vi.fn(async () =>
    new Response(JSON.stringify({ error: "Not connected" }), { status: 401 })));
});

describe("anonymous canvas", () => {
  it("renders the canvas (no gate) for anonymous users — no OWOX connect modal on load", async () => {
    render(<App />);
    // Canvas loads freely; "Push to OWOX" always appears, no forced sign-in gate.
    await waitFor(() => expect(screen.getByText(/Push to OWOX/i)).toBeTruthy());
    expect(screen.queryByText("Connect to OWOX")).toBeNull();
  });
});

// When re-connecting cannot bring the session back (key revoked, or never
// stored), api() announces it. The provider must drop to the disconnected state
// instead of leaving a "connected" top bar that fails every action.
describe("expired session", () => {
  it("drops back to disconnected on mc:auth-expired", async () => {
    vi.stubGlobal("fetch", vi.fn(async () => new Response(JSON.stringify({ projectTitle: "Superweek" }), { status: 200 })));
    function Who() { const { me } = useAuth(); return <div>{me ? `in:${me.projectTitle}` : "out"}</div>; }
    render(<AuthProvider><Who /></AuthProvider>);
    await waitFor(() => expect(screen.getByText("in:Superweek")).toBeTruthy());
    act(() => { window.dispatchEvent(new CustomEvent(AUTH_EXPIRED_EVENT)); });
    await waitFor(() => expect(screen.getByText("out")).toBeTruthy());
  });
});
