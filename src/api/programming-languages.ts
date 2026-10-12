export interface ProgrammingLanguage {
  name: string
  value: string
}

interface GitHuntLanguage {
  title: string
  value: string
}

const LANGUAGES_URL =
  'https://raw.githubusercontent.com/nilbuild/githunt/master/src/components/filters/language-filter/languages.json'

export async function fetchProgrammingLanguages(): Promise<
  ProgrammingLanguage[]
> {
  const response = await fetch(LANGUAGES_URL)

  if (!response.ok) {
    throw new Error(
      `Failed to load programming languages with status ${response.status}.`,
    )
  }

  const data: unknown = await response.json()

  if (!Array.isArray(data)) {
    throw new Error('Invalid programming languages response.')
  }

  const languages = data.filter(
    (item): item is GitHuntLanguage =>
      typeof item === 'object' &&
      item !== null &&
      'title' in item &&
      typeof item.title === 'string' &&
      'value' in item &&
      typeof item.value === 'string',
  )

  const result = languages
    .filter((language) => language.value.trim() !== '')
    .map((language) => ({
      name: language.title,
      value: language.value,
    }))

  if (result.length === 0) {
    throw new Error('No programming languages were found.')
  }

  return result
}
