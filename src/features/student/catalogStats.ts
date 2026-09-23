import type { FullCatalogYear, FullCatalogTrimester } from '../../api/endpoints/catalog';

export function getYearStats(year: FullCatalogYear) {
  let subjectCount = 0;
  let supportCount = 0;
  let activeTrimester: FullCatalogTrimester | undefined;
  let nextTrimester: FullCatalogTrimester | undefined;

  for (const t of year.trimesters) {
    subjectCount += t.subjects.length;
    for (const s of t.subjects) supportCount += s.content_items.length;
    if (t.status === 'ACTIVE' && !activeTrimester) activeTrimester = t;
    if (t.status === 'UPCOMING' && !nextTrimester) nextTrimester = t;
  }

  return {
    trimesterCount: year.trimesters.length,
    subjectCount,
    supportCount,
    activeTrimester,
    nextTrimester,
  };
}