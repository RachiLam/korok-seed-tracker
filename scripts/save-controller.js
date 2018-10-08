(() => {
    // event triggers
    $(document.body).keydown(({ctrlKey, key}) => {
        if(!ctrlKey && key === 'z'){
            state.saveState()
        }
    })
    
    const saveButton = $('.save')
    saveButton.click(() => {
        state.saveState()
        controller.resetSaveButton()
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
        },
        loadFile(file){
            const reader = new FileReader()
            reader.readAsText(file)
            reader.onload = data => {
                state.loadSave(file.name, data.target.result)
            }
        },
        setSaveButtonDirty(){
            saveButton.css('color', this.colors.hover)
        },
        resetSaveButton(){
            saveButton.css('color', this.colors.base)
        },
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
                controller.loadFile(file)
            }
        },
    })
    const uploadInput = $('input[type="file"]')
    uploadInput.change(event => {
        const [input] = uploadInput
        if(input.files && input.files.length > 0){
            const file = input.files[0]
            controller.loadFile(file)
        }
    })
    $('.load').click(event => {
        uploadInput.trigger('click')
    })
    
    state.on('statsChanged', state => {
        controller.setSaveButtonDirty()
    })
    
    state.on('loadSave', state => {
        upload.html(state.lastFilename)
        controller.resetSaveButton()
    })
})()
