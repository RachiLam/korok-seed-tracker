(() => {
    const mapContainer = $('div.map')
    const [img] = $('div.map img')
    
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
            img.width = width*zoom
            img.height = height*zoom
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
