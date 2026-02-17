export interface ProgrammingLanguage {
  name: string
  value: string
}

const LANGUAGES_URL =
  'https://raw.githubusercontent.com/kamranahmedse/githunt/master/src/components/filters/language-filter/languages.json'

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
    (item): item is ProgrammingLanguage =>
      typeof item === 'object' &&
      item !== null &&
      'name' in item &&
      typeof item.name === 'string' &&
      'value' in item &&
      typeof item.value === 'string',
  )

  if (languages.length === 0) {
    throw new Error('No programming languages were found.')
  }

  return languages
}