(() => {
    const keyBindings = $('.key-bindings')
    const showBindings = $('.show-bindings')
    const closeBindings = $('.close-bindings')
    
    showBindings.click(() => {
        keyBindings.show()
    })
    
    closeBindings.click(() => {
        keyBindings.hide()
    })
})()
