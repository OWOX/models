// Template library. Each template lives in its own file and is authored as a
// ModelGraph (the same shape OKF encodes), so it round-trips to an OKF bundle
// via Export OKF. Positions are 0,0 — the canvas runs Dagre auto-layout when a
// template is loaded. Template ids are immutable: `?template=<id>` deep links
// are the CTA target for the blog gallery, launch emails and social posts.
export type { Template } from "./helpers";

import type { Template } from "./helpers";
import { ecommerce } from "./ecommerce";
import { saas } from "./saas";
import { marketplace } from "./marketplace";
import { marketing_ads } from "./marketing-ads";
import { mobile_gaming } from "./mobile-gaming";
import { finance } from "./finance";
import { medical } from "./medical";
import { ott_media } from "./ott-media";
import { delivery_logistics } from "./delivery-logistics";
import { insurance } from "./insurance";
import { b2b_sales } from "./b2b-sales";
import { crypto_bitcoin } from "./bitcoin";
import { stackoverflow } from "./stackoverflow";

export const TEMPLATES: Template[] = [
  ecommerce,
  saas,
  marketplace,
  marketing_ads,
  mobile_gaming,
  finance,
  medical,
  ott_media,
  delivery_logistics,
  insurance,
  b2b_sales,
  crypto_bitcoin,
  stackoverflow,
];

export const INDUSTRY_TEMPLATES: Template[] = TEMPLATES.filter(t => t.category === "industry");
export const DATASET_TEMPLATES: Template[] = TEMPLATES.filter(t => t.category === "dataset");
