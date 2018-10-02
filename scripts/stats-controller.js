(() => {
    const totalView = $('.total')
    const seedsContainer = $('.seeds')
    
    const controller = {
        updateStats(state){
            const region = state.getSelectedRegion()
            const highlightedSeedId = state.getHighlightedSeedId()
            const selectedSeedId = state.getSelectedSeedId()
            
            seedsContainer.empty()
            Object.values(region.seeds).forEach(({id, x, y, isChecked}) => {
                const seedDiv = document.createElement('div')
                seedDiv.innerHTML = id
                $(seedDiv).addClass('seed-stat')
                
                const color = (
                    id === selectedSeedId? state.colors.selected:
                    id === highlightedSeedId? state.colors.highlighted:
                    isChecked? state.colors.checked:
                    state.colors.base
                )
                $(seedDiv).css('color', color)
                
                $(seedDiv).mouseenter(() => {
                    state.checkHighlightedSeed({x, y})
                })
                
                seedsContainer.append(seedDiv)
            })
        },
        onStatsChanged(state){
            const [checkedCount, totalCount] = Object.values(state.regions).reduce(([checkedCount, totalCount], region) => {
                const counts = region.getCounts()
                checkedCount += counts.checkedCount
                totalCount += counts.totalCount
                
                return [
                    checkedCount,
                    totalCount,
                ]
            }, [0, 0])
            
            totalView.html(checkedCount+'/'+totalCount)
            if(checkedCount === totalCount){
                totalView.css('color', state.colors.checked)
            }else{
                totalView.css('color', 'black')
            }
        },
    }
    controller.onStatsChanged(state)
    controller.updateStats(state)
    
    // event handlers
    state.on('statsChanged', controller.onStatsChanged)
    state.on('regionChanged', controller.updateStats)
    state.on('seedsChanged', controller.updateStats)
})()
