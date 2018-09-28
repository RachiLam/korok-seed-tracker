(() => {
    const [canvas] = $('canvas')
    const context = canvas.getContext('2d')
    
    const controller = {
        getNormalCoordinates({clientX, clientY}){
            const {left, top} = canvas.getBoundingClientRect()
            const zoom = state.getZoom()
            
            return {
                x: Math.round((clientX - left)/zoom),
                y: Math.round((clientY - top)/zoom),
            }
        },
        redraw(state){
            const {id: regionId, width, height, seeds} = state.getSelectedRegion()
            const zoom = state.getZoom()
            
            let baseRadius
            let numberOffset
            let fontSize
            switch(regionId){
                case 'Gerudo':
                case 'Great_Plateau':
                case 'Hebra':
                case 'Ridgeland':
                case 'Tabantha':
                    baseRadius = 24
                    numberOffset = 30
                    fontSize = 26
                    break
                case 'Hyrule_Castle':
                    baseRadius = 20
                    numberOffset = 30
                    fontSize = 20
                    break
                case 'Hateno':
                case 'Woodland':
                    baseRadius = 8
                    numberOffset = 10
                    fontSize = 10
                    break
                case 'Lanayru':
                case 'Wasteland':
                    baseRadius = 6
                    numberOffset = 10
                    fontSize = 10
                    break
                default:
                    baseRadius = 10
                    numberOffset = 14
                    fontSize = 12
                    break
            }
            
            context.clearRect(0, 0, width*zoom, height*zoom)
            Object.entries(seeds).forEach(([key, {id: seedId, x, y}]) => {
                const color = '#FFA500'
                
                context.beginPath()
                context.strokeStyle = color
                context.lineWidth = 2
                context.arc(x*zoom, y*zoom, baseRadius*zoom, 0, 2*Math.PI)
                context.stroke()
                
                context.fillStyle = color
                context.font=`${parseInt(fontSize*zoom)}px sans-serif`
                context.fillText(seedId, x*zoom + numberOffset*zoom, y*zoom + 5*zoom)
            })
        },
        
        onSizeChange(state){
            const {width, height} = state.getSelectedRegion()
            const zoom = state.getZoom()
            
            canvas.width = width*zoom
            canvas.height = height*zoom
            controller.redraw(state)
        },
    }
    controller.onSizeChange(state)
    
    // event triggers
    $(canvas).click(event => {
        const coordinates = controller.getNormalCoordinates(event)
        if(state.writeMode){
            state.addSeed(coordinates)
        }
    })
    $(document.body).keydown(({ctrlKey, key}) => {
        if(state.writeMode && ctrlKey && key.toLowerCase() === 'z'){
            state.removeSeed()
        }
    })
    
    // event handlers
    state.on('regionChanged', controller.onSizeChange)
    state.on('zoomChanged', controller.onSizeChange)
    state.on('seedsChanged', controller.redraw)
})()
