# affiliate-directory

Single source of truth for affiliate/cross-promo links, shared across Langi, Map2Maps,
AppFramer, and any future site. Each site pulls this list at runtime instead of
hardcoding links, so a link only needs to be updated in one place.

## Files

- `affiliates.json` — the data. Each entry:
  ```jsonc
  {
    "id": "wise",           // stable id, also used for self-exclusion
    "name": "Wise",
    "tag": "Money transfers",
    "description": "...",
    "url": "https://...",
    "icon": "💸",
    "backgroundColor": "#059669",
    "textColor": "#ffffff",
    "enabled": true,
    "weight": 1              // higher = shown/rotated more often
  }
  ```
- `index.js` — tiny helper (`getAffiliates`, `getAffiliateById`) for consumers that
  can run JS. Pure JSON consumers (Python scripts, RN, etc.) can just fetch
  `affiliates.json` directly and filter client-side.

## Self-exclusion

Every site that is *also* an affiliate in this list (currently `langi`, `map2maps`,
`appframer`) must exclude its own `id` when rendering the list, so a site never
promotes itself. Pass your site's id as `excludeId`:

```js
import { getAffiliates } from 'affiliate-directory';

const ads = getAffiliates({ excludeId: 'langi' });
```

If you're fetching the raw JSON instead of using the helper, replicate the filter:

```js
const res = await fetch('https://cdn.jsdelivr.net/gh/<user>/affiliate-directory@latest/affiliates.json');
const { affiliates } = await res.json();
const ads = affiliates.filter((a) => a.enabled && a.id !== 'langi');
```

## Hosting on jsDelivr

jsDelivr serves any public GitHub repo without publishing to npm:

```
https://cdn.jsdelivr.net/gh/<github-user>/affiliate-directory@<tag>/affiliates.json
https://cdn.jsdelivr.net/gh/<github-user>/affiliate-directory@<tag>/index.js
```

Steps:
1. `git init`, commit, push to a new GitHub repo (public, so jsDelivr can serve it).
2. Tag releases (`git tag v1.0.0 && git push --tags`) and pin consumers to a tag
   (`@v1.0.0`) rather than `@latest`/`@main`, so a bad edit here can't break every
   site at once. jsDelivr caches by tag for ~7 days (purge via
   `https://purge.jsdelivr.net/gh/<user>/affiliate-directory@<tag>/affiliates.json`
   if you need an immediate update on an existing tag).
3. Bump the tag whenever `affiliates.json` changes, update the version pin in each
   consuming site.

## Adding a new affiliate

1. Add an entry to `affiliates.json` with a unique `id`.
2. If the entry represents one of our own sites (for cross-promo), use that site's
   canonical `id` so it can self-exclude correctly.
3. Bump the version/tag and update consumers per above.

## Known issues

- appFramer's local Wise link (`src/utils/recommendedServices.js`) points to
  `analytics.montalesi.devom/invite/...`, which looks like a typo of the working
  Wise link (`wise.com/invite/ihpc/albertom231` — used here). Worth fixing in that
  repo once it's switched over to consume this directory.
