
import fs from 'node:fs'
import path from 'node:path'

export type CourseId = 'fitness' | 'fantasy' | 'caregiver'

const FILE_MAP: Record<CourseId, string> = {
  fitness: 'Creating Safe Spaces - Implementing Trauma-Informed Practices in Fitness Environments for Intermediate Learners.txt',
  fantasy: 'Shadows Over Eryndral - A Tangle of Magic and Fate.txt',
  caregiver: 'How to become a Caregiver.txt'
}

export function getCourseTitleById(id: CourseId): string {
  switch (id) {
    case 'fitness': return 'Creating Safe Spaces - Implementing Trauma-Informed Practices in Fitness Environments for Intermediate Learners'
    case 'fantasy': return 'Shadows Over Eryndral - A Tangle of Magic and Fate'
    case 'caregiver': return 'How to become a Caregiver'
  }
}

export function loadCourseContent(id: CourseId): string {
  const fname = FILE_MAP[id]
  const fpath = path.join(process.cwd(), 'src', 'data', fname)
  const raw = fs.readFileSync(fpath, 'utf8')
  return raw
}

export function compressContent(htmlLike: string, maxChars = 12000): string {
  // strip tags and dense whitespace
  const noTags = htmlLike.replace(/<[^>]+>/g, ' ')
  const normalized = noTags.replace(/\s+/g, ' ').trim()
  if (normalized.length <= maxChars) return normalized
  return normalized.slice(0, maxChars) + '…'
}
