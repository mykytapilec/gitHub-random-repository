
import { afterEach, describe, expect, it, vi } from 'vitest'
import { fetchRandomRepository } from './github-repositories'
import type { GitHubRepository } from './github-repositories'

const repositories: GitHubRepository[] = [
  {
    id: 1,
    name: 'typescript',
    full_name: 'microsoft/typescript',
    html_url: 'https://github.com/microsoft/typescript',
    description: 'TypeScript is a typed JavaScript superset.',
    stargazers_count: 100000,
    forks_count: 12000,
    open_issues_count: 5000,
    language: 'TypeScript',
  },
  {
    id: 2,
    name: 'example-project',
    full_name: 'example/example-project',
    html_url: 'https://github.com/example/example-project',
    description: null,
    stargazers_count: 500,
    forks_count: 100,
    open_issues_count: 20,
    language: 'TypeScript',
  },
]

function mockFetch(
  items: GitHubRepository[],
  ok = true,
  status = 200,
) {
  vi.stubGlobal(
    'fetch',
    vi.fn().mockResolvedValue({
      ok,
      status,
      json: async () => ({
        total_count: items.length,
        items,
      }),
    }),
  )
}

afterEach(() => {
  vi.unstubAllGlobals()
  vi.restoreAllMocks()
})

describe('fetchRandomRepository', () => {
  it('requests repositories for the selected language', async () => {
    mockFetch(repositories)

    await fetchRandomRepository('TypeScript')

    expect(fetch).toHaveBeenCalledOnce()

    const requestedUrl = new URL(
      vi.mocked(fetch).mock.calls[0][0] as string,
    )

    expect(requestedUrl.pathname).toBe('/search/repositories')
    expect(requestedUrl.searchParams.get('q')).toBe(
      'language:TypeScript',
    )
    expect(requestedUrl.searchParams.get('sort')).toBe('stars')
    expect(requestedUrl.searchParams.get('order')).toBe('desc')
    expect(requestedUrl.searchParams.get('per_page')).toBe('100')
  })

  it('returns a repository from the search results', async () => {
    mockFetch(repositories)
    vi.spyOn(Math, 'random').mockReturnValue(0.99)

    const result = await fetchRandomRepository('TypeScript')

    expect(result).toEqual(repositories[1])
  })

  it('returns null when no repositories are found', async () => {
    mockFetch([])

    const result = await fetchRandomRepository('TypeScript')

    expect(result).toBeNull()
  })

  it('throws an error when the API request fails', async () => {
    mockFetch([], false, 403)

    await expect(
      fetchRandomRepository('TypeScript'),
    ).rejects.toThrow(
      'GitHub API request failed with status 403.',
    )
  })

    it('rejects an empty programming language', async () => {
    const fetchMock = vi.fn()
    vi.stubGlobal('fetch', fetchMock)

    await expect(fetchRandomRepository('  ')).rejects.toThrow(
      'Programming language is required.',
    )

    expect(fetchMock).not.toHaveBeenCalled()
  })
})
