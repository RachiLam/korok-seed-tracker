const fs = require('fs')
const path = require('path')

const dir = './pictures'
const outfile = path.join('tmp', 'region-state.txt')
const files = fs.readdirSync(dir)

const state = files.reduce((state, filename) => {
    const regionId = filename.replace(/.png/g, '')
    const displayName = regionId.replace(/_/g, ' ')
    
    const filepath = path.join(dir, filename)
    const buffer = fs.readFileSync(filepath).slice(8)   // skip png header
    
    const width = buffer.readInt32BE(8)
    const height = buffer.readInt32BE(12)
    
    state[regionId] = {
        name: displayName,
        filepath: filepath.replace(/\\/g, '/'),
        width,
        height,
    }
    
    return state
}, {})

const output = Object.entries(state).reduce((output, [key, {name, filepath, width, height}]) => {
    output += `
        ${key}: {
            name: '${name}',
            filepath: '${filepath}',
            width: ${width},
            height: ${height},
        },`
    
    return output
}, '')

fs.writeFileSync(outfile, output)
