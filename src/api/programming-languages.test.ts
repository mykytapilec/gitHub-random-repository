import { afterEach, describe, expect, it, vi } from 'vitest'
import {
  fetchProgrammingLanguages,
  type ProgrammingLanguage,
} from './programming-languages'

const languages: ProgrammingLanguage[] = [
  { name: 'JavaScript', value: 'javascript' },
  { name: 'TypeScript', value: 'typescript' },
  { name: 'Python', value: 'python' },
]

function mockFetch(
  data: unknown,
  ok = true,
  status = 200,
) {
  const fetchMock = vi.fn().mockResolvedValue({
    ok,
    status,
    json: async () => data,
  })

  vi.stubGlobal('fetch', fetchMock)

  return fetchMock
}

afterEach(() => {
  vi.unstubAllGlobals()
  vi.restoreAllMocks()
})

describe('fetchProgrammingLanguages', () => {
  it('requests the language list from the configured URL', async () => {
    const fetchMock = mockFetch(languages)

    const result = await fetchProgrammingLanguages()

    expect(fetchMock).toHaveBeenCalledOnce()
    expect(fetchMock).toHaveBeenCalledWith(
      'https://raw.githubusercontent.com/kamranahmedse/githunt/master/src/components/filters/language-filter/languages.json',
    )
    expect(result).toEqual(languages)
  })

  it('throws an error when the request fails', async () => {
    mockFetch([], false, 503)

    await expect(fetchProgrammingLanguages()).rejects.toThrow(
      'Failed to load programming languages with status 503.',
    )
  })

  it('rejects an invalid response format', async () => {
    mockFetch({ languages })

    await expect(fetchProgrammingLanguages()).rejects.toThrow(
      'Invalid programming languages response.',
    )
  })

  it('rejects a response without valid language entries', async () => {
    mockFetch([
      { name: 'JavaScript' },
      { value: 'typescript' },
      null,
    ])

    await expect(fetchProgrammingLanguages()).rejects.toThrow(
      'No programming languages were found.',
    )
  })

  it('filters invalid entries from the response', async () => {
    mockFetch([
      ...languages,
      { name: 'Invalid language' },
      null,
    ])

    const result = await fetchProgrammingLanguages()

    expect(result).toEqual(languages)
  })
})