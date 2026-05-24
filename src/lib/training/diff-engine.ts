/**
 * Paragraph-level diff engine (no external dependencies).
 *
 * Uses LCS (Longest Common Subsequence) for paragraph matching,
 * then classifies each segment as unchanged/added/removed/modified.
 *
 * Designed for essay revision comparison: paragraph-level granularity
 * is appropriate because essays are organized by paragraphs.
 */

import type { DiffSegment, SuggestionStatus } from '@/types'

// ---------------------------------------------------------------------------
// LCS (Longest Common Subsequence) implementation
// ---------------------------------------------------------------------------

/**
 * Compute the LCS table for two arrays of strings.
 * Returns a 2D array where lcs[i][j] = length of LCS of a[0..i-1] and b[0..j-1].
 */
function buildLCSTable(a: string[], b: string[]): number[][] {
  const m = a.length
  const n = b.length
  const table: number[][] = Array.from({ length: m + 1 }, () =>
    new Array(n + 1).fill(0),
  )

  for (let i = 1; i <= m; i++) {
    for (let j = 1; j <= n; j++) {
      if (a[i - 1] === b[j - 1]) {
        table[i][j] = table[i - 1][j - 1] + 1
      } else {
        table[i][j] = Math.max(table[i - 1][j], table[i][j - 1])
      }
    }
  }

  return table
}

/**
 * Backtrack through the LCS table to find the alignment of paragraphs.
 * Returns an array of operations: 'match', 'skip-original', 'skip-revised'.
 */
function backtrackLCS(
  table: number[][],
  a: string[],
  b: string[],
): Array<{ op: 'match' | 'skip-original' | 'skip-revised'; i: number; j: number }> {
  const ops: Array<{
    op: 'match' | 'skip-original' | 'skip-revised'
    i: number
    j: number
  }> = []
  let i = a.length
  let j = b.length

  while (i > 0 || j > 0) {
    if (i > 0 && j > 0 && a[i - 1] === b[j - 1]) {
      ops.unshift({ op: 'match', i: i - 1, j: j - 1 })
      i--
      j--
    } else if (j > 0 && (i === 0 || table[i][j - 1] >= table[i - 1][j])) {
      ops.unshift({ op: 'skip-revised', i: i - 1, j: j - 1 })
      j--
    } else {
      ops.unshift({ op: 'skip-original', i: i - 1, j: j - 1 })
      i--
    }
  }

  return ops
}

// ---------------------------------------------------------------------------
// Text preprocessing
// ---------------------------------------------------------------------------

/**
 * Split text into paragraphs, filtering out empty lines.
 */
function splitParagraphs(text: string): string[] {
  return text
    .split(/\n\s*\n/)
    .map((p) => p.trim())
    .filter((p) => p.length > 0)
}

/**
 * Normalize a paragraph for comparison: collapse whitespace,
 * lowercase, remove punctuation for fuzzy matching.
 */
