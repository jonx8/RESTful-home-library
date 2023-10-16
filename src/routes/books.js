"use strict"
const express = require('express');
const bodyParser = require('body-parser');
const books = require('../../books.json');
const BookModel = require("../models/BookModel");
const auth = require("../auth");
const router = express.Router();
const jsonParser = bodyParser.json();

router.use(auth.middleware());

function updateBookEndpoint(req, res) {
    const book = {
        id: undefined,
        ...req.body
    };
    book.id = parseInt(req.params.id);
    if (BookModel.validate(book)) {
        const isNewBook = books.findIndex(el => el.id === book.id) === -1;
        BookModel.save(book);
        return res.sendStatus(isNewBook ? 201 : 204);
    }
    res.sendStatus(400);

}


router.get('/:id([0-9]{1,})', (req, res) => {
    const book = BookModel.getBookById(parseInt(req.params.id));
    if (book) {
        res.render('book-detail', {book: book, username: req.user.username});
    } else {
        res.sendStatus(404);
    }
});

router.post('/:id([0-9]{1,})', jsonParser, updateBookEndpoint);
router.put('/:id([0-9]{1,})', jsonParser, updateBookEndpoint);


router.delete('/:id([0-9]{1,})', (req, res) => {
    const id = parseInt(req.params.id);
    const index = books.findIndex(elem => elem.id === id);

    if (index === -1) {
        res.sendStatus(404);
    } else {
        try {
            BookModel.delete(id);
            return res.status(200).json(books);
        } catch (e) {
            console.log(e);
            res.sendStatus(500);
        }
    }
});

module.exports = router;