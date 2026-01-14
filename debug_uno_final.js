
import { createGenerator } from '@unocss/core'
import { presetUno } from '@unocss/preset-uno'

async function debug() {
    const uno = createGenerator({
        presets: [presetUno()]
    })
    console.log('UNO:', uno)
    console.log('GENERATE:', uno.generate)
    const result = await uno.generate('text-red-500')
    console.log('RESULT CSS:', result.css)
}

debug()
