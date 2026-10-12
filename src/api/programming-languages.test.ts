import { afterEach, describe, expect, it, vi } from 'vitest'
import {
  fetchProgrammingLanguages,
  type ProgrammingLanguage,
} from './programming-languages'

const sourceLanguages = [
  { title: 'All Languages', value: '' },
  { title: 'JavaScript', value: 'JavaScript' },
  { title: 'TypeScript', value: 'TypeScript' },
  { title: 'Python', value: 'Python' },
]

const languages: ProgrammingLanguage[] = [
  { name: 'JavaScript', value: 'JavaScript' },
  { name: 'TypeScript', value: 'TypeScript' },
  { name: 'Python', value: 'Python' },
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
    const fetchMock = mockFetch(sourceLanguages)

    const result = await fetchProgrammingLanguages()

    expect(fetchMock).toHaveBeenCalledOnce()
    expect(fetchMock).toHaveBeenCalledWith(
      'https://raw.githubusercontent.com/nilbuild/githunt/master/src/components/filters/language-filter/languages.json',
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
    mockFetch({ languages: sourceLanguages })

    await expect(fetchProgrammingLanguages()).rejects.toThrow(
      'Invalid programming languages response.',
    )
  })

  it('rejects a response without valid language entries', async () => {
    mockFetch([
      { title: 'JavaScript' },
      { value: 'TypeScript' },
      null,
    ])

    await expect(fetchProgrammingLanguages()).rejects.toThrow(
      'No programming languages were found.',
    )
  })

  it('filters invalid entries and excludes the empty language option', async () => {
    mockFetch([
      ...sourceLanguages,
      { title: 'Invalid language' },
      null,
    ])

    const result = await fetchProgrammingLanguages()

    expect(result).toEqual(languages)
  })
})
