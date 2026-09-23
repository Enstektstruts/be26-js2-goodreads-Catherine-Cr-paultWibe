import { Book } from "./firebaserequests.js"

const bookTitleWrapperRead = document.getElementById("bookTitleWrapperRead")
const bookTitleWrapperNotRead = document.getElementById("bookTitleWrapperNotRead")
const bookInfoModule = document.getElementById("bookInfoModule")
const newBookForm = document.getElementById("newBookForm")
const inputTitle = document.getElementById("inputTitle")
const inputAuthor = document.getElementById("inputAuthor")
const inputRating = document.getElementById("inputRating")
const inputComment = document.getElementById("inputComment")
const inputIsRead = document.getElementById("inputIsRead")
const hiddenInput = document.getElementById("hiddenInput")
const hiddenPatchForm = document.getElementById("hiddenPatchForm")
const inputRatingPatch = document.getElementById("inputRatingPatch")
const inputCommentPatch = document.getElementById("inputCommentPatch")


let currentBookId = null //CURRENTBOOK ID ÄR NULL
let isRead = false

export function clearFormInputs() {
    inputIsRead.classList.remove("greenBtn")
    inputIsRead.classList.add("redBtn")
    inputIsRead.value = "Nej"
    hiddenInput.value = ""
    inputTitle.value = ""
    inputAuthor.value = ""
    inputRating.value = ""
    inputComment.value = ""
    hiddenInput.classList.add("hidden")
    bookInfoModule.classList.add("hidden")
    isRead = false
}

export function renderBookTitles(allBooks, refreshApp) {
    bookTitleWrapperRead.innerHTML = "";
    bookTitleWrapperNotRead.innerHTML = "";
    
    for(const bookId in allBooks) { //BOOK ID DEFINIERAS
        const ul = document.createElement("ul")
        const li = document.createElement("li")
        const p = document.createElement("p")
        p.innerHTML = allBooks[bookId].title
        if (allBooks[bookId].isRead) {
            bookTitleWrapperRead.append(ul)
        } else {
            bookTitleWrapperNotRead.append(ul)
        }

        ul.append(li)
        li.append(p)

        p.addEventListener("click", (e) => { //KLICKAR PÅ BOK, SKICKAR DENS BOOKID
            e.preventDefault()
            bookInfoModule.classList.remove("hidden")
            renderBookInfo(allBooks, bookId, refreshApp)
        })

    }
}

export function renderBookInfo(allBooks, bookId, refreshApp) {
    currentBookId = bookId //ANGER CURRENTBOOK ID, SKICKAS TILLBAKA TILL VARIABELN GLOBALT
    bookInfoModule.innerHTML = ""
    const book = allBooks[bookId]

    const ul = document.createElement("ul")
    const li = document.createElement("li")
    const p = document.createElement("p")

    const deleteBtn = document.createElement("button")
    deleteBtn.innerText = "Ta bort"

    const returnBtn = document.createElement("button")
    returnBtn.innerText = "Tillbaka"

    const isReadBtn = document.createElement("button")
    isReadBtn.innerText = "Oläst"

    if (book.isRead) {
        bookInfoModule.innerText= "BokInfo:"
        p.innerText = `Titel: ${book.title} | Författare: ${book.author} | Betyg: ${book.rating} | Kommentar: ${book.comment}`
        bookInfoModule.append(ul)
        ul.append(li)
        li.append(p, deleteBtn, returnBtn)
    } else {
        bookInfoModule.innerText= "BokInfo:"
        p.innerText = `Titel: ${book.title} | Författare: ${book.author}`
        hiddenPatchForm.classList.add("hidden")
        isReadBtn.classList.add("redBtn")
        bookInfoModule.append(ul, hiddenPatchForm)
        ul.append(li)
        li.append(p, deleteBtn, returnBtn, isReadBtn)
    }

    deleteBtn.addEventListener("click", async (e) => { 
        e.preventDefault()
        const bookUpdate = new Book(bookId)
        await bookUpdate.deleteBook()
        bookInfoModule.classList.add("hidden")

        refreshApp() 
    })

    returnBtn.addEventListener("click", (e) => {
        e.preventDefault()
        bookInfoModule.classList.add("hidden")
    })

    isReadBtn.addEventListener("click", (e) => {
        e.preventDefault()
        book.isRead = !book.isRead
        if (book.isRead) {
            hiddenPatchForm.classList.remove("hidden")
            isReadBtn.innerText = "Läst"
            isReadBtn.classList.remove("redBtn")
            isReadBtn.classList.add("greenBtn")
        } else {
            hiddenPatchForm.classList.add("hidden")
            isReadBtn.innerText = "Oläst"
            isReadBtn.classList.remove("greenBtn")
            isReadBtn.classList.add("redBtn")
        }
    })
    
}

//EVENTLISTENERS

export function allEventListeners(refreshApp) {
    inputIsRead.addEventListener("click", (e) => {
        e.preventDefault()
        isRead = !isRead
        if (isRead) {
            inputIsRead.classList.remove("redBtn")
            inputIsRead.classList.add("greenBtn")
            hiddenInput.classList.remove("hidden")
            inputIsRead.value = "Ja"
        } else {
            inputIsRead.classList.remove("greenBtn")
            inputIsRead.classList.add("redBtn")
            hiddenInput.classList.add("hidden")
            inputIsRead.value = "Nej"
        }
        
    })

    newBookForm.addEventListener("submit", async (e) => {
        e.preventDefault()
        const bookTitle = inputTitle.value
        const bookAuthor = inputAuthor.value
        const bookRating = inputRating.value
        const bookComment = inputComment.value
        const bookIsRead = isRead
        
        const bookUpdate = new Book(null, bookTitle, bookAuthor, bookIsRead, bookRating, bookComment)
        
        await bookUpdate.postBooks()
        clearFormInputs()

        refreshApp()

    })

    hiddenPatchForm.addEventListener("submit", async (e) => {
        e.preventDefault()

        const bookRating = inputRatingPatch.value
        const bookComment = inputCommentPatch.value
        const bookIsRead = true

        const bookUpdate = new Book(currentBookId, null, null, bookIsRead, bookRating, bookComment) //HÄMTAR CURRENTBOOK ID FRÅN VARIABELN GLOBALT
        
        await bookUpdate.patchBook()

        inputRatingPatch.value = ""
        inputCommentPatch.value = ""

        refreshApp()

    }) //HADE MYCKET PROBLEM MED DENNA LYSSNARE PGA SKICKA IN VÄRDEN
}