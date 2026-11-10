# TEST-06: Usability Test

This is a manual usability test for the participant quiz and administrator tools. It checks whether a first-time user can navigate the quiz and whether an administrator can manage questions shared with the quiz.

For automated checks of page controls, navigation boundaries, and shared add/edit/delete behavior, run `node --test sprint2/TEST-06-usability.test.js` from the repository folder. Automated checks cannot assess whether a first-time user finds the wording or layout intuitive; complete the manual tasks below for that feedback.

## Test setup

- Keep the `js`, `sprint1`, and `sprint2` folders beside `index.html`.
- From the repository folder, start a local server with `python -m http.server 8000` and open `http://localhost:8000`. Do not open the HTML files directly with `file://`.
- Use a browser with local storage enabled.
- Ask a participant who has not used the interface before to perform the participant tasks without coaching. The administrator tasks can be completed by the tester.
- Use a temporary question for administrator add/edit/delete tasks. Do not edit or delete the original questions during this test.

## Tasks and acceptance criteria

| # | Task | Pass criteria | Result / notes |
|---|------|---------------|----------------|
| 1 | Open the home page and find the quiz and administrator options. | Both actions are clearly labeled and lead to the intended pages. | |
| 2 | Start the quiz and select an answer for Question 1. | The selected answer is visibly selected. | |
| 3 | Move forward and backward, then revisit Question 1. | Previous/Next and numbered controls work; answered questions are distinguishable; the selected answer remains selected. | |
| 4 | Try Previous on the first question and Next on the last question. | Navigation does not move beyond either boundary. | |
| 5 | Exit the quiz and cancel the confirmation, then try again and confirm. | Cancel keeps the quiz and answers; confirm exits to the start screen. | |
| 6 | Open Administrator tools and log in. | The login form is understandable, errors are readable, and successful login opens the dashboard. | |
| 7 | Compare questions in the admin question bank with the participant quiz. | The same question text and answer choices are shown. | |
| 8 | Add a uniquely named temporary question with at least two choices and a correct answer. | Validation is understandable; after adding, the question appears in the admin list. | |
| 9 | Return to the quiz and start/restart it. | The temporary question is present in the participant quiz with its choices. | |
| 10 | Edit the temporary question in the admin page and revisit the quiz. | The updated text, choices, and correct answer are reflected in the quiz. | |
| 11 | Delete the temporary question and revisit the quiz. | After confirmation, it is removed from the admin list and the quiz. | |
| 12 | Log out of the admin page. | The dashboard is hidden and the login form is shown again. | |

## Record results

- Participant role (do not record sensitive personal information):
- Date:
- Browser/device:
- Tasks passed:
- Tasks failed:
- Where the participant hesitated or needed help:
- Usability issues observed:
- Follow-up changes:
