/*
    requires
        state
        mapController
        canvasController
*/

const regionController = (() => {
    const select = $('#region-select')
    
    Object.entries(state.regions).forEach(([key, {name}]) => {
        const option = document.createElement('option')
        option.text = name
        option.value = key
        select.append(option)
    })
    
    const controller = {
        updateRegion(){
            const regionId = select.val()
            const region = state.regions[regionId]
            const zoom = state.zoom/100
            
            mapController.setRegion(region, zoom)
            canvasController.setSize(region, zoom)
        }
    }
    
    select.change(controller.updateRegion)
    controller.updateRegion()
    
    return controller
})()
