import { arraySumGenerator } from "./patterns/array-sum";
import { twoSumGenerator } from "./patterns/two-pointers";
import { maxConsecutiveGenerator } from "./patterns/max-consecutive";

export const GeneratorRegistry: Record<string, (difficulty: string) => any> = {
    "array_sum": arraySumGenerator,
    "two_sum": twoSumGenerator,
    "max_consecutive": maxConsecutiveGenerator
};

export function getGenerator(logicId: string) {
    return GeneratorRegistry[logicId];
}
