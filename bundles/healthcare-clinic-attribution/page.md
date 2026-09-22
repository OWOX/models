---
title: "Page"
description: |
  Every page of the practice's website that a visitor can land on, held once and reused by
  every view of it. Keeping pages as their own object rather than as a URL repeated on each
  view is what lets a clinic ask which kinds of page do the work: whether the enquiries that
  begin on a treatment page and the ones that begin on a pricing page fare the same once a
  clinician has looked at them.
tags: ["owox", "view"]
type: "OWOX Data Mart"
---

# Page

One row per page of the site, keyed by `page_id`. `page_type` is what lets a question be
asked of a kind of page rather than of one URL: whether the visitor was reading about a
treatment, checking prices, or browsing the blog.

# Schema

| Column | Type | Alias | Description |
|--------|------|-------|-------------|
| `page_id` | STRING | Page ID | PK. Unique identifier for this page. |
| `page_url` | STRING | Page URL | Full address of the page, including its domain. |
| `page_path` | STRING | Page Path | Path portion of the address, without domain or query string — the form that identifies a page across domains and tracking parameters. |
| `page_title` | STRING | Page Title | Title shown in the browser tab and in search results. |
| `page_type` | STRING | Page Type | What the page is for: `home`, `treatment`, `pricing`, `contact`, `blog` or `booking_form`. This is what makes a question about page effectiveness answerable at all. |

# Example Questions

- Which kinds of page — treatment, pricing, contact, blog — appear in the journeys of the enquiries a clinician ends up qualifying, and which appear only in the ones refused?
- Do visitors who reach a pricing page before enquiring convert to booked `treatment` at a different rate than those who never see one?
- Which individual pages carry the most first landings, and are those the same pages that carry the most eventual patients?
