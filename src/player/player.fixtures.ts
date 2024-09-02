import { faker } from "@faker-js/faker";
import { Player, Tour } from "./player";

export function createPlayerData(partialData?: Partial<Player>): Player
{
    return {
        firstName: partialData?.firstName ?? faker.person.firstName(),
        lastName: partialData?.lastName ?? faker.person.lastName(),
        tour: (partialData?.tour?.includes('ATP') || partialData?.tour?.includes('WTA'))? partialData?.tour : faker.helpers.arrayElement<Tour>(["ATP", "WTA"]) ,
        country: partialData?.country ?? faker.location.country(),
    } as Player;
}