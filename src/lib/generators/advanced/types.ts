
export type TaskType = "max" | "min" | "count" | "exists" | "index";
export type InputShape = "sorted" | "unsorted" | "positive" | "mixed";
export type ConstraintLevel = "small" | "medium" | "large";
export type AnswerType = "integer" | "boolean" | "array";

export interface Variant {
    task: TaskType;
    shape: InputShape;
    constraint: ConstraintLevel;
    answerType: AnswerType;
}

export interface GeneratedQuestion {
    title: string;
    description: string;
    difficulty: string;
    tags: string[];
    testCases: TestCaseData[];
    signature: string; // The unique fingerprint
}

export interface TestCaseData {
    input: string;
    output: string;
    isHidden: boolean;
}

export interface AtomicGenerator {
    id: string; // e.g., "sliding_window_fixed"
    generate(variant: Variant): GeneratedQuestion;
}
