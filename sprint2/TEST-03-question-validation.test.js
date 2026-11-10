
"use strict";

const test = require("node:test");
const assert = require("node:assert/strict");

const { addQuestion } = require("./FR-10-add-question");

test("TEST-03: Add a valid question", () => {
    const questions = [];

    const question = addQuestion(questions, {
        id: 1,
        text: "What is the capital of India?",
        options: [
            { value: "A", label: "Mumbai" },
            { value: "B", label: "New Delhi" }
        ],
        correctAnswer: "B"
    });

    assert.equal(questions.length, 1);
    assert.equal(question.id, 1);
    assert.equal(question.correctAnswer, "B");
});

test("TEST-03: Reject missing question text", () => {
    assert.throws(() => addQuestion([], {
        id: 1,
        text: "",
        options: [
            { value: "A", label: "Option A" },
            { value: "B", label: "Option B" }
        ],
        correctAnswer: "A"
    }), /Question text is required/);
});

test("TEST-03: Reject missing question ID", () => {
    assert.throws(() => addQuestion([], {
        text: "Sample question",
        options: [
            { value: "A", label: "Option A" },
            { value: "B", label: "Option B" }
        ],
        correctAnswer: "A"
    }), /Question ID is required/);
});

test("TEST-03: Reject fewer than two options", () => {
    assert.throws(() => addQuestion([], {
        id: 1,
        text: "Sample question",
        options: [
            { value: "A", label: "Option A" }
        ],
        correctAnswer: "A"
    }), /At least two options are required/);
});

test("TEST-03: Reject empty option labels", () => {
    assert.throws(() => addQuestion([], {
        id: 1,
        text: "Sample question",
        options: [
            { value: "A", label: "" },
            { value: "B", label: "Option B" }
        ],
        correctAnswer: "A"
    }), /Every option must have a value and label/);
});

test("TEST-03: Reject duplicate option values", () => {
    assert.throws(() => addQuestion([], {
        id: 1,
        text: "Sample question",
        options: [
            { value: "A", label: "Option A" },
            { value: "A", label: "Option B" }
        ],
        correctAnswer: "A"
    }), /Option values must be unique/);
});

test("TEST-03: Reject invalid correct answer", () => {
    assert.throws(() => addQuestion([], {
        id: 1,
        text: "Sample question",
        options: [
            { value: "A", label: "Option A" },
            { value: "B", label: "Option B" }
        ],
        correctAnswer: "C"
    }), /Correct answer must match an option value/);
});

test("TEST-03: Reject duplicate question IDs", () => {
    const questions = [{
        id: 1,
        text: "Existing question",
        options: [
            { value: "A", label: "Option A" },
            { value: "B", label: "Option B" }
        ],
        correctAnswer: "A"
    }];

    assert.throws(() => addQuestion(questions, {
        id: 1,
        text: "Another question",
        options: [
            { value: "A", label: "Option A" },
            { value: "B", label: "Option B" }
        ],
        correctAnswer: "B"
    }), /Question ID must be unique/);
});
