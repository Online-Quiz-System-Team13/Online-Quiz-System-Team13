# Online Quiz System — Team 13

A browser-based quiz demonstration built with HTML and JavaScript. The current Sprint 1 flow lets a participant start a quiz, answer and navigate questions, submit answers, view a score, and exit or try again.

## Run the quiz

No installation, server, or build step is needed to use the demo:

1. Download or clone this repository, keeping its folders together.
2. Open the repository folder in File Explorer.
3. Double-click `index.html` to open it in a web browser.
4. Select **Start quiz**, answer the questions, and submit to view the result.

`index.html` loads the JavaScript modules using relative paths. Keep the `js` and `sprint1` folders in their current locations beside `index.html`; moving or opening the HTML by itself will prevent those modules from loading.

## Project structure

```text
Online-Quiz-System-Team13/
├── index.html                    # Browser UI and integration for the Sprint 1 quiz
├── js/
│   ├── quiz.js                   # Submission, score calculation, and result display
│   └── quiz.test.js              # Tests for submission, scoring, and result display
├── sprint1/
│   ├── FR-01-start-quiz.js        # Initializes a quiz session
│   ├── FR-02-display-questions.js # Renders the current question and options
│   ├── FR-03-select-answer.js     # Stores a participant's answer
│   ├── FR-04-navigate-questions.js # Navigation state and question controls
│   ├── FR-08-exit-quiz.js         # Exit confirmation control
│   ├── FR-01-FR-02.test.js        # Start-quiz and question-display tests
│   └── FR-03-FR-04.test.js        # Answer-selection and navigation tests
├── .github/workflows/             # GitHub Actions workflow definitions
├── ONLINE QUIZ SYSTEM-TEAM13(Phase 1) (1).pdf
│                                 # Phase 1 requirements document
└── Sprint1_demo_video.mp4         # Sprint 1 demonstration recording
```

The page does not combine the module source files into one file. It loads and connects them in the browser; `index.html` contains the quiz questions and user interface.

## Run tests

The browser demo can be opened without Node.js. Node.js is needed only to run the automated tests. From a terminal opened in the repository folder, run:

```powershell
node js/quiz.test.js
node --test sprint1/FR-01-FR-02.test.js sprint1/FR-03-FR-04.test.js
```

## Sprint plan

- **Sprint 1 (19–23 October 2026):** Build and test the participant quiz flow.
- **Sprint 2 (26–30 October 2026):** Planned administrator functionality and further validation.

The repository currently contains the Sprint 1 participant quiz demo and tests. Administrator login and question-management features are not included in the current runnable demo.

## Requirements and project workflow

The Phase 1 PDF documents functional requirements FR-01 to FR-13 and validation and verification requirements VFR-01 to VFR-12. GitHub Issues, Pull Requests, project boards, and the workflow files under `.github/workflows/` support project tracking and automated checks.

## Team

- **Team:** 13
- **Project:** Online Quiz System
- **Course:** Software Engineering
