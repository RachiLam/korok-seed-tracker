const state = (() => {
    const EVENTS = [
        'zoomChanged',
        'regionChanged',
        'seedsChanged',
        'statsChanged',
        'loadSave',
    ].reduce((events, key) => {
        events[key] = key
        return events
    }, {})

    const seedState = ({regionId, id, x, y, isChecked, numberPosition}) => ({
        regionId,
        id,
        x,
        y,
        isChecked: isChecked || false,
        numberPosition: numberPosition || 'l',    // i, j, k, l -> up, left, down, right
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
        setNumberPosition(key){
            this.numberPosition = key
        },
        toggleCheck(){
            this.isChecked = !this.isChecked
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

            addSeed(config){
                const nextId = Object.keys(this.seeds).length + 1
                this.seeds[nextId] = seedState({
                    regionId: this.id,
                    ...config,
                    id: nextId,
                })
            },
            removeSeed(){
                const lastId = Object.keys(this.seeds).length
                if(lastId > 0){
                    delete this.seeds[lastId]
                }
            },
            clearSeeds(){
                this.seeds = {}
            },
            getCounts(){
                const seeds = Object.values(this.seeds)
                const checkedCount = seeds.reduce((checkedCount, seed) => checkedCount += seed.isChecked? 1: 0, 0)
                return {
                    checkedCount,
                    totalCount: seeds.length,
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
            const oldZoom = this.zoom;

            if(state.zoom < 500){
                this.zoom += 10
                this.clearSelectedSeed()
                this.emit(EVENTS.zoomChanged)
            }

            gtag('event', 'zoom_in', {
                regionId: this.selectedRegion,
                oldZoom,
                newZoom: this.zoom,
            });
        },
        zoomOut(){
            const oldZoom = this.zoom;

            if(state.zoom > 10){
                this.zoom -= 10
                this.clearSelectedSeed()
                this.emit(EVENTS.zoomChanged)
            }

            gtag('event', 'zoom_out', {
                regionId: this.selectedRegion,
                oldZoom,
                newZoom: this.zoom,
            });
        },
        setRegion(regionId){
            if (this.selectedRegion !== null) {
                gtag('event', 'set_region', { regionId });
            }

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
            this.emit(EVENTS.statsChanged)
        },
        setCachedSeeds(){
            this.cachedSeeds = Object.values(this.getSelectedRegion().seeds)
        },
        removeSeed(){
            this.getSelectedRegion().removeSeed()
            this.setCachedSeeds()
            this.clearSelectedSeed()
            this.emit(EVENTS.seedsChanged)
            this.emit(EVENTS.statsChanged)
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

                gtag('event', 'nudge_selected_seed', {
                    regionId: this.selectedSeed.regionId,
                    id: this.selectedSeed.id,
                    x: this.selectedSeed.x,
                    y: this.selectedSeed.y,
                })

                this.emit(EVENTS.seedsChanged)
            }
        },
        reorder(){
            if(this.selectedSeed === null){
                return
            }

            const region = this.getSelectedRegion()
            const {seeds} = region
            const seedList = Object.values(seeds).sort(({id: id1}, {id: id2}) => (id1 - id2))

            const newId = parseInt(prompt('Enter new id'))
            if(isNaN(newId) || this.selectedSeed.id === newId || newId < 1 || newId > seedList.length){
                return
            }
            const oldIndex = this.selectedSeed.id - 1
            const newIndex = newId - 1

            gtag('event', 'reorder', {
                regionId: this.selectedSeed.regionId,
                id: this.selectedSeed.id,
                oldIndex,
                newIndex,
            })

            region.clearSeeds()

            seedList.splice(oldIndex, 1)
            seedList.splice(newIndex, 0, this.selectedSeed)

            seedList.forEach(seed => {
                region.addSeed(seed)
            })

            this.setCachedSeeds()
            this.selectedSeed = region.seeds[newId]
            this.emit(EVENTS.seedsChanged)
        },
        alterNumberPosition(key){
            if(this.selectedSeed === null){
                return
            }

            gtag('event', 'alter_number_position', {
                regionId: this.selectedSeed.regionId,
                id: this.selectedSeed.id,
                key,
            })

            this.selectedSeed.setNumberPosition(key)
            this.emit(EVENTS.seedsChanged)
        },
        toggleCheck(mouse){
            if(this.highlightedSeed !== null){
                this.highlightedSeed.toggleCheck()

                gtag('event', 'toggle_check', {
                    regionId: this.highlightedSeed.regionId,
                    id: this.highlightedSeed.id,
                    isChecked: this.highlightedSeed.isChecked,
                });

                this.emit(EVENTS.seedsChanged)
                this.emit(EVENTS.statsChanged)
            }
        },
        saveState(){
            const totalCheckedCount = Object.values(state.regions).reduce((sum, region) => sum + region.getCounts().checkedCount, 0);
            gtag('event', 'save_state', { totalCheckedCount });

            const allSeeds = Object.entries(state.regions).reduce((allSeeds, [regionId, {seeds}]) => {
                allSeeds[regionId] = seeds
                return allSeeds
            }, {})
            const blob = new Blob([JSON.stringify(allSeeds, null, 4)], {type: "text/plain;charset=utf-8"})
            const date = $.format.date(Date.now(), 'yyyy-MM-dd--HH-mm-ss')
            const filename = `seeds--${date}.txt`
            saveAs(blob, filename)
            this.lastFilename = filename
            this.emit(EVENTS.loadSave)
        },
        loadSave(filename, saveString){
            try{
                const saveState = JSON.parse(saveString)
                Object.entries(state.regions).forEach(([regionId, regionState]) => {
                    regionState.seeds = {}
                    Object.values(saveState[regionId]).forEach(seed => {
                        regionState.addSeed({
                            ...seed,
                        })
                    })
                })

                const totalCheckedCount = Object.values(state.regions).reduce((sum, region) => sum + region.getCounts().checkedCount, 0);
                gtag('event', 'load_save', { totalCheckedCount });

                this.lastFilename = filename
                this.setRegion(this.selectedRegion)
                this.emit(EVENTS.seedsChanged)
                this.emit(EVENTS.statsChanged)
                this.emit(EVENTS.loadSave)
            }catch(error){
                gtag('event', 'load_error');
                console.log(error)
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
        lastFilename: '',
        writeMode: false,
        zoom: 100,
        selectedRegion: null,
        cachedSeeds: [],
        highlightedSeed: null,
        selectedSeed: null,
        colors: {
            base: '#FFA500',
            checked: '#008B00',
            selected: '#DD00DD',
            highlighted: '#CC0000',
        },
        regions: Object.entries(regions).reduce((regions, [regionId, region]) => {
            regions[regionId] = {
                id: regionId,
                ...region,
                ...regionState(regionId),
            }

            Object.values(initialState[regionId]).forEach(seed => {
                regions[regionId].addSeed({
                    ...seed,
                    isChecked: false,
                })
            })

            return regions
        }, {}),
    }

    state.setRegion('Akkala')
    return state
})()
