
import { createGenerator } from 'unocss'
import config from './uno.config'

const gen = createGenerator(config)
console.log('Generator type:', typeof gen)
console.log('Available methods:', Object.keys(gen))
if (gen.generate) {
    console.log('Generate is a function')
} else {
    console.log('Generate is NOT a function')
}
