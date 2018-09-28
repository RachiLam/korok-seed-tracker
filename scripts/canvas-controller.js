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
            const {id: regionId, width, height, baseRadius, numberOffset, fontSize} = state.getSelectedRegion()
            const zoom = state.getZoom()
            const highlightedSeedId = state.getHighlightedSeedId()
            const selectedSeedId = state.getSelectedSeedId()
            
            context.clearRect(0, 0, width*zoom, height*zoom)
            state.getCachedSeeds().forEach(({id: seedId, x, y}) => {
                const color = (
                    seedId === selectedSeedId? '#FF00FF':
                    seedId === highlightedSeedId? '#FF0000':
                    '#FFA500'
                )
                
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
        if(state.writeMode && !event.ctrlKey){
            state.addSeed(coordinates)
        }
        
        if(event.ctrlKey){
            state.checkSelection(coordinates)
        }
    })
    $(canvas).mousemove(event => {
        const coordinates = controller.getNormalCoordinates(event)
        state.checkHighlightedSeed(coordinates)
    })
    $(document.body).keydown(({ctrlKey, key}) => {
        key = key.toLowerCase()
        
        if(state.writeMode && ctrlKey && key === 'z'){
            state.removeSeed()
        }
        
        if(key === 'r'){
            state.reorder()
        }
        
        if(state.getSelectedSeedId() !== null && ['w', 'a', 's', 'd'].indexOf(key) !== -1){
            const nudge = {
                x: key === 'a'? -1: key === 'd'? 1: 0,
                y: key === 'w'? -1: key === 's'? 1: 0,
            }
            state.nudgeSelectedSeed(nudge)
        }
    })
    
    // event handlers
    state.on('regionChanged', controller.onSizeChange)
    state.on('zoomChanged', controller.onSizeChange)
    state.on('seedsChanged', controller.redraw)
})()
