
import { CITIES, CITY_DISTANCES } from './src/lib/engine';

const missing: string[] = [];
const cityIds = CITIES.map(c => c.id);

cityIds.forEach(origin => {
    if (!CITY_DISTANCES[origin]) {
        missing.push(`Missing entry for origin: ${origin}`);
        return;
    }
    cityIds.forEach(target => {
        if (origin === target) return;
        if (CITY_DISTANCES[origin][target] === undefined) {
            missing.push(`Missing distance from ${origin} to ${target}`);
        }
    });
});

if (missing.length === 0) {
    console.log("All distances are defined!");
} else {
    console.log("Missing distances found:");
    missing.forEach(m => console.log(m));
}
