/*
    requires
        state
        regionController
*/

(() => {
    const [zoom] = $('.zoom')
    const [zoomOut, zoomIn] = $('.heading button')
    
    const controller = {
        zoomIn(){
            if(state.zoom < 300){
                state.zoom += 10
                controller.setZoom()
            }
        },
        zoomOut(){
            if(state.zoom > 10){
                state.zoom -= 10
                controller.setZoom()
            }
        },
        setZoom(){
            regionController.updateRegion()
            zoom.innerHTML = (state.zoom)+ '%'
        },
    }
    
    $(document.body).keydown(({key}) => {
        if(key === '1'){
            controller.zoomOut()
        }else if(key === '2'){
            controller.zoomIn()
        }
    })
    
    $(zoomOut).mousedown(controller.zoomOut)
    $(zoomIn).mousedown(controller.zoomIn)
    
    controller.setZoom()
})()
