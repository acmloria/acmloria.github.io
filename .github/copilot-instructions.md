# Copilot Instructions for acmloria.github.io

## Overview
This repository contains:
- A personal portfolio static website (`acmloria.github.io/`)
- Data-driven web apps and research projects (`bilingual_2030_project/`, `cs224N/`, `trial_new/`)

## Key Components
### Portfolio Website (`acmloria.github.io/`)
- **HTML/CSS/JS only**; no build step required.
- Main entry: `index.html` (uses Bootstrap, Font Awesome, Google Fonts).
- Project cards are rendered dynamically from `projects.json` via `js/render-projects.js`.
- Images are stored in `images/`.
- Each major section (About, Blog, Timeline) has its own HTML and CSS file.
- No framework (React/Vue) or backend; all logic is client-side.

#### Dynamic Project Grid
- `js/render-projects.js` fetches and renders `projects.json` into the `#project-grid` div.
- Each project entry supports `title`, `image`, `bullets` (with optional `href`), `tags`, and optional `description`.
- Example: To add a new project, update `projects.json` and ensure referenced images exist in `images/`.

#### Conventions
- Use Bootstrap grid and card classes for layout.
- Use `pic-ac` class for images in cards.
- All external links in project cards open in a new tab (`target="_blank"`).
- Prefer semantic HTML and keep inline styles minimal.

### Data Collection App (`bilingual_2030_project/`)
- Python Streamlit app for collecting learner data and teacher feedback.
- Main files: `streamlit_app.py`, `prompt_utils.py`, `data/data.json`.
- To run: `streamlit run streamlit_app.py` (requires Python, see `requirements.txt`).
- Data format: Each entry in `data.json` includes `id`, `timestamp`, `learner_input`, `task`, `ai_response`, and optional `teacher_feedback`.
- Prompts and OpenAI API calls are managed in `prompt_utils.py`.

### NLP Coursework (`cs224N/`)
- Contains Jupyter notebooks and environment files for Stanford CS224N assignments.
- Use `conda env create -f env.yml` to set up the environment.
- Notebooks are in `exploring_word_vectors/student/`.

## Developer Workflows
- **No build step** for the portfolio; edit HTML/CSS/JS directly and refresh in browser.
- For Streamlit app, use Python virtual environments and run locally.
- For Jupyter notebooks, use Conda and IPython kernels as described in `cs224N/README.md`.
- GitHub Actions workflow (`.github/workflows/github-actions-demo.yml`) is for demo purposes only; no CI/CD pipeline is set up.

## External Integrations
- Portfolio references external demo sites (e.g., Appier AIQUA) and Google Colab notebooks.
- No server-side code or database integration in the portfolio.
- Streamlit app uses OpenAI API (key required via environment variable).

## Patterns & Tips
- Keep project data in `projects.json` and use JS to render dynamically.
- For new sections, copy the structure of existing HTML/CSS files.
- For Python apps, keep data in JSON and use utility modules for API calls.
- Use semantic, accessible markup and descriptive alt text for images.

## Example: Adding a Project Card
1. Add a new entry to `projects.json` with required fields.
2. Place the image in `images/`.
3. No code changes needed in `render-projects.js` unless new fields are introduced.

---
For questions or unclear conventions, check the relevant README or source file for examples. If a pattern is not documented, follow the structure of similar files.
