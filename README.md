# Online Quiz System — Team 13

A browser-based quiz demonstration built with HTML and JavaScript. The Sprint 1 flow lets a participant start a quiz, answer and navigate questions, submit answers, view a score, and exit or try again. Administrator tools are available from the link on the home screen.

## Run the quiz

The quiz and admin page share a question bank saved in browser storage. Serve the repository from one local web origin so both pages can read the same saved changes:

1. Download or clone this repository, keeping its folders together.
2. Open a terminal in the repository folder and run `python -m http.server 8000`.
3. Open `http://localhost:8000` in a browser.
4. Select **Start quiz** to take the quiz, or **Administrator tools** to edit the same questions in the admin page.

Changes made by the administrator are saved in that browser's local storage and appear in the participant quiz the next time it starts. Keep the `js`, `sprint1`, and `sprint2` folders in their current locations beside `index.html`; moving a page by itself will prevent its modules from loading. Opening the HTML files directly with `file://` is not recommended because browsers may isolate storage for local files. Test files and documentation in those folders are for development and are not browser scripts.

## Project structure

```text
Online-Quiz-System-Team13/
├── index.html                    # Browser UI and integration for the Sprint 1 quiz
├── js/
│   ├── question-bank.js           # Shared questions and browser-storage persistence
│   ├── question-bank.test.js      # Shared question-bank tests
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
├── sprint2/
│   ├── admin.html                 # Administrator login and question management
│   ├── admin-messages.js          # Shared administrator messages and errors
│   ├── FR-09-admin-login.js       # Administrator authentication
│   ├── FR-10-add-question.js      # Question validation and creation
│   ├── FR-11-edit-question.js     # Question editing
│   ├── FR-12-delete-question.js   # Question deletion
│   ├── FR-13-view-questions.js    # Question-list rendering
│   ├── FR-13-view-questions.test.js
│   ├── TEST-02-admin-login-access.test.js
│   ├── TEST-03-question-validation.test.js
│   ├── TEST-05-errors-messages.test.js
│   ├── TEST-06-usability.md
│   └── TEST-07-performance.test.js
├── .github/workflows/             # GitHub Actions workflow definitions
├── ONLINE QUIZ SYSTEM-TEAM13(Phase 1) (1).pdf
│                                 # Phase 1 requirements document
└── Sprint1_demo_video.mp4         # Sprint 1 demonstration recording
```

The pages do not combine the module source files into one file. Both pages load `js/question-bank.js` and use the same questions saved in browser storage. The Sprint 1 page loads the participant modules, while the Sprint 2 page loads its administrator modules from `sprint2/`.

## Run tests

The browser demo can be opened without Node.js. Node.js is needed only to run the automated tests. From a terminal opened in the repository folder, run:

```powershell
node js/quiz.test.js
node --test js/question-bank.test.js sprint1/FR-01-FR-02.test.js sprint1/FR-03-FR-04.test.js sprint2/FR-13-view-questions.test.js sprint2/TEST-02-admin-login-access.test.js sprint2/TEST-03-question-validation.test.js sprint2/TEST-05-errors-messages.test.js sprint2/TEST-06-usability.test.js sprint2/TEST-07-performance.test.js
```

## Sprint plan

- **Sprint 1 (19–23 October 2026):** Build and test the participant quiz flow.
- **Sprint 2 (26–30 October 2026):** Administrator login and question-management modules, with validation tests.

The Sprint 2 administrator demo is available at `sprint2/admin.html`. The login is a client-side demonstration and is not suitable for production authentication.

## Requirements and project workflow

The Phase 1 PDF documents functional requirements FR-01 to FR-13 and validation and verification requirements VFR-01 to VFR-12. GitHub Issues, Pull Requests, project boards, and the workflow files under `.github/workflows/` support project tracking and automated checks.

## Team

- **Team:** 13
- **Project:** Online Quiz System
- **Course:** Software Engineering
