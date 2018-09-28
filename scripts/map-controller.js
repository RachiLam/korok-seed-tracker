// requires state

const mapController = (() => {
    const mapContainer = $('div.map')
    const [img] = $('div.map img')
    
    const scrollAmount = 30
    $(document.body).keydown(event => {
        const top = mapContainer.scrollTop()
        const left = mapContainer.scrollLeft()
        
        switch(event.key.toLowerCase()){
            case 'a':
                mapContainer.scrollLeft(left - scrollAmount)
                break
            case 'd':
                mapContainer.scrollLeft(left + scrollAmount)
                break
            case 'w':
                mapContainer.scrollTop(top - scrollAmount)
                break
            case 's':
                mapContainer.scrollTop(top + scrollAmount)
                break
        }
    })
    
    return {
        setRegion({filepath, width, height}, zoom){
            img.src = filepath
            img.width = width*zoom
            img.height = height*zoom
        }
    }
})()
