import { describe, it, expect } from "vitest";
import { createPlayer } from "./player";
import { createPersona } from "./persona";
import { CITIES, handleBuyCar, handleEstablishSafehouse, processInsurance, handleTravel } from "./engine";

describe("Player Core Logic & Car Ownership", () => {
    it("should initialize a player with correct default stats", () => {
        const player = createPlayer("test-id", "Test Player");
        expect(player.id).toBe("test-id");
        expect(player.name).toBe("Test Player");
        expect(player.hasCar).toBe(false);
        expect(player.safehouses).toEqual([]);
    });

    it("should give NIMBYs a car automatically with high quality", () => {
        const persona = createPersona("nimby-1", "NIMBY Joe", "NIMBY", "nyc", "Brooklyn");
        const player = persona.gameData.drugwars;
        expect(player.role).toBe("NIMBY");
        expect(player.hasCar).toBe(true);
        expect(player.carQuality).toBe(100);
        expect(player.safehouses.some((sh: any) => sh.location === "Brooklyn")).toBe(true);
    });

    it("should allow Entrepreneurs to buy a car with standard quality", () => {
        const persona = createPersona("ent-2", "Ent Bob", "Entrepreneur", "nyc");
        const player = persona.gameData.drugwars;
        player.cash = 100000;
        player.location = "Brooklyn";

        handleEstablishSafehouse(player, "Brooklyn");
        const carResult = handleBuyCar(player);
        expect(carResult.success).toBe(true);
        expect(player.hasCar).toBe(true);
        expect(player.carQuality).toBe(50);
    });

    it("should calculate insurance based on car quality", () => {
        const persona = createPersona("ent-3", "Ent Sam", "Entrepreneur", "nyc");
        const player = persona.gameData.drugwars;
        player.hasCar = true;
        player.carQuality = 50;
        player.cash = 1000;

        // Fast forward 31 days (30 days = 43200 game minutes)
        // 1 real second = 1 game minute. 43200 game minutes = 43200 real seconds.
        player.lastInsurancePayment = Date.now() - (43201 * 1000);

        const result = processInsurance(player);
        expect(result.charged).toBe(true);
        expect(result.cost).toBe(250); // 500 * (50/100)
    });

    it("should reduce travel risk for nicer cars", () => {
        const nimbyPersona = createPersona("nimby-t", "NIMBY T", "NIMBY", "nyc", "Brooklyn");
        const nimbyPlayer = nimbyPersona.gameData.drugwars;
        nimbyPlayer.cash = 100000;
        nimbyPlayer.cityId = "nyc";
        nimbyPlayer.location = "Brooklyn";

        const entPersona = createPersona("ent-t", "Ent T", "Entrepreneur", "nyc");
        const entPlayer = entPersona.gameData.drugwars;
        entPlayer.cash = 100000;
        entPlayer.hasCar = true;
        entPlayer.carQuality = 50;
        entPlayer.cityId = "nyc";
        entPlayer.location = "Brooklyn";

        const nimbyResult = handleTravel(nimbyPlayer, "CAR", true, undefined, "Manhattan");
        const entResult = handleTravel(entPlayer, "CAR", true, undefined, "Manhattan");

        // Base risk for CAR is 0.10 in TRAVEL_COSTS.intra_ways
        // NIMBY (100 quality): 0.10 * (1.5 - 1.0) = 0.05
        // Ent (50 quality): 0.10 * (1.5 - 0.5) = 0.10
        expect(nimbyResult.costData.risk).toBeCloseTo(0.05);
        expect(entResult.costData.risk).toBeCloseTo(0.10);
    });
});
