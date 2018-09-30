(() => {
    const mapContainer = $('div.map')
    const [img] = $('div.map img')
    let oldZoom = state.getZoom()
    
    // wasd scroll controls
    const scrollAmount = 30
    $(document.body).keydown(event => {
        if(state.getSelectedSeedId() !== null){
            return
        }
        
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
    
    const controller = {
        setZoom(width, height, zoom){
            const mapFocus = {
                x: (mapContainer.scrollLeft() + mapContainer.width()/2),
                y: (mapContainer.scrollTop() + mapContainer.height()/2),
            }
            
            const newFocus = {
                x: (mapFocus.x/oldZoom)*zoom,
                y: (mapFocus.y/oldZoom)*zoom,
            }
            
            img.width = width*zoom
            img.height = height*zoom
            
            mapContainer.scrollLeft(newFocus.x - mapContainer.width()/2)
            mapContainer.scrollTop(newFocus.y - mapContainer.height()/2)
            oldZoom = zoom
        },
        
        onRegionChange(state){
            const {filepath, width, height} = state.getSelectedRegion()
            const zoom = state.getZoom()
            
            img.src = filepath
            controller.setZoom(width, height, zoom)
        },
        onZoom(state){
            const {width, height} = state.getSelectedRegion()
            const zoom = state.getZoom()
            
            controller.setZoom(width, height, zoom)
        },
    }
    controller.onRegionChange(state)
    
    // event handlers
    state.on('regionChanged', controller.onRegionChange)
    state.on('zoomChanged', controller.onZoom)
})()
