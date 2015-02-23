var express = require("express");
var server = express();

var mongoose = require("mongoose");
var morgan = require("morgan");
var bodyParser = require("body-parser");
var methodOverride = require("method-override");


// define mongoose model for MongoDB ============================================================
var Project = mongoose.model("Project", {
  Title : String,
  Description : String,
  Content: String,
  Posted: 0,
  isEdited: Boolean
});

//api configuration ============================================================

mongoose.connect("mongodb://localhost/api/projects"); //connect to database on host

server.use(express.static(__dirname + "/public"));       //set public directory as static fileServer
server.use(morgan("dev"));                               //set morgan middleware for console.log
server.use(bodyParser.urlencoded({"extended":"true"}));  //set header to url encoded for POST request
server.use(bodyParser.json());                           //set bodParser.json middleware as response default
server.use(bodyParser.json({type: "application/vnd.api+json"}));
server.use(methodOverride());

//routes =======================================================
//api
//get all todos
server.get("/api/projects", function(req,res){
  //use mongoose to get all projects in the database
  Project.find(function(err, projects){
    //if there is an error retrieving, send error. nothing after res.send(err) will execute
    if(err) {
      res.send(err);
    }
    res.json(projects);
  });
});

//create a project and send back all projects after creation
server.post("/api/projects", function(req,res) {
  var date = new Date();
  Project.create({
    Title: req.body.Title,
    Description : req.body.Description,
    Content: req.body.Content,
    Posted: date,
    isEdited: false
  }, function(err, project) {
    if(err)res.send(err);
    //get and return all todos after you create another
    Project.find(function(err,projects) {
      if(err)res.send(err);
      res.json(projects);
    });
  });
});

//replace a project
server.put("/api/projects/:project_id", function(req,res) {
  Project.findOne({
    _id: req.params.project_id
  }, function(err, project){
    if(err)res.send(err);
    for (prop in req.body) {
      project[prop] = req.body[prop];
    }
    project.save(function(err){
      if(err)res.send(err);
      Project.find(function(err,projects) {
        if(err)res.send(err);
        res.json(projects);
      });
    });
  });
});

//delete a project
server.delete("/api/projects/:project_id", function(req,res){
  Project.remove({
    _id: req.params.project_id
  }, function(err, project){
    if(err)res.send(err);
    Project.find(function(err,projects) {
      if(err)res.send(err);
      res.json(projects);
    });
  });
});

server.get("/", function(req, res){
  res.sendFile("./public/index.html");
});

server.listen(3000, function(){
  console.log("server listening on port localhost:3000")
});
