const assert = require("node:assert/strict");
const test = require("node:test");
const { selectAnswer } = require("./FR-03-select-answer");
const { getNavigationState } = require("./FR-04-navigate-questions");

const questions = [
    { id: 1, text: "First question", options: ["A", "B"] },
    { id: 2, text: "Second question", options: ["C", "D"] }
];

test("FR-03 stores each selected answer by question id", function () {
    const answers = {};
    selectAnswer(answers, 1, "A");
    selectAnswer(answers, 2, "D");
    assert.deepEqual(answers, { 1: "A", 2: "D" });
});

test("FR-04 reports current question and answered status", function () {
    const state = getNavigationState(questions, { 1: "A" }, 1);
    assert.equal(state.canGoPrevious, true);
    assert.equal(state.canGoNext, false);
    assert.deepEqual(state.questions.map(function (question) {
        return [question.isCurrent, question.isAnswered];
    }), [[false, true], [true, false]]);
});

test("FR-04 enforces question navigation boundaries", function () {
    const first = getNavigationState(questions, {}, 0);
    assert.equal(first.canGoPrevious, false);
    assert.equal(first.canGoNext, true);
    assert.throws(function () {
        getNavigationState(questions, {}, questions.length);
    }, RangeError);
});
