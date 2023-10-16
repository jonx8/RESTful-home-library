const fs = require("fs");
const books = require('../../books.json');

module.exports = class BookModel {
    static generateNewId() {
        if (books.length === 0) return 1;
        return books.reduce((prev, curr) => prev.id > curr.id ? prev : curr).id + 1;
    }


    static getBookById(id) {
        return books.find(book => book.id === id);
    }

    static save(book) {
        const index = books.findIndex(elem => elem.id === book.id);
        if (index === -1)
            books.push(book);
        else books[index] = book;

        fs.writeFile("../books.json", JSON.stringify(books), err => {
            if (err) throw err
        });
    }


    static delete(id) {
        const index = books.findIndex(elem => elem.id === id);
        if (index !== -1) {
            books.splice(index, 1);
            fs.writeFile("../books.json", JSON.stringify(books), err => {
                if (err) throw err;
            })
        }
    }

    static validate(book) {
        const dateRegex = RegExp(/^\s*((?:19|20)\d{2})\.(1[012]|0?[1-9])\.(3[01]|[12]\d|0?[1-9])\s*$/);
        if (Object.keys(book).length !== 6) return false;
        if (book['title']?.trim() === "" || book['title']?.length > 50) return false;
        if (book['author']?.trim() === "" || book['author']?.length > 50) return false;
        if (book['year']?.length > 4 || isNaN(parseInt(book['year'].trim()))) return false;
        if (book.reader?.length > 30) return false;
        if (book['return_date']?.trim() === "" && book.reader?.trim() === "") return true;
        return dateRegex.exec(book['return_date']) !== null && book.reader?.trim() !== "";
    }
}



