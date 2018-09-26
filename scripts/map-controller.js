// requires state

const mapController = (() => {
    const [img] = $('div.map img')
    
    return {
        setRegion({filepath, width, height}, zoom){
            img.src = filepath
            img.width = width*zoom
            img.height = height*zoom
        }
    }
})()
