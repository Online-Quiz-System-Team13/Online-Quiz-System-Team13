(function (root, factory) {
    const api = factory();

    if (typeof module !== "undefined" && module.exports) {
        module.exports = api;
    }
    if (root) {
        root.QuizQuestionBank = api;
    }
}(typeof globalThis !== "undefined" ? globalThis : this, function () {
    "use strict";

    const STORAGE_KEY = "online-quiz-system.questions";

    const DEFAULT_QUESTIONS = [
        {
            id: 1,
            text: "Which planet is known as the Red Planet?",
            options: [
                { value: "A", label: "Venus" },
                { value: "B", label: "Mars" },
                { value: "C", label: "Jupiter" },
                { value: "D", label: "Mercury" }
            ],
            correctAnswer: "B"
        },
        {
            id: 2,
            text: "What is the capital city of Japan?",
            options: [
                { value: "A", label: "Kyoto" },
                { value: "B", label: "Osaka" },
                { value: "C", label: "Tokyo" },
                { value: "D", label: "Sapporo" }
            ],
            correctAnswer: "C"
        },
        {
            id: 3,
            text: "Which language is primarily used to style web pages?",
            options: [
                { value: "A", label: "CSS" },
                { value: "B", label: "SQL" },
                { value: "C", label: "Python" },
                { value: "D", label: "Java" }
            ],
            correctAnswer: "A"
        },
        {
            id: 4,
            text: "How many sides does a hexagon have?",
            options: [
                { value: "A", label: "Five" },
                { value: "B", label: "Six" },
                { value: "C", label: "Seven" },
                { value: "D", label: "Eight" }
            ],
            correctAnswer: "B"
        },
        {
            id: 5,
            text: "Which ocean is the largest?",
            options: [
                { value: "A", label: "Atlantic Ocean" },
                { value: "B", label: "Indian Ocean" },
                { value: "C", label: "Arctic Ocean" },
                { value: "D", label: "Pacific Ocean" }
            ],
            correctAnswer: "D"
        }
    ];

    function validateQuestions(questions) {
        if (!Array.isArray(questions)) {
            throw new TypeError("The saved question bank must be a list.");
        }

        const ids = new Set();
        questions.forEach(function (question) {
            if (!question || question.id === undefined || question.id === null ||
                typeof question.text !== "string" || question.text.trim() === "" ||
                !Array.isArray(question.options) || question.options.length < 2) {
                throw new TypeError("The question bank contains an invalid question.");
            }
            if (ids.has(String(question.id))) {
                throw new TypeError("Question IDs in the question bank must be unique.");
            }
            ids.add(String(question.id));

            const values = new Set();
            question.options.forEach(function (option) {
                if (!option || typeof option.value !== "string" || option.value.trim() === "" ||
                    typeof option.label !== "string" || option.label.trim() === "" ||
                    values.has(option.value)) {
                    throw new TypeError("Question options must have unique values and non-empty labels.");
                }
                values.add(option.value);
            });
            if (!values.has(question.correctAnswer)) {
                throw new TypeError("Each correct answer must match one of its option values.");
            }
        });

        return questions;
    }

    function copyQuestions(questions) {
        return questions.map(function (question) {
            return {
                id: question.id,
                text: question.text,
                options: question.options.map(function (option) {
                    return { value: option.value, label: option.label };
                }),
                correctAnswer: question.correctAnswer
            };
        });
    }

    function toAdminQuestions(questions) {
        validateQuestions(questions);
        return questions.map(function (question) {
            const correctOption = question.options.find(function (option) {
                return option.value === question.correctAnswer;
            });
            return {
                id: question.id,
                text: question.text,
                options: question.options.map(function (option) { return option.label; }),
                correctAnswer: correctOption.label
            };
        });
    }

    function fromAdminQuestions(adminQuestions, previousQuestions) {
        if (!Array.isArray(adminQuestions) || !Array.isArray(previousQuestions)) {
            throw new TypeError("Question lists are required to update the shared question bank.");
        }

        return adminQuestions.map(function (question) {
            if (!question || !Array.isArray(question.options)) {
                throw new TypeError("The administrator question list contains an invalid question.");
            }
            const previous = previousQuestions.find(function (item) {
                return String(item.id) === String(question.id);
            });
            const usedValues = new Set();
            let generatedValue = 1;
            const options = question.options.map(function (label, index) {
                let value = previous && previous.options[index]
                    ? previous.options[index].value
                    : "";
                while (!value || usedValues.has(value)) {
                    value = "OPTION_" + generatedValue;
                    generatedValue++;
                }
                usedValues.add(value);
                return { value: value, label: label };
            });
            const correctIndex = question.options.indexOf(question.correctAnswer);
            if (correctIndex === -1) {
                throw new TypeError("The correct answer must match one of the question options.");
            }
            return {
                id: question.id,
                text: question.text,
                options: options,
                correctAnswer: options[correctIndex].value
            };
        });
    }

    function load(storage) {
        if (!storage || typeof storage.getItem !== "function" ||
            typeof storage.setItem !== "function") {
            throw new TypeError("Browser storage is required to load the question bank.");
        }

        const saved = storage.getItem(STORAGE_KEY);
        if (saved === null) {
            save(storage, DEFAULT_QUESTIONS);
            return copyQuestions(DEFAULT_QUESTIONS);
        }

        const questions = JSON.parse(saved);
        validateQuestions(questions);
        return copyQuestions(questions);
    }

    function save(storage, questions) {
        if (!storage || typeof storage.setItem !== "function") {
            throw new TypeError("Browser storage is required to save the question bank.");
        }
        validateQuestions(questions);
        const saved = copyQuestions(questions);
        storage.setItem(STORAGE_KEY, JSON.stringify(saved));
        return saved;
    }

    return {
        STORAGE_KEY: STORAGE_KEY,
        DEFAULT_QUESTIONS: copyQuestions(DEFAULT_QUESTIONS),
        load: load,
        save: save,
        toAdminQuestions: toAdminQuestions,
        fromAdminQuestions: fromAdminQuestions
    };
}));
