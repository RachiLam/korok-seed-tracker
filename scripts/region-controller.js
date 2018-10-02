(() => {
    const select = $('#region-select')
    
    const controller = {
        getName(name, {checkedCount, totalCount}){
            return name + ' ('+checkedCount+'/'+totalCount+')'
        },
        updateOption(option){
            const {name, value: regionId} = option
            const counts = state.regions[regionId].getCounts()
            option.text = controller.getName(name, counts)
            if(counts.checkedCount === counts.totalCount){
                $(option).css('color', state.colors.checked)
            }else{
                $(option).css('color', state.colors.base)
            }
        },
        updateSelectColor(state){
            const region = state.getSelectedRegion()
            const {checkedCount, totalCount} = region.getCounts()
            if(checkedCount === totalCount){
                select.css('color', state.colors.checked)
            }else{
                select.css('color', 'black')
            }
        },
        onStatsChanged(state){
            const region = state.getSelectedRegion()
            select.find('option').toArray().filter(option => option.value === region.id).forEach(controller.updateOption)
            controller.updateSelectColor(state)
        },
        onLoadSave(state){
            select.find('option').toArray().forEach(controller.updateOption)
            controller.updateSelectColor(state)
        },
    }
    
    // populate select options
    Object.entries(state.regions).forEach(([regionId, region]) => {
        const {name} = region
        const option = document.createElement('option')
        option.name = name
        option.text = controller.getName(name, region.getCounts())
        option.value = regionId
        select.append(option)
    })
    controller.onStatsChanged(state)
    controller.onLoadSave(state)
    
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
    
    // event handlers
    state.on('regionChanged', state => {
        controller.updateSelectColor(state)
    })
    
    state.on('statsChanged', controller.onStatsChanged)
    state.on('loadSave', controller.onLoadSave)
})()
