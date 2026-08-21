import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { TopBar } from "./TopBar";

const storages = [{ id: "s1", title: "BigQuery", type: "BIGQUERY" }];

describe("TopBar", () => {
  it("shows Enable (gray) when no account", () => {
    render(<TopBar signedIn={false} supabaseEnabled accountEmail={null} onEnable={() => {}} />);
    const en = screen.getByRole("button", { name: /enable/i });
    expect(en.textContent).toMatch(/History, Saves …/);
    expect(screen.queryByText("Sign in")).toBeNull();
  });

  it("shows Enabled with the model name when signed in", () => {
    render(<TopBar signedIn={false} supabaseEnabled accountEmail="a@b.co" modelName="Ecommerce OKF" onEnable={() => {}} />);
    const en = screen.getByRole("button", { name: /enabled/i });
    expect(en.textContent).toMatch(/Ecommerce OKF/);
  });

  it("shows no storage picker when anonymous", () => {
    render(<TopBar signedIn={false} storages={storages} />);
    expect(screen.queryByRole("button", { name: /^storage$/i })).toBeNull();
    expect(screen.queryByText("Sign in")).toBeNull();
    expect(screen.queryByText("Sign out")).toBeNull();
  });

  it("shows the storage picker with the selected storage when signed in", () => {
    render(<TopBar signedIn projectTitle="Demo" storages={storages} storageId="s1" />);
    expect(screen.queryByText("Sign out")).toBeNull();
    expect(screen.getByRole("button", { name: /^storage$/i }).textContent).toMatch(/BigQuery/);
  });

  it("hides the Push caret menu (and its Import option) when anonymous", () => {
    render(<TopBar signedIn={false} onImportFromOwox={() => {}} />);
    expect(screen.queryByLabelText(/More OWOX actions/i)).toBeNull(); // no caret
    expect(screen.queryByText(/Import from OWOX project/i)).toBeNull();
  });

  it("reveals 'Import from OWOX project' in the Push caret menu when signed in", () => {
    render(<TopBar signedIn={true} onImportFromOwox={() => {}} />);
    // hidden until the caret menu is opened
    expect(screen.queryByText(/Import from OWOX project/i)).toBeNull();
    fireEvent.click(screen.getByLabelText(/More OWOX actions/i));
    expect(screen.getByText(/Import from OWOX project/i)).toBeTruthy();
  });

  it("invokes onImportFromOwox from the caret menu", () => {
    const fn = vi.fn();
    render(<TopBar signedIn={true} onImportFromOwox={fn} />);
    fireEvent.click(screen.getByLabelText(/More OWOX actions/i));
    fireEvent.click(screen.getByText(/Import from OWOX project/i));
    expect(fn).toHaveBeenCalledTimes(1);
  });

  it("renders a Business Goal button and fires onOpenGoal", () => {
    const onOpenGoal = vi.fn();
    render(<TopBar signedIn={false} onOpenGoal={onOpenGoal} questionsEnabled />);
    fireEvent.click(screen.getByRole("button", { name: /business goal/i }));
    expect(onOpenGoal).toHaveBeenCalled();
  });

  it("hides the Business Goal button when the AI key is not configured", () => {
    render(<TopBar signedIn={false} onOpenGoal={() => {}} questionsEnabled={false} />);
    expect(screen.queryByRole("button", { name: /business goal/i })).toBeNull();
  });
});

