(() => {
    const [zoom] = $('.zoom')
    const [zoomOut, zoomIn] = $('.heading button')
    
    const controller = {
        zoomIn(){
            state.zoomIn()
        },
        zoomOut(){
            state.zoomOut()
        },
        
        onZoomChange(state){
            zoom.innerHTML = (state.zoom)+ '%'
        },
    }
    
    // event triggers
    $(document.body).keydown(({key}) => {
        if(key.toLowerCase() === 'q'){
            controller.zoomOut()
        }else if(key.toLowerCase() === 'e'){
            controller.zoomIn()
        }
    })
    $(zoomOut).mousedown(controller.zoomOut)
    $(zoomIn).mousedown(controller.zoomIn)
    
    // event handlers
    state.on('zoomChanged', controller.onZoomChange)
})()
