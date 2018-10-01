(() => {
    // event triggers
    $(document.body).keydown(({ctrlKey, key}) => {
        if(!ctrlKey && key === 'z'){
            state.saveState()
        }
    })
    
    $('.save').click(() => {
        state.saveState()
    })
    
    const controller = {
        colors: {
            base: '#000000',
            hover: '#FFA500',
        },
        prevent(event){
            event.preventDefault()
            event.stopPropagation()
        },
        setUploadColor(){
            upload.css('border-color', this.colors.hover)
            upload.css('color', this.colors.hover)
        },
        resetUploadColor(){
            upload.css('border-color', this.colors.base)
            upload.css('color', this.colors.base)
        }
    }
    
    const upload = $('.upload')
    $(document.body).on('dragover dragenter drop', controller.prevent)
    upload.on({
        'dragover dragenter': event => {
            controller.prevent(event)
            controller.setUploadColor()
        },
        'dragleave': event => {
            controller.resetUploadColor()
        },
        'drop': event => {
            controller.prevent(event)
            controller.resetUploadColor()
            
            const {files} = event.originalEvent.dataTransfer
            if(files.length > 0){
                const [file] = files
                const reader = new FileReader()
                reader.readAsText(file)
                reader.onload = data => {
                    state.loadSave(file.name, data.target.result)
                }
            }
        },
    })
    state.on('loadSave', state => {
        upload.html(state.lastFilename)
    })
})()
