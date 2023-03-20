const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require("mongoose");

const app = express();


app.set("view engine", "ejs");

app.use(bodyParser.urlencoded({
    extended: true
}));

app.use(express.static("public"));

mongoose.set('strictQuery', false);
mongoose.connect('mongodb://127.0.0.1:27017/wikiDB');

const articleSchema = {
    title: String,
    content: String
};

const Article = mongoose.model("Article", articleSchema);

// const DOM = new Article({
//     title : "DOM",
//     content : "The Document Object Model is like an API for interacting with our HTML"
// });

// DOM.save()
//     .then(() => console.log('OOhhooo'))
//     .catch((err) => console.log(err));

// ************************************** Request targeting ALL ARTICLES ************************************** //

app.route("/articles")
    .get(async (req, res) => {
        try {
            const articles = await Article.find({});
            res.send(articles);
        } catch (err) {
            console.log(err);
        }
    })
    .post((req, res) => {
        const newArticle = new Article({
            title: req.body.title,
            content: req.body.content
        })
        newArticle.save()
            .then(() => res.send("Successfully Saved"))
            .catch((err) => console.log(err));
    })
    .delete((req, res) => {
        Article.deleteMany({})
            .then(() => res.send("Successfully Deleted"))
            .catch((err) => console.log(err))
    });

    // ********************************* Request targeting SPECIFIC ARTICLES ********************************* //

app.route("/articles/:reqTitle")
    .get(async (req, res) => {
        try {
            const article = await Article.findOne({ title: req.params.reqTitle });
            res.send(article);
        } catch (err) {
            console.log(err);
        }
    })
    .put(async (req, res) => {
        try {
            await Article.replaceOne(
                { title: req.params.reqTitle },
                {
                    title: req.body.title,
                    content: req.body.content
                }
            );
            res.send("Succcessfully Updated through Putting");
        } catch (err) {
            console.log(err);
        }
    })
    .patch(async (req, res) => {
        try {
            await Article.updateOne(
                { title: req.params.reqTitle },
                {$set: req.body}
            );
            res.send("Succcessfully Updated through Patching");
        } catch (err) {
            console.log(err);
        }
    })
    .delete(async (req, res) => {
        try {
            await Article.deleteOne(
                { title: req.params.reqTitle }
            );
            res.send("Successfully deleted one article")
        } catch(err) {
            console.log(err);
        }
    });


app.listen(3000, () => console.log("Server started on port 3000"));