"use strict";
const express = require("express");
const bodyParser = require('body-parser')

let todos = [
    {id: 1, title: "script", completed: false},
    {id: 2, title: "draft", completed: true},
]
let id = 2;

const app = express();

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }))

// parse application/json
app.use(bodyParser.json())

// Get a list of ToDo
app.get("/api/todos", (req, res) => {
    if(!req.query.completed) {
        res.json(todos)
    }
    else {
        const completed = req.query.completed === "true";
        res.json(todos.filter(todo => todo.completed === completed));
    }
});

// Add a new ToDo
app.post("/api/todos", (req, res, next) => {
    const {title} = req.body;
    if(!title || typeof title !== "string") {
        const err = new Error("Title is required");
        err.statusCode = 400;
        return next(err);
    }
    else {
        // Create a new ToDo
        const todo = {id: id += 1, title, completed: false};
        todos.push(todo);
        res.status(201).json(todo);
    }
}
)

// Error Handler Middleware
app.use((err, req, res, next) => {
    console.error(err);
    res.status(err.statusCode || 500).json({error: err.message});
})
app.listen(3000);

const next = require("next");
const dev = process.env.NODE_ENV !== "production";
const nextApp = next({dev});
nextApp.prepare().then(
    () => app.get("*", nextApp.getRequestHandler()),
    err => {
        console.error(err);
        process.exit(1);
    }
)