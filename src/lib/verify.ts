
import { CITIES, getAreaTerm } from './engine';

try {
    console.log(`Checking Cities count: ${CITIES.length}`);
    if (CITIES.length !== 10) throw new Error(`Expected 10 cities, got ${CITIES.length}`);

    const check = (id: string, role: string | undefined, expected: string) => {
        const term = getAreaTerm(id, role);
        if (term !== expected) throw new Error(`Expected ${expected} for ${id}/${role}, got ${term}`);
    }

    check('nyc', undefined, 'Borough');
    check('sea', undefined, 'Hood');
    check('sea', 'Police', 'Precinct');
    check('sea', 'Citizen', 'Hood');
    check('hou', undefined, 'Ward');
    check('dfw', undefined, 'District');

    console.log('VERIFICATION SUCCESSFUL');
} catch (e) {
    console.error(e);
    process.exit(1);
}
