import { getAllBooks } from "./modules/firebaserequests.js"
import { renderBookTitles, allEventListeners, clearFormInputs } from "./modules/render.js"

async function refreshApp() {

    try {
        const allBooks = await getAllBooks() 
        renderBookTitles(allBooks, refreshApp)
        clearFormInputs()
    } catch (error) {
        console.log(error)
    }
}

allEventListeners(refreshApp) 

refreshApp()


