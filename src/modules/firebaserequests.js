export const baseUrl = "https://kakan-71ee0-default-rtdb.europe-west1.firebasedatabase.app/books"


export async function getAllBooks() {
    try {
        const response = await fetch(baseUrl + ".json")
    if (!response.ok) {
        throw new Error("fetch failed")
    }
        const allBooks = await response.json()
        return allBooks
    }catch(error){
        throw error
    }
}

export class Book {
    
    #id;
    #title;
    #author;
    #isRead;
    #rating;
    #comment;
    #url;

    constructor(id, title, author, isRead, rating, comment) {
        this.#id = id;
        this.#title = title;
        this.#author = author;
        this.#isRead = isRead;
        this.#rating = rating;
        this.#comment = comment;
        this.#url = (baseUrl +"/"+ this.#id + ".json")
    }

    async postBooks() {

    
        const options = {
            method: "POST",
            body: JSON.stringify({
                title: this.#title,
                author: this.#author,
                isRead: this.#isRead,
                comment: this.#comment, 
                rating: this.#rating
            }),
            headers: {
                "content-type" : "application/json"
            }
        }

        try {

        const response = await fetch(baseUrl + ".json", options)

        if (!response.ok) {
        throw new Error("post failed")
        }

        const data = await response.json()
        return "successfull post"

        }catch(error){
            throw error
        }
    
}

    async patchBook() {
        
        const options = {
            method: "PATCH",
            body: JSON.stringify({
            isRead: this.#isRead,
            comment: this.#comment, 
            rating: this.#rating
            }),
            headers: {
            "content-type" : "application/json"
            }
        }
        try{
            const response = await fetch(this.#url, options)
        
            if (!response.ok) {
            throw new Error("patch failed")
            }
            const data = await response.json()
            return "successful patch"
    
            }catch(error){
                throw error
            }
            
    }

    async deleteBook() {

        const options = {
            method: "DELETE"
        }

        try {
            const response = await fetch(this.#url, options)
            if (!response.ok) {
            throw new Error("delete failed")
            }
            const data = await response.json()
            return "successful delete"
        }
        catch(error){
            throw error
        }
    }
}