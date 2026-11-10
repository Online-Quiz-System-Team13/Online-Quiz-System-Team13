
"use strict";

const test = require("node:test");
const assert = require("node:assert/strict");
const { performance } = require("node:perf_hooks");

function loadQuestions(questions) {
    const startTime = performance.now();

    const loadedQuestions = questions.map(question => ({
        ...question,
        options: [...question.options]
    }));

    const executionTime = performance.now() - startTime;

    return {
        questions: loadedQuestions,
        executionTime
    };
}

function createQuestions(count) {
    return Array.from({ length: count }, (_, index) => ({
        id: index + 1,
        text: `Question ${index + 1}`,
        options: [
            { value: "A", label: "Option A" },
            { value: "B", label: "Option B" },
            { value: "C", label: "Option C" },
            { value: "D", label: "Option D" }
        ],
        correctAnswer: "A"
    }));
}

test("TEST-07: Measure question loading performance", () => {
    const sizes = [100, 1000, 5000];
    const iterations = 20;

    for (const size of sizes) {
        const questions = createQuestions(size);

        // Warm-up run
        loadQuestions(questions);

        let totalTime = 0;

        for (let i = 0; i < iterations; i++) {
            const result = loadQuestions(questions);

            assert.equal(result.questions.length, size);
            assert.ok(Number.isFinite(result.executionTime));

            totalTime += result.executionTime;
        }

        const averageTime = totalTime / iterations;

        console.log(
            `${size} questions: Average loading time = ${averageTime.toFixed(3)} ms`
        );
    }
});

module.exports = { loadQuestions, createQuestions };
