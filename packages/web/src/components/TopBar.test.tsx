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
    expect(screen.queryByRole("combobox")).toBeNull(); // storage <select> hidden
    expect(screen.queryByText("Sign in")).toBeNull();
    expect(screen.queryByText("Sign out")).toBeNull();
  });

  it("shows the storage picker when signed in", () => {
    render(<TopBar signedIn projectTitle="Demo" storages={storages} storageId="s1" />);
    expect(screen.queryByText("Sign out")).toBeNull();
    expect(screen.getByRole("combobox")).toBeTruthy();
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
