import { describe, it, expect, vi, afterEach } from "vitest";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { strFromU8, unzipSync } from "fflate";
import { bundleToZip, filesToGraph } from "../okf/io";
import { ImportDialog } from "./ImportDialog";

const PASTE = `<!-- customers.md -->
---
type: "OWOX Data Mart"
title: "Customers"
tags: ["owox", "table"]
---

# Customers

## Overview
- **Definition type:** TABLE

# Schema

| Column | Type | Description |
|--------|------|-------------|
| \`id\` | INTEGER | PK. id |
`;

// Logic-level: a zipped OWOX bundle round-trips into a ModelGraph.
describe("import zipped bundle", () => {
  it("turns a zipped bundle into a graph", () => {
    const md = `---\ntype: "OWOX Data Mart"\ntitle: "Customers"\ntags: ["owox", "table"]\n---\n\n# Customers\n\n## Overview\n- **Definition type:** TABLE\n\n# Schema\n\n| Column | Type | Description |\n|--------|------|-------------|\n| \`id\` | INTEGER | PK. id |\n`;
    const zip = bundleToZip({ "b/index.md": "# B\n", "b/customers.md": md });
    const files: Record<string, string> = {};
    for (const [p, bytes] of Object.entries(unzipSync(zip))) files[p] = strFromU8(bytes as Uint8Array);
    const g = filesToGraph(files);
    expect(g.nodes.map((n) => n.title)).toContain("Customers");
    expect(g.nodes[0].schema[0]).toMatchObject({ name: "id", pk: true });
  });
});

describe("ImportDialog UI", () => {
  it("previews counts after paste (on the Paste tab) and confirms with the chosen mode", async () => {
    const onConfirm = vi.fn();
    // hasExistingModel: the canvas already has a model, so Replace/Merge shows.
    render(<ImportDialog onConfirm={onConfirm} onClose={() => {}} hasExistingModel />);
    // No preview/counts before any input.
    expect(screen.queryByText(/Will import/i)).toBeNull();
    // The paste textarea lives on the "Paste markdown" tab.
    fireEvent.click(screen.getByRole("button", { name: /paste markdown/i }));
    fireEvent.change(screen.getByPlaceholderText(/path\/to\/file\.md/i), { target: { value: PASTE } });
    await waitFor(() => expect(screen.getByText(/Will import 1 marts, 0 relationships/i)).toBeTruthy());
    fireEvent.click(screen.getByText(/Merge into the canvas/i));
    fireEvent.click(screen.getByRole("button", { name: /^import$/i }));
    expect(onConfirm).toHaveBeenCalledTimes(1);
    const [graph, mode] = onConfirm.mock.calls[0];
    expect(graph.nodes.map((n: { title: string }) => n.title)).toContain("Customers");
    expect(graph.nodes[0].status).toBe("pending");
    expect(mode).toBe("merge");
  });

  it("hides Replace/Merge on an empty canvas and imports as replace", async () => {
    const onConfirm = vi.fn();
    // Default hasExistingModel=false → empty canvas, no apply-mode question.
    render(<ImportDialog onConfirm={onConfirm} onClose={() => {}} />);
    fireEvent.click(screen.getByRole("button", { name: /paste markdown/i }));
    fireEvent.change(screen.getByPlaceholderText(/path\/to\/file\.md/i), { target: { value: PASTE } });
    await waitFor(() => expect(screen.getByText(/Will import 1 marts/i)).toBeTruthy());
    // The apply-mode block is absent.
    expect(screen.queryByText(/When applying to the canvas/i)).toBeNull();
    expect(screen.queryByText(/Replace the canvas/i)).toBeNull();
    fireEvent.click(screen.getByRole("button", { name: /^import$/i }));
    expect(onConfirm).toHaveBeenCalledTimes(1);
    expect(onConfirm.mock.calls[0][1]).toBe("replace");
  });

  it("switches tabs via the segmented control", () => {
    render(<ImportDialog onConfirm={() => {}} onClose={() => {}} />);
    // Upload tab is the default: the file input is present, URL input is not.
    expect(screen.getByText(/Upload \.md/i)).toBeTruthy();
    expect(screen.queryByPlaceholderText(/github\.com/i)).toBeNull();
    // Switch to the GitHub tab.
    fireEvent.click(screen.getByRole("button", { name: /from github/i }));
    expect(screen.getByPlaceholderText(/github\.com/i)).toBeTruthy();
    expect(screen.queryByText(/Upload \.md/i)).toBeNull();
  });
});

