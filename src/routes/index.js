"use strict"

const express = require('express');
const books = require('../../books.json');
const bodyParser = require("body-parser");
const BookModel = require("../models/BookModel");
const router = express.Router();
const auth = require('../auth');
const jsonParser = bodyParser.json();

router.use(auth.middleware());

router.get("/", (req, res) => {
    res.status(200).render("index", {books: books, username: req.user.username});
});


router.get("/filter/:type", (req, res) => {
    let filteredBooks = books;
    switch (req.params.type) {
        case "available":
            filteredBooks = filteredBooks.filter(book => book.return_date.length === 0);
            break;
        case "return_date":
            filteredBooks = filteredBooks.filter(book => book.return_date)
                .sort((a, b) => Date.parse(a.return_date) - Date.parse(b.return_date));
            break;
    }
    res.status(200).json(filteredBooks);
});


router.post("/", jsonParser, (req, res) => {
    let body = req.body;

    const book = {
        id: undefined,
        ...body,
        reader: body.reader ?? "",
        return_date: body.return_date ?? "",
    }
    book.id = BookModel.generateNewId();

    if (BookModel.validate(book)) {
        try {
            BookModel.save(book);
        } catch (e) {
            console.log(e);
            return res.sendStatus(500);
        }
        return res.status(201).json(books);
    }
    res.sendStatus(400);

});

module.exports = router;