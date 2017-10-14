require("dotenv").config();

const express = require("express");
const ENV = process.env.ENV || "development";

const router = express.Router();
const knexConfig = require("../knexfile");
const knex = require("knex")(knexConfig[ENV]);

router.get("/", (req, res) => {
  res.render("home");
});
router.get("/lists", (req, res) => {
  knex("lists")
    .select()
    .then(function(lists) {
      res.render("lists/index", { lists: lists });
    });
});

router.get("/lists/new", (req, res) => {
  res.render("lists/new");
});

router.get("/lists/:id", (req, res) => {
  knex("lists")
    .where("id", "=", req.params.id)
    .then(function(result) {
      res.render("lists/show", { result: result });
    });
});

router.get("/lists/:id/tasks", (req, res) => {
  knex("tasks")
    .select()
    .where("list_id", "=", req.params.id)
    .then(function(result) {
      console.log(result);
      res.render("tasks/index", { result: result });
    });
});

router.put("/lists/:id/tasks", (req, res) => {
  // knex("tasks")
  // .where
  //  knex("test").where("col1","a3")
  //  .update({col2: "b3new"}).then(function (count) {
  // console.log(count);
});

router.get("/lists/:id/tasks/new", (req, res) => {
  res.render("tasks/new", { id: req.params.id });
});

router.post("/lists/:id/tasks", (req, res) => {
  console.log(req.body);
  let id = req.params.id;
  console.log(id, "IDIDIDIDID");
  let task = req.body.task;
  knex("tasks")
    .insert({
      name: task,
      list_id: id,
      completed: false
    })
    .then(function(result) {
      console.log(result);
      res.redirect(`/lists/${id}/tasks`);
    });
});

router.post("/lists", (req, res) => {
  let name = req.body.name;

  knex("lists")
    .insert({
      name: name
    })
    .then(function(result) {
      res.redirect("/lists");
    });
});

module.exports = router;
