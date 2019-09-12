let mongoose = require("mongoose");
let express = require('express');
let bodyparser = require('body-parser');
let morgan = require('morgan');

let app = express();
app.engine('html', require('ejs').renderFile);
app.set('view engine', 'html');
app.use(bodyparser.urlencoded({ extended: false }));
app.use(morgan('common'));

let Tasks = require("./model/tasks");
let Developers = require("./model/developers");

app.use(express.static("images"));
app.use(express.static("styles"));

let url="mongodb://localhost:27017/week7lab";

mongoose.connect(url,function(err){
    if(err) console.log(err);
    else{
        console.log('Connected!!!!');
    }
});

app.get('/', function (req, res) {
    res.sendFile(__dirname + "/views/addtask.html");
});

app.post('/addtask', function (req, res) {
    let theTaskName = req.body.taskName;
    let theAssignTo = req.body.taskAssignTo;
    let theDueDate = new Date(req.body.taskDueDate);
    let theTaskStatus = req.body.taskStatus;
    let theTaskDescription = req.body.taskDescription;

    let tasks=new Tasks({
        name: theTaskName,
        assignTo: theAssignTo,
        dueDate: theDueDate,
        taskStatus: theTaskStatus,
        taskDescription: theTaskDescription
    });

    tasks.save(function(err){
        if(err){
            console.log(err);
        }
        else{
            console.log('Task Saved!!!!');
        }
        res.redirect("/alltasks");
    })
});

app.get('/alltasks', function (req, res) {
    Tasks.find().exec(function (err, data) {
        res.render('alltasks.html', {task: data});
    });
});

app.get('/adddeveloper', function (req, res) {
    res.sendFile(__dirname + "/views/adddeveloper.html");
});

app.post('/adddeveloper', function (req, res) {
    let theDeveloperFisrtName = req.body.developerFirstName;
    let theDeveloperLastName = req.body.developerLastName;
    let theDeveloperLevel = req.body.developerLevel;
    let theDeveloperAddressState = req.body.developerAddressState;
    let theDeveloperAddressSuburb = req.body.developerAddressSuburb;
    let theDeveloperAddressStreet = req.body.developerAddressStreet;
    let theDeveloperAddressUnit = req.body.developerAddressUnit;

    let developers=new Developers({
        name: {firstName: theDeveloperFisrtName, lastName: theDeveloperLastName},
        level: theDeveloperLevel,
        address: {state: theDeveloperAddressState, suburb: theDeveloperAddressSuburb, street: theDeveloperAddressStreet, unit: theDeveloperAddressUnit}
    });

    developers.save(function(err){
        if(err){
            console.log(err);
        }
        else{
            console.log('Developer Saved!!!!');
        }
        res.redirect("/alldevelopers");
    })
});

app.get('/alldevelopers', function (req, res) {
    Developers.find().exec(function (err, data) {
        res.render('alldevelopers.html', {developer: data});
    });
});

app.get('/updatetask', function (req, res) {
    res.sendFile(__dirname + '/views/updatetask.html');
});

app.post('/updatetaskdata', function (req, res) {
    let taskInfo = req.body;
    let filter = {  _id: mongoose.Types.ObjectId(taskInfo.taskId)  };

    Tasks.updateOne({ _id: filter }, { $set: { taskStatus: taskInfo.taskNewStatus } }, function (err, doc) {
        console.log(doc);
    });
    res.redirect('/alltasks');// redirect the client to all tasks
})

app.get('/deletetaskbyid', function (req, res) {
    res.sendFile(__dirname + '/views/deletetaskbyid.html');
});

app.post('/deletetaskiddata', function (req, res) {
    let taskInfo = req.body;
    let filter = { _id: mongoose.Types.ObjectId(taskInfo.taskId) };
    Tasks.deleteOne({ _id: filter }, function (err, doc) {
        console.log(doc);
    });
    res.redirect('/alltasks');// redirect the client to all tasks
});

app.get('/deleteAllComplete', function (req, res) {

    let query =  { taskStatus: "Complete" } ;
    Tasks.deleteMany(query, function (err, doc) {
        console.log(doc);
    });
    res.redirect('/alltasks');

})

app.get('/sortAllComplete', function (req, res) {

    let query =  { taskStatus: "Complete" } ;
    let sort = { name: -1 } ;

    Tasks.where(query).sort(sort).limit(3).exec(function (err, docs) {
        res.render('alltasks.html', {task: docs});
        console.log(docs);
    });

})

app.listen(8080);