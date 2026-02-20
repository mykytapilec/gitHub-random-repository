import { fireEvent, render, screen, waitFor } from '@testing-library/react'
import { afterEach, describe, expect, it, vi } from 'vitest'
import * as programmingLanguagesApi from './api/programming-languages'
import type { ProgrammingLanguage } from './api/programming-languages'
import * as repositoriesApi from './api/github-repositories'
import type { GitHubRepository } from './api/github-repositories'
import App from './App'

const languages: ProgrammingLanguage[] = [
  { name: 'JavaScript', value: 'javascript' },
  { name: 'TypeScript', value: 'typescript' },
  { name: 'Python', value: 'python' },
]

const repository: GitHubRepository = {
  id: 1,
  name: 'typescript',
  full_name: 'microsoft/typescript',
  html_url: 'https://github.com/microsoft/typescript',
  description: 'TypeScript is a typed JavaScript superset.',
  stargazers_count: 100000,
  forks_count: 12000,
  open_issues_count: 5000,
  language: 'TypeScript',
}

function mockLanguages() {
  vi.spyOn(
    programmingLanguagesApi,
    'fetchProgrammingLanguages',
  ).mockResolvedValue(languages)
}

afterEach(() => {
  vi.restoreAllMocks()
})

describe('App', () => {
  it('renders the application heading', () => {
    mockLanguages()

    render(<App />)

    expect(
      screen.getByRole('heading', {
        name: 'Discover your next project',
      }),
    ).toBeInTheDocument()
  })

  it('loads and displays programming languages', async () => {
    mockLanguages()

    render(<App />)

    expect(
      screen.getByText('Loading programming languages...'),
    ).toBeInTheDocument()

    expect(
      await screen.findByRole('combobox', {
        name: 'Programming language',
      }),
    ).toBeInTheDocument()

    expect(
      screen.getByRole('option', { name: 'JavaScript' }),
    ).toBeInTheDocument()

    expect(
      screen.getByRole('option', { name: 'TypeScript' }),
    ).toBeInTheDocument()
  })

  it('updates the selected programming language', async () => {
    mockLanguages()

    render(<App />)

    const select = await screen.findByRole('combobox', {
      name: 'Programming language',
    })

    fireEvent.change(select, { target: { value: 'python' } })

    expect(select).toHaveValue('python')
  })

  it('displays an error and retries loading languages', async () => {
    const fetchLanguagesSpy = vi
      .spyOn(programmingLanguagesApi, 'fetchProgrammingLanguages')
      .mockRejectedValueOnce(new Error('Network error'))
      .mockResolvedValueOnce(languages)

    render(<App />)

    expect(await screen.findByRole('alert')).toHaveTextContent(
      'Unable to load programming languages. Please try again.',
    )

    fireEvent.click(screen.getByRole('button', { name: 'Try again' }))

    await waitFor(() => {
      expect(fetchLanguagesSpy).toHaveBeenCalledTimes(2)
    })

    expect(
      await screen.findByRole('combobox', {
        name: 'Programming language',
      }),
    ).toBeInTheDocument()
  })

  it('finds and displays a repository for the selected language', async () => {
    mockLanguages()

    const fetchRepositorySpy = vi
      .spyOn(repositoriesApi, 'fetchRandomRepository')
      .mockResolvedValue(repository)

    render(<App />)

    const select = await screen.findByRole('combobox', {
      name: 'Programming language',
    })

    fireEvent.change(select, { target: { value: 'typescript' } })
    fireEvent.click(
      screen.getByRole('button', { name: 'Find repository' }),
    )

    expect(fetchRepositorySpy).toHaveBeenCalledWith('typescript')

    expect(
      await screen.findByRole('heading', {
        name: 'microsoft/typescript',
      }),
    ).toBeInTheDocument()

    expect(
      screen.getByText(
        'TypeScript is a typed JavaScript superset.',
      ),
    ).toBeInTheDocument()

    expect(screen.getByText('100,000')).toBeInTheDocument()
    expect(screen.getByText('12,000')).toBeInTheDocument()
    expect(screen.getByText('5,000')).toBeInTheDocument()

    expect(
      screen.getByRole('link', { name: 'View on GitHub' }),
    ).toHaveAttribute(
      'href',
      'https://github.com/microsoft/typescript',
    )
  })

  it('displays a message when no repositories are found', async () => {
    mockLanguages()

    vi.spyOn(
      repositoriesApi,
      'fetchRandomRepository',
    ).mockResolvedValue(null)

    render(<App />)

    await screen.findByRole('combobox', {
      name: 'Programming language',
    })

    fireEvent.click(
      screen.getByRole('button', { name: 'Find repository' }),
    )

    await waitFor(() => {
      expect(
        screen.getByText(
          'Select a language and find a repository to get started.',
        ),
      ).toBeInTheDocument()
    })
  })

  it('displays an error and retries a failed repository request', async () => {
    mockLanguages()

    const fetchRepositorySpy = vi
      .spyOn(repositoriesApi, 'fetchRandomRepository')
      .mockRejectedValueOnce(new Error('Network error'))
      .mockResolvedValueOnce(repository)

    render(<App />)

    await screen.findByRole('combobox', {
      name: 'Programming language',
    })

    fireEvent.click(
      screen.getByRole('button', { name: 'Find repository' }),
    )

    expect(await screen.findByRole('alert')).toHaveTextContent(
      'Unable to load a repository. Please try again.',
    )

    fireEvent.click(screen.getByRole('button', { name: 'Try again' }))

    await waitFor(() => {
      expect(fetchRepositorySpy).toHaveBeenCalledTimes(2)
    })

    expect(
      await screen.findByRole('heading', {
        name: 'microsoft/typescript',
      }),
    ).toBeInTheDocument()
  })

  it('links to the repository on GitHub', async () => {
    mockLanguages()

    vi.spyOn(
      repositoriesApi,
      'fetchRandomRepository',
    ).mockResolvedValue(repository)

    render(<App />)

    await screen.findByRole('combobox', {
      name: 'Programming language',
    })

    fireEvent.click(
      screen.getByRole('button', { name: 'Find repository' }),
    )

    const repositoryLink = await screen.findByRole('link', {
      name: 'microsoft/typescript',
    })

    expect(repositoryLink).toHaveAttribute(
      'href',
      'https://github.com/microsoft/typescript',
    )
    expect(repositoryLink).toHaveAttribute('target', '_blank')
  })
})
