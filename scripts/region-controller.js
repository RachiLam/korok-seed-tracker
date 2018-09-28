(() => {
    const select = $('#region-select')
    
    // populate select options
    Object.entries(state.regions).forEach(([key, {name}]) => {
        const option = document.createElement('option')
        option.text = name
        option.value = key
        select.append(option)
    })
    
    // prevent keys changing the select option
    select.keydown(({key}) => {
        if(key !== 'ArrowLeft' && key !== 'ArrowRight'){
            event.preventDefault()
        }
    })
    
    // event triggers
    select.change(event => {
        const regionId = select.val()
        state.setRegion(regionId)
    })
})()