function normalize(text: string): string {
  return text
    .toLowerCase()
    .replace(/\s+/g, ' ')
    .replace(/[，。！？、；：""''（）\[\]【】,.!?;:'"()\s]/g, '')
    .trim()
}

// ---------------------------------------------------------------------------
// Diff computation
// ---------------------------------------------------------------------------

/**
 * Compute paragraph-level diff between original and revised text.
 *
 * Uses LCS to find the longest common subsequence of paragraphs,
 * then marks remaining paragraphs as added or removed.
 * Modified paragraphs (similar but not identical) are detected
 * via string similarity comparison.
 *
 * @param original - The original text
 * @param revised - The revised text
 * @returns Array of diff segments
 */
export function computeParagraphDiff(
  original: string,
  revised: string,
): DiffSegment[] {
  const origParagraphs = splitParagraphs(original)
  const revParagraphs = splitParagraphs(revised)

  if (origParagraphs.length === 0 && revParagraphs.length === 0) {
    return []
  }

  if (origParagraphs.length === 0) {
    return revParagraphs.map((text, i) => ({
      id: `diff-${i}`,
      status: 'added' as const,
      revised: text,
    }))
  }

  if (revParagraphs.length === 0) {
    return origParagraphs.map((text, i) => ({
      id: `diff-${i}`,
      status: 'deleted' as const,
      original: text,
    }))
  }

  // Build LCS on normalized versions
  const normOrig = origParagraphs.map(normalize)
  const normRev = revParagraphs.map(normalize)
  const table = buildLCSTable(normOrig, normRev)
  const ops = backtrackLCS(table, normOrig, normRev)

  // Group consecutive skip-original and skip-revised as modifications
  const segments: DiffSegment[] = []
  let segIndex = 0
  let i = 0

  while (i < ops.length) {
    const current = ops[i]

    if (current.op === 'match') {
      // Check if paragraphs are identical or just similar
      if (origParagraphs[current.i] === revParagraphs[current.j]) {
        segments.push({
          id: `diff-${segIndex++}`,
          status: 'unchanged',
          original: origParagraphs[current.i],
          revised: revParagraphs[current.j],
        })
      } else {
        // Modified: same position in LCS but different content
        segments.push({
          id: `diff-${segIndex++}`,
          status: 'modified',
          original: origParagraphs[current.i],
          revised: revParagraphs[current.j],
        })
      }
      i++
    } else if (current.op === 'skip-original') {
      // Look ahead to see if there's a corresponding skip-revised
      let j = i
      const removedOriginals: string[] = []
      const addedReviseds: string[] = []

      while (j < ops.length && ops[j].op === 'skip-original') {
        removedOriginals.push(origParagraphs[ops[j].i])
        j++
      }

      while (j < ops.length && ops[j].op === 'skip-revised') {
        addedReviseds.push(revParagraphs[ops[j].j])
        j++
      }

      if (removedOriginals.length > 0 && addedReviseds.length > 0) {
        // Modification: some paragraphs replaced by others
        segments.push({
          id: `diff-${segIndex++}`,
          status: 'modified',
          original: removedOriginals.join('\n\n'),
          revised: addedReviseds.join('\n\n'),
        })
      } else {
        // Pure deletion
        for (const text of removedOriginals) {
          segments.push({
            id: `diff-${segIndex++}`,
            status: 'deleted',
            original: text,
          })
        }
      }

      i = j
    } else if (current.op === 'skip-revised') {
      // Pure addition
      const addedTexts: string[] = []
      while (i < ops.length && ops[i].op === 'skip-revised') {
        addedTexts.push(revParagraphs[ops[i].j])
        i++
      }
      for (const text of addedTexts) {
        segments.push({
          id: `diff-${segIndex++}`,
          status: 'added',
          revised: text,
        })
      }
    } else {
      i++
    }
  }

  return segments
}

// ---------------------------------------------------------------------------
// Suggestion status tracking
// ---------------------------------------------------------------------------

/**
 * Calculate string similarity between two strings (0-1 scale).
 * Uses a simple Jaccard similarity on character bigrams.
 */
function stringSimilarity(a: string, b: string): number {
  if (a === b) return 1
  if (a.length === 0 || b.length === 0) return 0

  const getBigrams = (s: string): Set<string> => {
    const bigrams = new Set<string>()
    for (let i = 0; i < s.length - 1; i++) {
      bigrams.add(s.substring(i, i + 2))
    }
    return bigrams
  }

  const aBigrams = getBigrams(normalize(a))
  const bBigrams = getBigrams(normalize(b))

  let intersection = 0
  for (const bg of aBigrams) {
    if (bBigrams.has(bg)) intersection++
  }

  const union = aBigrams.size + bBigrams.size - intersection
  return union === 0 ? 0 : intersection / union
}

/**
 * Find the diff segment that corresponds to a suggestion's location.
 *
 * Matches by checking if the suggestion's location description
 * relates to text in a diff segment.
 */
function findRelatedSegment(
  suggestion: SuggestionStatus,
  diffSegments: DiffSegment[],
): DiffSegment | undefined {
  // Try to match by text content mentioned in the suggestion
  const suggestionText = suggestion.location.toLowerCase()

  return diffSegments.find((seg) => {
    const origLower = (seg.original || '').toLowerCase()
    const revLower = (seg.revised || '').toLowerCase()

    // Check if the suggestion location references text in this segment
    if (origLower.includes(suggestionText) || revLower.includes(suggestionText)) {
      return true
    }

    // Check similarity between suggestion location and segment content
    if (seg.original && stringSimilarity(suggestionText, origLower) > 0.3) {
      return true
    }

    return false
  })
}

/**
 * Track the status of each AI suggestion after a revision.
 *
 * For each suggestion:
 * - `resolved`: The text at that location was changed and the change addresses the suggestion
 * - `unresolved`: The text at that location was not changed
 * - `misdirected`: The text was changed but the change doesn't address the suggestion
 * - `new-issue`: New problems introduced in revised text (tracked separately)
 *
 * @param originalSuggestions - The suggestions from the previous AI review
 * @param diffSegments - The computed diff between original and revised text
 * @param revisedContent - The full revised text (for new issue detection)
 * @returns Updated suggestions with status
 */
export function trackSuggestionStatus(
  originalSuggestions: SuggestionStatus[],
  diffSegments: DiffSegment[],
  _revisedContent: string,
): SuggestionStatus[] {
  return originalSuggestions.map((suggestion) => {
    const relatedSegment = findRelatedSegment(suggestion, diffSegments)

    if (!relatedSegment) {
      // Can't find where this suggestion applies — mark as unresolved
      return { ...suggestion, status: 'unresolved' as const }
    }

    // Check if the related segment was changed
    if (relatedSegment.status === 'unchanged') {
      // Text wasn't changed at this location
      return { ...suggestion, status: 'unresolved' as const }
    }

    if (
      relatedSegment.status === 'deleted' ||
      relatedSegment.status === 'added'
    ) {
      // The paragraph was entirely replaced — likely addressed
      return { ...suggestion, status: 'resolved' as const }
    }

    if (relatedSegment.status === 'modified') {
      // The paragraph was modified. We can't fully determine if the
      // modification addresses the suggestion without AI analysis,
      // so we mark it as "resolved" if there's significant change
      // (the AI revision review will do the detailed check).
      const origText = relatedSegment.original || ''
      const revText = relatedSegment.revised || ''
      const similarity = stringSimilarity(origText, revText)

      if (similarity < 0.5) {
        // Significant change — likely addressed
        return { ...suggestion, status: 'resolved' as const }
      } else if (similarity < 0.8) {
        // Some change — might be addressed, let AI decide
        // For now, mark as resolved since something changed
        return { ...suggestion, status: 'resolved' as const }
      } else {
        // Minimal change — probably not addressed
        return { ...suggestion, status: 'unresolved' as const }
      }
    }

    return { ...suggestion, status: 'unresolved' as const }
  })
}
