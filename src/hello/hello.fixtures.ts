import { faker } from "@faker-js/faker";
import { HelloData } from "./hello";
            
export function createHelloData(partialData?: Partial<HelloData>): HelloData {
    if (partialData?.message) {
        return {
            message: partialData.message
        }
    }

    return {
        message: faker.string.alpha(10)
    }
}