// requires state

const canvasController = (() => {
    const [canvas] = $('canvas')
    
    const canvasController = {
        setSize({width, height}, zoom){
            canvas.width = width*zoom
            canvas.height = height*zoom
        },
    }
    
    return canvasController
})()