// A storage created in OWOX after the API key was added never appeared, because the
// list is fetched once at sign-in. The picker now carries a Refresh action.
describe("TopBar storage picker", () => {
  const openPicker = () => fireEvent.click(screen.getByRole("button", { name: /^storage$/i }));

  it("lists the storages and selects one", () => {
    const onStorageChange = vi.fn();
    render(<TopBar signedIn storages={[...storages, { id: "s2", title: "Snowflake", type: "SNOWFLAKE" }]} storageId="s1" onStorageChange={onStorageChange} />);
    expect(screen.queryByRole("listbox")).toBeNull(); // closed until clicked
    openPicker();
    const options = screen.getAllByRole("option");
    expect(options.map(o => o.textContent)).toEqual(["BigQuery", "Snowflake"]);
    expect(options[0].getAttribute("aria-selected")).toBe("true");
    fireEvent.click(options[1]);
    expect(onStorageChange).toHaveBeenCalledWith("s2");
    expect(screen.queryByRole("listbox")).toBeNull(); // closes after picking
  });

  it("refreshes the list and keeps it open so the new storage is visible", async () => {
    const fresh = [...storages, { id: "s2", title: "BigQuery [new]", type: "GOOGLE_BIGQUERY" }];
    const onRefreshStorages = vi.fn(async () => fresh);
    const { rerender } = render(<TopBar signedIn storages={storages} storageId="s1" onRefreshStorages={onRefreshStorages} />);
    openPicker();
    fireEvent.click(screen.getByText(/refresh the list of storages/i));
    expect(onRefreshStorages).toHaveBeenCalledTimes(1);
    // Canvas owns the list; mimic the re-render its setState causes.
    rerender(<TopBar signedIn storages={fresh} storageId="s1" onRefreshStorages={onRefreshStorages} />);
    expect(await screen.findByText(/up to date — 2 storages/i)).toBeTruthy();
    expect(screen.getAllByRole("option").map(o => o.textContent)).toEqual(["BigQuery", "BigQuery [new]"]);
  });

  it("says the project has no storages rather than showing an empty list", async () => {
    const onRefreshStorages = vi.fn(async () => []);
    render(<TopBar signedIn storages={[]} onRefreshStorages={onRefreshStorages} />);
    openPicker();
    expect(screen.getByText(/no storages found in this project/i)).toBeTruthy();
    fireEvent.click(screen.getByText(/refresh the list of storages/i));
    expect(await screen.findByText(/this project has no storages yet/i)).toBeTruthy();
  });

  it("reports a failed refresh instead of leaving the list looking empty", async () => {
    const onRefreshStorages = vi.fn(async () => { throw new Error("HTTP 500"); });
    render(<TopBar signedIn storages={storages} storageId="s1" onRefreshStorages={onRefreshStorages} />);
    openPicker();
    fireEvent.click(screen.getByText(/refresh the list of storages/i));
    expect(await screen.findByText(/couldn't reach owox/i)).toBeTruthy();
    expect(screen.getAllByRole("option")).toHaveLength(1); // the known list is kept
  });

  it("hides the Refresh action when no handler is wired", () => {
    render(<TopBar signedIn storages={storages} storageId="s1" />);
    openPicker();
    expect(screen.queryByText(/refresh the list of storages/i)).toBeNull();
  });
});

// Entering the OWOX token was a one-way door: nothing in the UI cleared it, so the
// Project/Storage chips were stuck until localStorage was wiped by hand.
describe("TopBar sign out", () => {
  it("offers 'Sign out (clear token)' in the Push caret menu when signed in", () => {
    const onSignOut = vi.fn();
    render(<TopBar signedIn onSignOut={onSignOut} />);
    expect(screen.queryByText(/sign out \(clear token\)/i)).toBeNull(); // menu closed
    fireEvent.click(screen.getByLabelText(/More OWOX actions/i));
    fireEvent.click(screen.getByText(/sign out \(clear token\)/i));
    expect(onSignOut).toHaveBeenCalledTimes(1);
  });

  it("hides the sign-out item when anonymous (no caret menu at all)", () => {
    render(<TopBar signedIn={false} onSignOut={() => {}} />);
    expect(screen.queryByLabelText(/More OWOX actions/i)).toBeNull();
  });
});

// Signed in, Project + Storage eat the bar, so every action collapses to its icon
// and the label comes back as a hover tip.
describe("TopBar compact actions", () => {
  const labels = [/^templates$/i, /^import$/i, /^export$/i];

  it("keeps the action labels visible when anonymous", () => {
    render(<TopBar signedIn={false} questionsEnabled onOpenGoal={() => {}} />);
    for (const l of labels) expect(screen.getByRole("button", { name: l }).textContent?.trim()).toMatch(l);
    expect(screen.getByRole("button", { name: /business goal/i }).textContent).toMatch(/business goal/i);
  });

  it("drops the label text (but keeps the accessible name) when signed in", () => {
    render(<TopBar signedIn questionsEnabled onOpenGoal={() => {}} />);
    for (const l of labels) expect(screen.getByRole("button", { name: l }).textContent?.trim()).toBe("");
    expect(screen.getByRole("button", { name: /business goal/i }).textContent?.trim()).toBe("");
  });

  it("shows the project name without the 'Project:' prefix", () => {
    render(<TopBar signedIn projectTitle="Previous subscription canceled" />);
    const chip = screen.getByRole("button", { name: /^project$/i });
    expect(chip.textContent).toBe("Previous subscription canceled");
  });
});
