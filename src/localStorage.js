export const setValueInLocalStorage = (key, value) => {
    try {
        window.localStorage.setItem(key, JSON.stringify(value))
    } catch (error) {
        console.error(error)
    }
}

export const getValueFromLocalStorage = (key) => {
        try {
            const savedId = window.localStorage.getItem(key)
            return JSON.parse(savedId) ? savedId : undefined
        } catch (error) {
            console.error(error)
        }
    }