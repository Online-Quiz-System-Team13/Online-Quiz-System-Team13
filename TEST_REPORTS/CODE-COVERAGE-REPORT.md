# Code Coverage Report

## Summary

| Metric | Coverage |
|---|---:|
| Line coverage | **86.02%** |
| Branch coverage | **80.54%** |
| Function coverage | **95.12%** |
| Test result | **69 passed, 0 failed** |
| Coverage engine | Node.js built-in V8 test coverage |
| Runtime | Node.js v24.9.0 |
| Execution date | 11 November 2026 |

Coverage was collected with `node --test --experimental-test-coverage` over the Sprint 1 and Sprint 2 JavaScript test suite. File-level line, branch, and function percentages are listed in [BRANCH-COVERAGE-REPORT.md](./BRANCH-COVERAGE-REPORT.md) and below.

| Source file | Lines | Branches | Functions |
|---|---:|---:|---:|
| `js/question-bank.js` | 89.90% | 65.71% | 100.00% |
| `js/quiz.js` | 100.00% | 100.00% | 100.00% |
| `sprint1/FR-01-start-quiz.js` | 100.00% | 87.50% | 100.00% |
| `sprint1/FR-02-display-questions.js` | 90.91% | 73.91% | 100.00% |
| `sprint1/FR-03-select-answer.js` | 34.62% | 66.67% | 75.00% |
| `sprint1/FR-04-navigate-questions.js` | 47.92% | 76.92% | 83.33% |
| `sprint1/FR-08-exit-quiz.js` | 93.48% | 88.89% | 80.00% |
| `sprint2/admin-messages.js` | 100.00% | 75.00% | 100.00% |
| `sprint2/FR-09-admin-login.js` | 94.31% | 84.38% | 90.91% |
| `sprint2/FR-10-add-question.js` | 95.12% | 88.46% | 100.00% |
| `sprint2/FR-11-edit-question.js` | 100.00% | 91.11% | 100.00% |
| `sprint2/FR-12-delete-question.js` | 100.00% | 50.00% | 100.00% |
| `sprint2/FR-13-view-questions.js` | 91.43% | 71.43% | 100.00% |
| **All instrumented files** | **86.02%** | **80.54%** | **95.12%** |

## Interpretation and limitations

- The measured files are JavaScript modules exercised by the Node tests. Inline JavaScript embedded in `index.html` and `sprint2/admin.html` is not instrumented by this command.
- HTML markup, CSS, browser rendering, and manual usability observations are not represented in these percentages.
- Coverage indicates executed code paths, not correctness or requirement completeness by itself. See the system validation report for functional mapping.
- The lowest line coverage is in the DOM rendering/navigation helpers `FR-03-select-answer.js` and `FR-04-navigate-questions.js`; their browser DOM branches are not fully represented by the current Node unit tests.
