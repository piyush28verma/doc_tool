# Contributing to DocMerge

Thank you for considering contributing to DocMerge! Every contribution helps make this project better.

## Table of Contents

- [Code of Conduct](#code-of-conduct)
- [Getting Started](#getting-started)
- [Development Setup](#development-setup)
- [Making Changes](#making-changes)
- [Submitting a Pull Request](#submitting-a-pull-request)
- [Code Style Guidelines](#code-style-guidelines)
- [Reporting Issues](#reporting-issues)
- [Areas Where Help Is Wanted](#areas-where-help-is-wanted)

## Code of Conduct

This project follows the [Contributor Covenant Code of Conduct](CODE_OF_CONDUCT.md). By participating, you are expected to uphold this code. Please report unacceptable behavior to the project maintainers.

## Getting Started

1. **Fork** the repository on GitHub.
2. **Clone** your fork locally:
   ```bash
   git clone https://github.com/<your-username>/doc_tool.git
   cd doc_tool
   ```
3. **Create a branch** for your changes:
   ```bash
   git checkout -b feature/your-feature-name
   ```

## Development Setup

DocMerge has two parts: a Node.js/Express backend and a React (Vite) frontend. Both must be running during development.

### Prerequisites

- Node.js v18 or higher (see `.nvmrc`)
- npm v8 or higher

### Backend

```bash
cd backend
npm install
node server.js
# or use watch mode:
npm run dev
```

The backend runs on **http://localhost:5001**.

### Frontend

In a separate terminal:

```bash
cd frontend
npm install
npm run dev
```

The frontend runs on **http://localhost:3000** and proxies API requests to the backend via Vite's dev server.

### Verify It Works

Open http://localhost:3000 in your browser. You should be able to upload, preview, and merge documents.

## Making Changes

1. Keep changes focused — one feature or fix per PR.
2. Write clear, descriptive commit messages.
3. Test your changes manually (automated tests are on the roadmap).
4. Make sure the frontend builds without errors:
   ```bash
   cd frontend
   npm run build
   ```

## Submitting a Pull Request

1. Push your branch to your fork:
   ```bash
   git push origin feature/your-feature-name
   ```
2. Open a pull request against the `main` branch of the upstream repository.
3. Fill out the PR template completely.
4. Ensure the CI checks pass.
5. Be responsive to review feedback.

### PR Guidelines

- Reference any related issues (e.g., `Closes #12`).
- Include screenshots or screen recordings for UI changes.
- Keep PRs reasonably sized — large PRs are harder to review.

## Code Style Guidelines

### General

- Use 2-space indentation.
- Use single quotes for strings in JavaScript/JSX.
- End files with a newline.
- Remove unused imports and variables.

### Frontend (React)

- Use functional components with hooks.
- Use Tailwind CSS utility classes for styling — avoid custom CSS where possible.
- Keep components focused and reasonably sized.
- Use descriptive prop and variable names.

### Backend (Node.js/Express)

- Use `const` and `let` — never `var`.
- Handle errors gracefully and return appropriate HTTP status codes.
- Keep route handlers focused; extract shared logic into helper functions.

## Reporting Issues

Use the [GitHub issue tracker](https://github.com/piyush28verma/doc_tool/issues) to report bugs or request features. Please use the provided issue templates.

### Bug Reports Should Include

- Steps to reproduce the issue
- Expected behavior vs. actual behavior
- Browser and OS information
- Screenshots or error logs if applicable

### Before Submitting

- Search existing issues to avoid duplicates.
- Test with the latest version of `main`.

## Areas Where Help Is Wanted

We especially welcome contributions in these areas:

- **New format support** — Add support for additional file types (PPT/PPTX, XLS/XLSX, images, plain text)
- **Tests** — Unit and integration tests for both frontend and backend
- **Accessibility** — Improve keyboard navigation, screen reader support, ARIA labels
- **Internationalization (i18n)** — Add multi-language support to the UI
- **Documentation** — Improve API docs, add JSDoc comments, create user guides
- **Performance** — Optimize large file handling and merge operations
- **Docker** — Improve and test the Docker setup for self-hosting

Look for issues labeled [`good first issue`](https://github.com/piyush28verma/doc_tool/labels/good%20first%20issue) or [`help wanted`](https://github.com/piyush28verma/doc_tool/labels/help%20wanted) to get started.

---

Thank you for helping make DocMerge better! 🎉