afterEach(() => vi.unstubAllGlobals());

describe("ImportDialog GitHub URL import", () => {
  it("renders the GitHub URL input on the GitHub tab (no Fetch button — it auto-loads)", () => {
    render(<ImportDialog onConfirm={() => {}} onClose={() => {}} />);
    fireEvent.click(screen.getByRole("button", { name: /from github/i }));
    expect(screen.getByPlaceholderText(/github\.com/i)).toBeTruthy();
    expect(screen.queryByRole("button", { name: /^fetch$/i })).toBeNull();
  });

  it("shows Share for a valid GitHub URL and copies the readable deeplink", async () => {
    const writeText = vi.fn().mockResolvedValue(undefined);
    Object.defineProperty(navigator, "clipboard", { value: { writeText }, configurable: true });

    render(<ImportDialog onConfirm={() => {}} onClose={() => {}} />);
    fireEvent.click(screen.getByRole("button", { name: /from github/i }));
    const input = screen.getByPlaceholderText(/github\.com/i);
    // No Share control until a valid GitHub URL is present.
    expect(screen.queryByRole("button", { name: /share/i })).toBeNull();

    const bundle = "https://github.com/OWOX/models/tree/main/bundles/saas";
    fireEvent.change(input, { target: { value: bundle } });
    const share = await screen.findByRole("button", { name: /share/i });
    fireEvent.click(share);

    expect(writeText).toHaveBeenCalledWith(location.origin + "/?okf=" + bundle);
    await waitFor(() => expect(screen.getByText(/deeplink copied/i)).toBeTruthy());
  });

  it("auto-fetches on paste (no button click needed)", async () => {
    const base = "https://raw.githubusercontent.com/OWOX/models/main/bundles/demo-project/";
    vi.stubGlobal("fetch", vi.fn(async (u: string) => {
      const bodies: Record<string, string> = {
        [base + "index.md"]: "---\ntitle: Demo Project\n---\n[Orders](./orders.md)",
        [base + "orders.md"]: "---\ntitle: Orders\ntype: OWOX Data Mart\n---\n\n## Schema\n\n- id INTEGER\n",
      };
      const body = bodies[u];
      return { ok: body != null, status: body != null ? 200 : 404, text: async () => body ?? "" } as Response;
    }));

    render(<ImportDialog onConfirm={() => {}} onClose={() => {}} />);
    fireEvent.click(screen.getByRole("button", { name: /from github/i }));
    const input = screen.getByPlaceholderText(/github\.com/i) as HTMLInputElement;
    const url = "https://github.com/OWOX/models/tree/main/bundles/demo-project";
    // Simulate a paste: value is set, then the paste handler fires.
    input.value = url;
    fireEvent.paste(input);
    await waitFor(() => expect(screen.getByText(/Will import 1 marts/i)).toBeTruthy());
    expect(screen.getByText(/Demo Project/i)).toBeTruthy();
  });

  it("opens the GitHub tab, prefills, auto-fetches, and previews the model (name + objects) when initialUrl is given", async () => {
    const base = "https://raw.githubusercontent.com/OWOX/models/main/bundles/demo-project/";
    vi.stubGlobal("fetch", vi.fn(async (url: string) => {
      const bodies: Record<string, string> = {
        [base + "index.md"]: "---\ntitle: Demo Project\n---\n[Orders](./orders.md)",
        [base + "orders.md"]: "---\ntitle: Orders\ntype: OWOX Data Mart\n---\n\n## Schema\n\n- id INTEGER\n",
      };
      const body = bodies[url];
      return { ok: body != null, status: body != null ? 200 : 404, text: async () => body ?? "" } as Response;
    }));

    const url = "https://github.com/OWOX/models/tree/main/bundles/demo-project";
    const onConfirm = vi.fn();
    render(<ImportDialog onConfirm={onConfirm} onClose={() => {}} initialUrl={url} />);

    // Deeplink opens directly on the GitHub tab with the URL prefilled.
    const input = screen.getByPlaceholderText(/github\.com/i) as HTMLInputElement;
    expect(input.value).toBe(url);
    await waitFor(() => expect(screen.getByText(/Will import/i)).toBeTruthy());
    expect(screen.getByText(/Will import 1 marts/i)).toBeTruthy();
    // Model name (from index.md frontmatter) and the object list are shown.
    expect(screen.getByText(/Demo Project/i)).toBeTruthy();
    expect(screen.getByText(/^Orders$/i)).toBeTruthy();
    // Deeplink previews the bundle but never auto-applies it — Import stays a
    // manual, deliberate click.
    expect(onConfirm).not.toHaveBeenCalled();
  });

  it("rejects a URL with no OKF marts: shows an error, no count, Import disabled", async () => {
    const base = "https://raw.githubusercontent.com/OWOX/models/main/bundles/";
    vi.stubGlobal("fetch", vi.fn(async (u: string) => {
      // index.md exists but only links to sub-folders (no .md marts).
      const bodies: Record<string, string> = {
        [base + "index.md"]: "# Bundles\n\n- [demo-project](./demo-project)\n",
      };
      const body = bodies[u];
      return { ok: body != null, status: body != null ? 200 : 404, text: async () => body ?? "" } as Response;
    }));

    render(<ImportDialog onConfirm={() => {}} onClose={() => {}} initialUrl="https://github.com/OWOX/models/tree/main/bundles" />);
    await waitFor(() => expect(screen.getByText(/no okf marts found/i)).toBeTruthy());
    expect(screen.queryByText(/Will import/i)).toBeNull();
    expect((screen.getByRole("button", { name: /^import$/i }) as HTMLButtonElement).disabled).toBe(true);
  });

  it("keeps each tab autonomous: the GitHub preview does not show on other tabs", async () => {
    const base = "https://raw.githubusercontent.com/OWOX/models/main/bundles/demo-project/";
    vi.stubGlobal("fetch", vi.fn(async (url: string) => {
      const bodies: Record<string, string> = {
        [base + "index.md"]: "---\ntitle: Demo Project\n---\n[Orders](./orders.md)",
        [base + "orders.md"]: "---\ntitle: Orders\ntype: OWOX Data Mart\n---\n\n## Schema\n\n- id INTEGER\n",
      };
      const body = bodies[url];
      return { ok: body != null, status: body != null ? 200 : 404, text: async () => body ?? "" } as Response;
    }));

    const url = "https://github.com/OWOX/models/tree/main/bundles/demo-project";
    render(<ImportDialog onConfirm={() => {}} onClose={() => {}} initialUrl={url} />);

    // GitHub tab shows the preview and an enabled Import button.
    await waitFor(() => expect(screen.getByText(/Will import 1 marts/i)).toBeTruthy());
    expect((screen.getByRole("button", { name: /^import$/i }) as HTMLButtonElement).disabled).toBe(false);

    // Switching to the Upload tab (no input there) hides the preview and
    // disables Import — the fetched model belongs to the GitHub tab only.
    fireEvent.click(screen.getByRole("button", { name: /upload files/i }));
    await waitFor(() => expect(screen.queryByText(/Will import/i)).toBeNull());
    expect(screen.queryByText(/Demo Project/i)).toBeNull();
    expect((screen.getByRole("button", { name: /^import$/i }) as HTMLButtonElement).disabled).toBe(true);

    // Switching back restores the GitHub tab's own preview.
    fireEvent.click(screen.getByRole("button", { name: /from github/i }));
    await waitFor(() => expect(screen.getByText(/Will import 1 marts/i)).toBeTruthy());
  });
});
