
export interface GitHubRepository {
  id: number
  name: string
  full_name: string
  html_url: string
  description: string | null
  stargazers_count: number
  forks_count: number
  open_issues_count: number
  language: string | null
}

interface GitHubRepositorySearchResponse {
  total_count: number
  items: GitHubRepository[]
}

const GITHUB_API_URL = 'https://api.github.com/search/repositories'
const RESULTS_PER_PAGE = 100

export async function fetchRandomRepository(
  language: string,
): Promise<GitHubRepository | null> {
  const normalizedLanguage = language.trim()

  if (!normalizedLanguage) {
    throw new Error('Programming language is required.')
  }

  const query = new URLSearchParams({
    q: `language:${normalizedLanguage}`,
    sort: 'stars',
    order: 'desc',
    per_page: String(RESULTS_PER_PAGE),
  })

  const response = await fetch(`${GITHUB_API_URL}?${query}`)

  if (!response.ok) {
    throw new Error(
      `GitHub API request failed with status ${response.status}.`,
    )
  }

  const data =
    (await response.json()) as GitHubRepositorySearchResponse

  if (data.items.length === 0) {
    return null
  }

  const randomIndex = Math.floor(Math.random() * data.items.length)

  return data.items[randomIndex]
}
