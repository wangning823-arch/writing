import { NextRequest, NextResponse } from 'next/server'
import { getErrorCases } from '@/lib/training/error-cases'

/**
 * GET /api/errors/cases?subject=chinese&category=逻辑类
 *
 * Returns error cases with optional subject and category filters.
 */
export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url)
    const subject = searchParams.get('subject') as 'chinese' | 'english' | null
    const category = searchParams.get('category') || undefined

    const cases = getErrorCases(
      subject || undefined,
      category || undefined
    )

    return NextResponse.json({ cases, total: cases.length })
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Unknown error'
    console.error('Error cases fetch error:', message)
    return NextResponse.json(
      { error: 'Failed to fetch error cases: ' + message },
      { status: 500 }
    )
  }
}
