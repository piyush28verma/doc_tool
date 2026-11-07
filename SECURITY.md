# Security Policy

## Supported Versions

| Version | Supported          |
| ------- | ------------------ |
| 1.0.x   | :white_check_mark: |

## Reporting a Vulnerability

We take the security of DocMerge seriously. If you discover a security vulnerability, please report it responsibly.

### How to Report

**Please do NOT open a public GitHub issue for security vulnerabilities.**

Instead, report vulnerabilities by emailing the maintainer or by using [GitHub's private vulnerability reporting](https://github.com/piyush28verma/doc_tool/security/advisories/new).

### What to Include

- A description of the vulnerability
- Steps to reproduce the issue
- The potential impact
- Any suggested fixes (if you have them)

### What to Expect

- **Acknowledgment**: We will acknowledge receipt of your report within 48 hours.
- **Assessment**: We will investigate and assess the vulnerability's severity and impact.
- **Fix**: We will work on a fix and coordinate a release timeline with you.
- **Disclosure**: We will publicly disclose the vulnerability after a fix has been released, crediting you (unless you prefer to remain anonymous).

### Scope

The following are in scope for security reports:

- The DocMerge web application (frontend and backend)
- File upload and processing vulnerabilities
- Path traversal or file access issues
- Cross-site scripting (XSS) or injection attacks
- Authentication/authorization bypasses (if auth is added in the future)
- Denial of service via file processing

### Out of Scope

- Vulnerabilities in third-party dependencies (please report those to the respective projects)
- Issues in the demo deployment that don't reflect the codebase
- Social engineering attacks

## Security Best Practices for Self-Hosting

If you are self-hosting DocMerge, we recommend:

- Run the application behind a reverse proxy (e.g., Nginx) with HTTPS
- Set appropriate file size limits
- Restrict access to the uploads directory
- Keep Node.js and all dependencies up to date
- Use environment variables for any sensitive configuration
- Run the application as a non-root user

## Dependencies

We strive to keep dependencies up to date. If you notice a known vulnerability in one of our dependencies, please open a regular issue or submit a PR updating the dependency.
