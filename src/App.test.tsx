import { fireEvent, render, screen, waitFor } from '@testing-library/react'
import { afterEach, describe, expect, it, vi } from 'vitest'
import * as programmingLanguagesApi from './api/programming-languages'
import type { ProgrammingLanguage } from './api/programming-languages'
import App from './App'

const languages: ProgrammingLanguage[] = [
  { name: 'JavaScript', value: 'javascript' },
  { name: 'TypeScript', value: 'typescript' },
  { name: 'Python', value: 'python' },
]

afterEach(() => {
  vi.restoreAllMocks()
})

describe('App', () => {
  it('renders the application heading', () => {
    vi.spyOn(
      programmingLanguagesApi,
      'fetchProgrammingLanguages',
    ).mockResolvedValue(languages)

    render(<App />)

    expect(
      screen.getByRole('heading', {
        name: 'Discover your next project',
      }),
    ).toBeInTheDocument()
  })

  it('loads and displays programming languages', async () => {
    vi.spyOn(
      programmingLanguagesApi,
      'fetchProgrammingLanguages',
    ).mockResolvedValue(languages)

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
    vi.spyOn(
      programmingLanguagesApi,
      'fetchProgrammingLanguages',
    ).mockResolvedValue(languages)

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
})