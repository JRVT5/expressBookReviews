const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();
const baseUrl = "https://jbroberts-5000.theiadockernext-0-labs-prod-theiak8s-4-tor01.proxy.cognitiveclass.ai";
const axios = require('axios');

public_users.post("/register", (req,res) => {
    const username = req.body.username;
    const password = req.body.password;
    if (username && password) {
        if (!isValid(username)) {
            users.push({"username":username,"password":password});
            return res.status(200).json({message: "User successfully registred. Now you can login"});
        } else {
            return res.status(404).json({message: "User already exists!"});
        }
    }
    return res.status(404).json({message: "Unable to register user."});
});

// Get the book list available in the shop
public_users.get('/',function (req, res) {
    axios({
        url: baseUrl,
        method: "get"
    }).then(()=> {
        let bookList = [];
        Object.keys(books).forEach(key => {
            const value = books[key];
            bookList.push(JSON.stringify(key), JSON.stringify(value));
        });
        res.send(bookList)
    }).catch((err) => {
        res.send(err)
    });
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn',function (req, res) {
  //Write your code here
  axios({
    url: baseUrl + '/isbn/' + req.params.isbn,
    method: 'get'
  }).then(()=>{
    const isbn = req.params.isbn;
    const getBook = books[isbn];
    res.send(JSON.stringify(getBook));
  }).catch(err=> {
    res.send(err)
  })
 });
  
// Get book details based on author
public_users.get('/author/:author',function (req, res) {
    axios({
        url: baseUrl + '/author/' + req.params.author,
        method: 'get'
    }).then(()=> {
        const authorBody = req.params.author;
        Object.keys(books).forEach(key => {
            const author = books[key].author;
            if  (author == authorBody) {
                res.send(JSON.stringify(books[key]));
            }
        })
    }).catch(err=>{
        res.send(err);
    })
});

// Get all books based on title
public_users.get('/title/:title',function (req, res) {
    axios({
        url: baseUrl + '/title/' + req.params.title,
        method: 'get'
    }).then(()=>{
        const titleBody = req.params.title;
        Object.keys(books).forEach(key => {
            const title = books[key].title;
            if  (title == titleBody) {
                res.send(JSON.stringify(books[key]));
            }
        })
    }).catch(err=> {
        res.send(err)
    })
});

//  Get book review
public_users.get('/review/:isbn',function (req, res) {
    const isbn = req.params.isbn;
    const getBook = books[isbn]
    const review = getBook.reviews;
    res.send(JSON.stringify(review));
});

module.exports.general = public_users;
