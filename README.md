# GitHub Random Repository

A web application that helps developers discover random GitHub repositories by programming language.

This project is based on the [GitHub Random Repository](https://roadmap.sh/projects/github-random-repo) challenge from roadmap.sh.

## Features

- Select a programming language.
- Discover a random GitHub repository for the selected language.
- Refresh the result to find another repository.
- View repository descriptions, programming languages, stars, forks, and open issues.
- Open the repository on GitHub.
- Handle loading states and request errors with retry options.
- Responsive layout for mobile and desktop screens.

## Tech Stack

- React
- TypeScript
- Vite
- GitHub REST API
- Vitest
- React Testing Library
- ESLint

## Getting Started

### Prerequisites

- Node.js
- npm

### Installation

Clone the repository and install dependencies:

```bash
git clone https://github.com/mykytapilec/gitHub-random-repository.git
cd gitHub-random-repository
npm install
```

### Development

Start the development server:

```bash
npm run dev
```

Open the local URL printed in the terminal.

## Available Scripts

| Command | Description |
| --- | --- |
| `npm run dev` | Start the development server |
| `npm test` | Run the test suite once |
| `npm run test:watch` | Run tests in watch mode |
| `npm run lint` | Run ESLint |
| `npm run build` | Type-check and build the production application |
| `npm run preview` | Preview the production build locally |

## Project Structure

```text
src/
├── api/
│   ├── github-repositories.ts
│   ├── github-repositories.test.ts
│   ├── programming-languages.ts
│   └── programming-languages.test.ts
├── App.tsx
├── App.css
├── index.css
└── main.tsx
```

## Testing

Run the test suite:

```bash
npm test
```

Run linting and the production build:

```bash
npm run lint
npm run build
```

## License

This project was created for learning purposes as part of the roadmap.sh project challenges.