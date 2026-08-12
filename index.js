import affiliatesData from './affiliates.json' assert { type: 'json' };

/**
 * Returns enabled affiliates, optionally excluding the site consuming the list
 * (so a site never advertises itself), sorted by weight (desc).
 *
 * @param {Object} [options]
 * @param {string} [options.excludeId] - id of the current site/product, e.g. "langi"
 * @param {boolean} [options.includeDisabled] - include entries with enabled:false
 * @returns {Array<object>}
 */
export function getAffiliates({ excludeId, includeDisabled = false } = {}) {
  return affiliatesData.affiliates
    .filter((a) => includeDisabled || a.enabled)
    .filter((a) => !excludeId || a.id !== excludeId)
    .sort((a, b) => (b.weight ?? 1) - (a.weight ?? 1));
}

export function getAffiliateById(id) {
  return affiliatesData.affiliates.find((a) => a.id === id) ?? null;
}

export default affiliatesData;
