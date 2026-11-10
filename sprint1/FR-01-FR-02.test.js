
const assert = require("node:assert/strict");
const test = require("node:test");

const { startQuiz } = require("./FR-01-start-quiz");
const { displayQuestion } = require("./FR-02-display-questions");

const questions = [
    {
        id: 1,
        text: "What is the capital of India?",
        options: [
            { value: "A", label: "Mumbai" },
            { value: "B", label: "New Delhi" }
        ],
        correctAnswer: "B"
    },
    {
        id: 2,
        text: "Which language runs in a browser?",
        options: [
            { value: "A", label: "Python" },
            { value: "B", label: "JavaScript" }
        ],
        correctAnswer: "B"
    }
];

function createFakeDOM() {
    const doc = {
        createElement(tag) {
            return {
                tagName: tag,
                textContent: "",
                children: [],
                attributes: {},
                setAttribute(name, value) {
                    this.attributes[name] = value;
                },
                appendChild(child) {
                    this.children.push(child);
                },
                replaceChildren(...children) {
                    this.children = children;
                }
            };
        }
    };

    const container = doc.createElement("div");
    container.ownerDocument = doc;

    return container;
}

// FR-01 tests

test("FR-01 initializes a new quiz session", function () {
    const state = startQuiz(questions);

    assert.equal(state.isStarted, true);
    assert.equal(state.isSubmitted, false);
    assert.equal(state.currentIndex, 0);
    assert.deepEqual(state.selectedAnswers, {});
    assert.equal(state.questions.length, 2);
});

test("FR-01 rejects an empty question list", function () {
    assert.throws(() => startQuiz([]), TypeError);
});

test("FR-01 rejects invalid question input", function () {
    assert.throws(() => startQuiz(null), TypeError);
});

// FR-02 tests

test("FR-02 displays the first question in order", function () {
    const state = startQuiz(questions);
    const container = createFakeDOM();

    const modules = {
        answerSelection: {
            renderAnswerSelection: function (
                answerContainer, question, answers
            ) {
                assert.equal(question.id, 1);
                assert.equal(answers, state.selectedAnswers);
            }
        },
        navigation: {
            renderQuestionNavigation: function () {}
        }
    };

    const displayed = displayQuestion(container, state, modules);

    assert.equal(displayed.id, 1);
    assert.equal(
        container.children[1].textContent,
        "What is the capital of India?"
    );
});

test("FR-02 displays the next question and preserves answers", function () {
    const state = startQuiz(questions);
    const container = createFakeDOM();

    state.selectedAnswers[1] = "B";

    let navigate;

    const modules = {
        answerSelection: {
            renderAnswerSelection: function (
                answerContainer, question, answers
            ) {
                assert.equal(answers[1], "B");
            }
        },
        navigation: {
            renderQuestionNavigation: function (
                navContainer, list, answers, index, callback
            ) {
                navigate = callback;
            }
        }
    };

    displayQuestion(container, state, modules);

    navigate(1);

    assert.equal(state.currentIndex, 1);
    assert.equal(
        container.children[1].textContent,
        "Which language runs in a browser?"
    );
    assert.equal(state.selectedAnswers[1], "B");
});

test("FR-02 rejects an invalid question index", function () {
    const state = startQuiz(questions);
    const container = createFakeDOM();

    state.currentIndex = 5;

    assert.throws(function () {
        displayQuestion(container, state, {
            answerSelection: {},
            navigation: {}
        });
    }, RangeError);
});

test("FR-02 requires the quiz to be started", function () {
    const container = createFakeDOM();

    assert.throws(function () {
        displayQuestion(container, {
            isStarted: false,
            questions: questions,
            currentIndex: 0,
            selectedAnswers: {}
        }, {
            answerSelection: {},
            navigation: {}
        });
    }, Error);
});
