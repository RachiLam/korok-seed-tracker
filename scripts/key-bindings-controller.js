(() => {
    const keyBindings = $('.key-bindings')
    const showBindings = $('.show-bindings')
    const closeBindings = $('.close-bindings')

    showBindings.click(() => {
        gtag('event', 'show_bindings')

        keyBindings.show()
    })

    closeBindings.click(() => {
        gtag('event', 'hide_bindings')

        keyBindings.hide()
    })
})()
