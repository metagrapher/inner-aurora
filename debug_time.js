
const { getGameTimeOfDay, GLOBAL_EPOCH } = require('./src/lib/engine');
console.log('GLOBAL_EPOCH:', GLOBAL_EPOCH);
const epoch = GLOBAL_EPOCH;
console.log('getGameTimeOfDay(epoch):', getGameTimeOfDay(epoch));
console.log('getGameTimeOfDay(epoch + 1000):', getGameTimeOfDay(epoch + 1000));
console.log('getGameTimeOfDay(epoch + 60000):', getGameTimeOfDay(epoch + 60000));
