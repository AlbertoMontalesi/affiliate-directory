import affiliatesData from './affiliates.json' with { type: 'json' };

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

/**
 * Picks a small, contextually relevant set of affiliates for a piece of
 * content (e.g. a blog post), using each affiliate's `topics`. Affiliates
 * whose `topics` intersect the given topics rank first; the list is then
 * padded (by weight) so `count` results are always returned.
 *
 * @param {string[]} topics - post tags/keywords to match against
 * @param {Object} [options]
 * @param {string} [options.excludeId]
 * @param {number} [options.count]
 * @returns {Array<object>}
 */
export function pickAffiliatesForTopics(topics = [], { excludeId, count = 3 } = {}) {
  const normalized = topics.map((t) => t.trim().toLowerCase());
  const pool = getAffiliates({ excludeId });

  const matches = pool.filter((a) =>
    a.topics?.some((topic) => normalized.includes(topic.toLowerCase()))
  );

  const selected = [...matches];
  for (const affiliate of pool) {
    if (selected.length >= count) break;
    if (!selected.includes(affiliate)) selected.push(affiliate);
  }

  return selected.slice(0, count);
}

export default affiliatesData;
