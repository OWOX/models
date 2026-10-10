# Apache Ossie on OWOX Model Canvas

**Apache Ossie** (formerly Open Semantic Interchange, OSI) is a vendor-neutral YAML/JSON specification for semantic models: datasets, fields, relationships and metrics. It is an incubating project of the Apache Software Foundation: https://github.com/apache/ossie

**OWOX Model Canvas** (https://model.owox.com) imports and exports Ossie next to its own OKF bundles. Use Ossie to exchange a model with other tools (dbt, Snowflake, Power BI, Lightdash and others). Use OKF to author a model with AI or to keep every canvas detail. See [/okf-format.md](/okf-format.md) for OKF.

---

## How to use it

- **Import.** Open **Import model** on the canvas. Choose an OKF bundle (`.zip` / `.md`) or an Apache Ossie file (`.yaml` / `.json`), or paste the text. A GitHub folder loads as OKF. A GitHub `.yaml` / `.json` file loads as Ossie.
- **Export.** Open the **Export** menu and choose **Apache Ossie (.yaml)**. The file is named `<model-name>.ossie.yaml`. The **OKF bundle (.zip)** entry exports OKF.
- **Deeplink.** `https://model.owox.com/?ossie=<GitHub file URL>` opens an Ossie file from GitHub. (`?okf=` stays for OKF.)
- **One format at a time.** The canvas detects the format from the file extension, or from the text when you paste. Text counts as Ossie only when it has a top-level `datasets` or `semantic_model` key. In a mixed upload, `.yaml` / `.json` files that are not Ossie models are ignored next to OKF `.md` files.

The canvas reads the flat `0.2.x` document and the legacy `semantic_model: [ ... ]` wrapper (YAML or JSON). With several models in one file, it imports the first and tells you how many it skipped.

---

## What the canvas reads

| Ossie | Canvas |
|-------|--------|
| `dataset` | A data mart (node). `name` is the title and key. `source` is the definition; a `source` that starts with `SELECT` or `WITH` becomes a SQL mart, anything else a table. `description` and `ai_context` become the description. |
| `dataset.primary_key` | Primary key flag on those fields. A key column that is not declared as a field is added as a STRING field. |
| `field` with `expression` equal to the name | A regular field. |
| `field` with any other `expression` | A calculated column (the expression is the formula). |
| `field.datatype` | Field type: String = STRING, Integer = INTEGER, Decimal = NUMERIC, Float = FLOAT, Boolean = BOOLEAN, Date = DATE, Time = TIME, DateTime = DATETIME, DateTimeTz = TIMESTAMP. Opaque or missing = STRING. |
| `field.description`, `field.ai_context` | Field description. |
| `relationship` | A join (edge) from `from` to `to`. `from_columns` and `to_columns` are zipped into join keys. Cardinality is N:1. |
| `relationship.ai_context` | The join description (business meaning, shared with AI assistants in OWOX). A plain string is kept as written; an object becomes text like a dataset's `ai_context`. On export the description is written as a plain-string `ai_context`. |
| `metric` | A metric (calculated field) on a "home" dataset. See below. |
| `ai_context` | Added to the description as text: `AI instructions: ...`, `Synonyms: a, b`, `Example questions: q1; q2`. A plain string becomes `AI context: ...`. |

Expressions: the canvas takes the `BIGQUERY` dialect entry when there is one, otherwise the first entry.

**Metrics.** The home dataset is the one the metric references that has the most direct relationships to the other referenced datasets (a tie goes to the first referenced). References are rewritten: `home.field` becomes `field`, and `other.field` becomes `<join alias>.field`. If the home has no direct relationship to another referenced dataset, the metric is still imported, with a warning. A metric that references no dataset (for example `COUNT(*)`) is kept only when the OWOX extension names its `home`. Metric `datatype` sets the type (default NUMERIC).

**Warnings.** A formula with a window function (`OVER (`) is imported with a warning: OWOX refuses it on push.

---

## What it writes

- **Document.** `version: 0.2.0.dev0`, a flat document (no `semantic_model` wrapper), YAML, with `name` set to the snake_case model name, then `datasets`, `relationships` and `metrics`. The dialect is `BIGQUERY`.
- **Datasets.** One per mart, named in snake_case from the title (a clash gets `_2`). `source` is the definition; a mart with no definition gets its title as `source` and a warning. `primary_key` lists the primary-key fields.
- **Fields.** A regular field has `expression` equal to its name. A calculated column keeps its formula. Types use the reverse of the map above: NUMERIC and BIGNUMERIC become Decimal, TIMESTAMP becomes DateTimeTz, and JSON, GEOGRAPHY, BYTES, RECORD, STRUCT, RANGE and INTERVAL become Opaque (the exact type is kept in the OWOX extension). A calculated field with an empty formula is not exported (warning).
- **Metrics.** An aggregating calculated field becomes a model `metric`. Its references are written as `dataset.field`. Its home dataset goes in the OWOX extension.
- **Relationships.** Ossie relationships run many to one. N:1, 1:1 and unset cardinality are written as they are. A 1:N edge is written swapped and marked in the OWOX extension, so import restores it. N:N edges and edges without complete join keys are skipped, with a warning.
- **Warnings.** The canvas lists warnings in a message after the download.

---

## Not imported

The canvas has no place for these. The import dialog lists them:

- `unique_keys` that differ from the primary key
- Model-level `description` and `ai_context`
- `custom_extensions` of vendors other than OWOX
- Extra models in a legacy `semantic_model` list (after the first)
- Datasets, fields or relationships without a name, relationships that point to an unknown dataset, fields without an expression, and metrics that read no dataset

---

## The OWOX extension

The canvas keeps its own data in `custom_extensions` with `vendor_name: OWOX`. `data` is a JSON string. Other tools ignore it. Without it, the model still imports; only canvas details are lost.

| Level | Keys |
|-------|------|
| Model | `generator` (`model.owox.com`), `name` (the model name as typed) |
| Dataset | `title`, `inputSource`, `x`, `y` (position on the canvas) |
| Field | `type` (exact canvas type, written only when the Ossie `datatype` cannot restore it), `alias` |
| Relationship | `alias`, `reverseAlias`, `bidirectional`, `cardinality`, `swapped` (set when a 1:N edge was turned around) |
| Metric | `home` (dataset that holds the metric), `alias`, `type` |

---

## Complete example

Two datasets, one relationship, one metric and one calculated column. It imports on the canvas as two marts, one join, one metric (`revenue_per_customer`) and one calculated column (`total_with_vat`).

```yaml
version: 0.2.0.dev0
name: shop
datasets:
  - name: customers
    source: my-project.shop.customers
    primary_key:
      - id
    fields:
      - name: id
        expression:
          dialects:
            - dialect: BIGQUERY
              expression: id
        datatype: String
      - name: country
        expression:
          dialects:
            - dialect: BIGQUERY
              expression: country
        datatype: String
  - name: orders
    source: my-project.shop.orders
    primary_key:
      - id
    fields:
      - name: id
        expression:
          dialects:
            - dialect: BIGQUERY
              expression: id
        datatype: String
      - name: customer_id
        expression:
          dialects:
            - dialect: BIGQUERY
              expression: customer_id
        datatype: String
      - name: total
        expression:
          dialects:
            - dialect: BIGQUERY
              expression: total
        datatype: Decimal
      - name: total_with_vat
        expression:
          dialects:
            - dialect: BIGQUERY
              expression: total * 1.2
        datatype: Decimal
relationships:
  - name: orders_to_customers
    from: orders
    to: customers
    from_columns:
      - customer_id
    to_columns:
      - id
metrics:
  - name: revenue_per_customer
    expression:
      dialects:
        - dialect: BIGQUERY
          expression: SUM(orders.total) / COUNT(DISTINCT customers.id)
    datatype: Decimal
```
