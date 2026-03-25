export type LevelAssessmentQuestion = {
    id: string
    prompt: string
    options: string[]
    correctIndex: number
}

export const levelAssessmentQuestions: LevelAssessmentQuestion[] = [
    {
        id: "q1",
        prompt: "The word \"enormous\" is closest in meaning to:",
        options: ["tiny", "very large", "broken", "noisy"],
        correctIndex: 1,
    },
    {
        id: "q2",
        prompt: "If something is \"fragile\", it is:",
        options: ["easy to break", "full of energy", "very heavy", "hard to find"],
        correctIndex: 0,
    },
    {
        id: "q3",
        prompt: "The word \"reluctant\" most nearly means:",
        options: ["unwilling", "delighted", "immediate", "polite"],
        correctIndex: 0,
    },
    {
        id: "q4",
        prompt: "\"Deteriorate\" means to:",
        options: ["improve quickly", "become worse", "hide carefully", "speak softly"],
        correctIndex: 1,
    },
    {
        id: "q5",
        prompt: "A \"meticulous\" person pays attention to:",
        options: ["danger", "details", "fashion", "speed"],
        correctIndex: 1,
    },
    {
        id: "q6",
        prompt: "\"Ambiguous\" means:",
        options: ["clear and direct", "open to more than one meaning", "very brief", "easy to prove"],
        correctIndex: 1,
    },
    {
        id: "q7",
        prompt: "If someone is \"skeptical\", they are:",
        options: ["easily convinced", "short of time", "doubtful", "extremely calm"],
        correctIndex: 2,
    },
    {
        id: "q8",
        prompt: "\"Mitigate\" most nearly means:",
        options: ["make less severe", "copy exactly", "avoid completely", "spread rapidly"],
        correctIndex: 0,
    },
    {
        id: "q9",
        prompt: "A \"pragmatic\" solution is one that is:",
        options: ["practical", "traditional", "secret", "temporary"],
        correctIndex: 0,
    },
    {
        id: "q10",
        prompt: "\"Convey\" most nearly means:",
        options: ["delay", "communicate", "purchase", "forbid"],
        correctIndex: 1,
    },
    {
        id: "q11",
        prompt: "If an argument is \"coherent\", it is:",
        options: ["confusing", "well organized", "emotionally weak", "too short"],
        correctIndex: 1,
    },
    {
        id: "q12",
        prompt: "\"Subtle\" most nearly means:",
        options: ["obvious", "delicate and not immediately obvious", "harsh", "useless"],
        correctIndex: 1,
    },
]

export function recommendLevel(score: number) {
    if (score >= 11) {
        return "21"
    }
    if (score >= 10) {
        return "13"
    }
    if (score >= 9) {
        return "14"
    }
    if (score >= 8) {
        return "12"
    }
    if (score >= 7) {
        return "10"
    }
    if (score >= 5) {
        return "8"
    }
    if (score >= 3) {
        return "6"
    }
    return "4"
}
