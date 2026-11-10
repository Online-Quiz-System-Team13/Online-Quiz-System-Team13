
"use strict";

// FR-10: Add Question

function addQuestion(questions, questionData) {
    if (!Array.isArray(questions)) {
        throw new TypeError("Questions must be an array.");
    }

    if (!questionData || typeof questionData !== "object") {
        throw new TypeError("Question data is required.");
    }

    const { id, text, options, correctAnswer } = questionData;

    if (id === undefined || id === null || id === "") {
        throw new Error("Question ID is required.");
    }

    if (questions.some(question => question.id === id)) {
        throw new Error("Question ID must be unique.");
    }

    if (typeof text !== "string" || text.trim() === "") {
        throw new Error("Question text is required.");
    }

    if (!Array.isArray(options) || options.length < 2) {
        throw new Error("At least two options are required.");
    }

    const values = new Set();

    for (const option of options) {
        if (
            !option ||
            typeof option.value !== "string" ||
            option.value.trim() === "" ||
            typeof option.label !== "string" ||
            option.label.trim() === ""
        ) {
            throw new Error("Every option must have a value and label.");
        }

        if (values.has(option.value)) {
            throw new Error("Option values must be unique.");
        }

        values.add(option.value);
    }

    if (!values.has(correctAnswer)) {
        throw new Error("Correct answer must match an option value.");
    }

    const newQuestion = {
        id,
        text: text.trim(),
        options: options.map(option => ({
            value: option.value,
            label: option.label.trim()
        })),
        correctAnswer
    };

    questions.push(newQuestion);

    return newQuestion;
}

if (typeof module !== "undefined" && module.exports) {
    module.exports = { addQuestion };
}
