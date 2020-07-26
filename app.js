// Requiring all installed packages.
const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const ejs = require('ejs');

const app = express();

// Connecting to mongodb database and,
// Creating 'myTodoDb' named database if not exists
mongoose.connect('mongodb+srv://admin-roshan:'+ process.env.PASS +'@cluster0-triev.mongodb.net/myTodoDb', {useUnifiedTopology:true, useNewUrlParser:true, useFindAndModify:false});

// Creating database schema.
const itemsSchema = new mongoose.Schema({
  name: String
});

// Creating model
const Item = mongoose.model("item", itemsSchema);

// Default entries in DB.
const first = {
  name: "Buy Food"
};
const second = {
  name: "Cook Food"
};
const third = {
  name: "Eat Food"
};
const defaultitemsArray = [first, second, third];

// Setting view engine to EJS and,
// Making public folder static
// Using Body Parser
app.set('view engine', 'ejs');
app.use(express.static('public'));
app.use(bodyParser.urlencoded({extended:true}));

// Handeling get request from home page.
app.get("/", (req, res)=>{
  Item.find({}, (err, items)=>{
    if(err){
    }else {
      if (items.length === 0) {
        res.render("home", {today: 'Today', newItems: defaultitemsArray});
      }else {
        res.render("home", {today: 'Today', newItems: items});
      }
    }
  });
});

// Handeling post request from home page.
app.post("/", (req, res)=>{
  const btnValue = req.body.btn;
  if (btnValue == 'Today') {
    const newItem = new Item({
      name: req.body.newItem
    });
    newItem.save();
    res.redirect("/");
  }else {
    const custNewItem = new customPageModel({
      page: btnValue,
      name: req.body.newItem
    });
    custNewItem.save();
    res.redirect("/"+btnValue);
  }
});

// Handeling delete request from home page.
app.post("/delete", (req, res)=>{
  const itemId = req.body.delete;
  const pageHeading = req.body.pageHeading;
  if (pageHeading == 'Today') {
    if (itemId == "") {
      console.log("Empty");
      res.redirect("/");
    }else{
      Item.findByIdAndRemove(itemId, (err)=>{
        if (!err) {
          console.log("Successfully deleted item");
        }else{
          console.log(err);
        }
      });
      res.redirect("/");
    }
  }else {
    if (itemId == "") {
      console.log("Empty");
    }else {
      customPageModel.findByIdAndRemove(itemId, err =>{
        if (!err) {
          console.log("Successfully deleted item");
        }else {
          console.log(err);
        }
      });
      res.redirect("/"+pageHeading);
    }
  }
});

// =================== Custom List Pages ===================
const customPageSchema = new mongoose.Schema({
  page: String,
  name: String
});

const customPageModel = mongoose.model("custom", customPageSchema);
app.get("/favicon.ico", (req, res)=>{
  res.send("No Favicon");
});

app.get("/:customPage", (req, res)=>{
  const newPage = req.params.customPage;
  console.log(newPage);
    customPageModel.find({page: newPage}, (err, items)=>{
      if (!err) {
        if (items.length === 0) {
          res.render('home', {today: newPage, newItems: defaultitemsArray});
          // customPageModel.insertMany(defaultitemsArray, (err, custItems)=>{
          //   if (!err) {
          //     res.render('home', {today: newPage, newItems: custItems});
          //   }else {
          //     console.log(err);
          //   }
          // });
        }else {
          res.render('home', {today: newPage, newItems: items});
        }
      }else {
        console.log(err);
      }
    });
});

let port = process.env.PORT;
if (port == null || port == "") {
  port = 3000;
}

app.listen(port, ()=>{
  console.log("Server has started successfully");
});
