const state = (() => {
    const EVENTS = [
        'zoomChanged',
        'regionChanged',
        'seedsChanged',
    ].reduce((events, key) => {
        events[key] = key
        return events
    }, {})
    
    const seedState = ({id, x, y}) => ({
        id,
        x,
        y,
        isChecked: false,
    })
    
    const regionState = () => ({
        seeds: {},
        
        addSeed({x, y}){
            const nextId = Object.keys(this.seeds).length + 1
            this.seeds[nextId] = seedState({
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
    })
    
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
                this.emit(EVENTS.zoomChanged)
            }
        },
        zoomOut(){
            if(state.zoom > 10){
                this.zoom -= 10
                this.emit(EVENTS.zoomChanged)
            }
        },
        setRegion(regionId){
            this.selectedRegion = regionId
            this.emit(EVENTS.regionChanged)
        },
        addSeed(mouse){
            this.getSelectedRegion().addSeed(mouse)
            this.emit(EVENTS.seedsChanged)
        },
        removeSeed(){
            this.getSelectedRegion().removeSeed()
            this.emit(EVENTS.seedsChanged)
        }
    }
    
    const stateGetters = {
        getSelectedRegion(){
            return this.regions[this.selectedRegion]
        },
        getZoom(){
            return this.zoom/100
        }
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
        selectedRegion: 'Akkala',
        regions: Object.entries(regions).reduce((regions, [regionId, region]) => {
            regions[regionId] = {
                id: regionId,
                ...region,
                ...regionState(),
            }
            
            return regions
        }, {}),
    }
    
    return state
})()
