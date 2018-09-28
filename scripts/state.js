const state = (() => {
    const EVENTS = [
        'zoomChanged',
        'regionChanged',
        'seedsChanged',
    ].reduce((events, key) => {
        events[key] = key
        return events
    }, {})
    
    const seedState = ({regionId, id, x, y}) => ({
        regionId,
        id,
        x,
        y,
        isChecked: false,
        getRegion(){
            return state.regions[this.regionId]
        },
        checkDistance({x: x2, y: y2}){
            const a = this.x - x2
            const b = this.y - y2
            const distance = Math.sqrt(a*a + b*b)
            const {baseRadius} = this.getRegion()
            return distance <= baseRadius
        },
    })
    
    const regionState = (regionId) => {
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
        
        return {
            seeds: {},
            baseRadius,
            numberOffset,
            fontSize,
            
            addSeed({x, y}){
                const nextId = Object.keys(this.seeds).length + 1
                this.seeds[nextId] = seedState({
                    regionId: this.id,
                    id: nextId,
                    x,
                    y,
                })
            },
            removeSeed(){
                const lastId = Object.keys(this.seeds).length
                if(lastId > 0){
                    delete this.seeds[lastId]
                }
            },
        }
    }
    
    const regions = {
        Akkala: {
            name: 'Akkala',
            filepath: 'pictures/Akkala.png',
            width: 850,
            height: 1393,
        },
        Central: {
            name: 'Central',
            filepath: 'pictures/Central.png',
            width: 900,
            height: 937,
        },
        Dueling_Peaks: {
            name: 'Dueling Peaks',
            filepath: 'pictures/Dueling_Peaks.png',
            width: 920,
            height: 602,
        },
        Eldin: {
            name: 'Eldin',
            filepath: 'pictures/Eldin.png',
            width: 950,
            height: 1176,
        },
        Faron: {
            name: 'Faron',
            filepath: 'pictures/Faron.png',
            width: 900,
            height: 566,
        },
        Gerudo: {
            name: 'Gerudo',
            filepath: 'pictures/Gerudo.png',
            width: 3578,
            height: 2308,
        },
        Great_Plateau: {
            name: 'Great Plateau',
            filepath: 'pictures/Great_Plateau.png',
            width: 1261,
            height: 1018,
        },
        Hateno: {
            name: 'Hateno',
            filepath: 'pictures/Hateno.png',
            width: 932,
            height: 926,
        },
        Hebra: {
            name: 'Hebra',
            filepath: 'pictures/Hebra.png',
            width: 2251,
            height: 1266,
        },
        Hyrule_Castle: {
            name: 'Hyrule Castle',
            filepath: 'pictures/Hyrule_Castle.png',
            width: 950,
            height: 970,
        },
        Lake: {
            name: 'Lake',
            filepath: 'pictures/Lake.png',
            width: 900,
            height: 755,
        },
        Lanayru: {
            name: 'Lanayru',
            filepath: 'pictures/Lanayru.png',
            width: 900,
            height: 567,
        },
        Ridgeland: {
            name: 'Ridgeland',
            filepath: 'pictures/Ridgeland.png',
            width: 3871,
            height: 3368,
        },
        Tabantha: {
            name: 'Tabantha',
            filepath: 'pictures/Tabantha.png',
            width: 1829,
            height: 2608,
        },
        Wasteland: {
            name: 'Wasteland',
            filepath: 'pictures/Wasteland.png',
            width: 950,
            height: 662,
        },
        Woodland: {
            name: 'Woodland',
            filepath: 'pictures/Woodland.png',
            width: 950,
            height: 747,
        },
    }
    
    const stateActions = {
        zoomIn(){
            if(state.zoom < 300){
                this.zoom += 10
                this.clearSelectedSeed()
                this.emit(EVENTS.zoomChanged)
            }
        },
        zoomOut(){
            if(state.zoom > 10){
                this.zoom -= 10
                this.clearSelectedSeed()
                this.emit(EVENTS.zoomChanged)
            }
        },
        setRegion(regionId){
            this.selectedRegion = regionId
            this.setCachedSeeds()
            this.highlightedSeed = null
            this.clearSelectedSeed()
            this.emit(EVENTS.regionChanged)
        },
        addSeed(mouse){
            this.getSelectedRegion().addSeed(mouse)
            this.setCachedSeeds()
            this.clearSelectedSeed()
            const eventEmitted = this.checkHighlightedSeed(mouse)
            if(!eventEmitted){
                this.emit(EVENTS.seedsChanged)
            }
        },
        setCachedSeeds(){
            this.cachedSeeds = Object.values(this.getSelectedRegion().seeds)
        },
        removeSeed(){
            this.getSelectedRegion().removeSeed()
            this.setCachedSeeds()
            this.clearSelectedSeed()
            this.emit(EVENTS.seedsChanged)
        },
        checkHighlightedSeed(mouse){
            const [firstSeed] = this.cachedSeeds
            const highlightedIndex = firstSeed && firstSeed.checkDistance(mouse)? 0: this.cachedSeeds.reduce((highlightedIndex, seed, index) => {
                if(highlightedIndex === null && seed.checkDistance(mouse)){
                    highlightedIndex = index
                }
                
                return highlightedIndex
            }, null)
            
            const emitEvent = (
                this.highlightedSeed === null && highlightedIndex !== null
                || this.highlightedSeed !== null && highlightedIndex === null
                || (this.highlightedSeed && this.highlightedSeed.id !== this.cachedSeeds[highlightedIndex].id)
            )
            
            if(highlightedIndex !== null){
                const [highlightedSeed] = this.cachedSeeds.splice(highlightedIndex, 1)
                this.highlightedSeed = highlightedSeed
                this.cachedSeeds.unshift(highlightedSeed)
            }else{
                this.highlightedSeed = null
            }
            
            if(emitEvent){
                this.emit(EVENTS.seedsChanged)
            }
            
            return emitEvent
        },
        checkSelection(mouse){
            const oldSelectedSeed = this.selectedSeed
            
            if(this.highlightedSeed !== null){
                this.selectedSeed = this.selectedSeed === null || this.selectedSeed !== this.highlightedSeed? this.highlightedSeed: null
            }else{
                this.selectedSeed = null
            }
            
            if(oldSelectedSeed !== this.selectedSeed){
                this.emit(EVENTS.seedsChanged)
            }
        },
        clearSelectedSeed(){
            this.selectedSeed = null
        },
        nudgeSelectedSeed({x, y}){
            if(this.selectedSeed !== null){
                this.selectedSeed.x += x
                this.selectedSeed.y += y
                this.emit(EVENTS.seedsChanged)
            }
        },
    }
    
    const stateGetters = {
        getCachedSeeds(){
            // move cached seed to the end so it is drawn last
            const seeds = this.cachedSeeds.slice(1)
            if(this.cachedSeeds.length > 0){
                seeds.push(this.cachedSeeds[0])
            }
            return seeds
        },
        getSelectedRegion(){
            return this.regions[this.selectedRegion]
        },
        getHighlightedSeedId(){
            return this.highlightedSeed !== null?
                this.highlightedSeed.id:
                null
        },
        getSelectedSeedId(){
            return this.selectedSeed !== null?
                this.selectedSeed.id:
                null
        },
        getZoom(){
            return this.zoom/100
        },
    }
    
    const stateEvents = {
        listeners: Object.keys(EVENTS).reduce((listeners, key) => {
            listeners[key] = []
            return listeners
        }, {}),
        on(event, handler){
            if(this.listeners[event] === undefined){
                throw new Error(`State event "${event}" is undefined`)
            }else if(typeof handler !== 'function'){
                throw new Error(`Handler should be a function`)
            }
            
            this.listeners[event].push(handler)
        },
        emit(event){
            if(this.listeners[event] === undefined){
                throw new Error(`State event "${event}" is undefined`)
            }
            
            this.listeners[event].forEach(handler => {
                handler(this)
            })
        },
    }
    
    const state = {
        ...stateActions,
        ...stateGetters,
        ...stateEvents,
        writeMode: true,
        zoom: 100,
        selectedRegion: null,
        cachedSeeds: [],
        highlightedSeed: null,
        selectedSeed: null,
        regions: Object.entries(regions).reduce((regions, [regionId, region]) => {
            regions[regionId] = {
                id: regionId,
                ...region,
                ...regionState(regionId),
            }
            
            return regions
        }, {}),
    }
    
    state.setRegion('Akkala')
    return state
})()
