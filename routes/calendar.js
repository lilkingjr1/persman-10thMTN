const express = require("express"), 
    router = express.Router(),
    Calendar = require("../models/calendar"), 
    Event = require("../models/eventspecifics"), 
    async = require("async");

router.get("/calendar", isVisible, function(req, res){
    Calendar.find({}, function(err, allEvents){
        if(err) {
            console.log(err);
        } else {
            res.render("calendar/calendar", {allEvents: allEvents});
        }
    })
 });

router.get("/calendar/event/:id", isVisible, function(req, res){
    Calendar.findById(req.params.id, function(err, foundEvent){
        if (err) {
            console.log(err);
            return res.redirect("/404/");
        } else {
            Event.find({eventID: foundEvent._id}, function(err, foundSpecifics){
                if(err) {
                    console.log(err);
                    return res.redirect("/404/");
                } else {
                    res.render("calendar/viewevent",{event: foundEvent, list: foundSpecifics[0].attendingList, user:req.user});
                }
            });
        }
    });
});

router.get("/calendar/event", isLoggedIn, function(req,res){
    if(req.user.role.num < 2) return res.redirect("/");
    res.render("calendar/newevent");
});

router.post("/calendar/event", isLoggedIn, function(req,res){
    if(req.user.role.num < 2) return res.redirect("/");
    let event = {};
	switch(req.body.eventtype) {
		case "Basic Combat Training":
			event = {type: "Basic Combat Training", color : "#007bff"};
			break;
		case "Qualification":
			event = {type: "Qualification", color : "#663399"};
			break;
		case "Training/FTX":
			event = {type: "Training/FTX", color : "#33993C"};
			break;
		case "Deployment":
			event = {type: "Deployment", color : "#993333"};
			break;
		case "Staff Meeting":
			event = {type: "Staff Meeting", color : "#E6A118"};
			break;
		default:
			event = {type: "", color : "#000000"};
			break;
	}
    const body = req.body;
    const newEvent = new Calendar({
        title: body.eventname,
        start: body.eventstart,
        description: body.desc,
        startTime: body.eventtime,
        imageName: body.imagename,
        eventType: event,
    });
    Calendar.create(newEvent, function(err, doc){
        if(err) {
            console.log(err);
        }
        Event.create({eventID:doc._id, attendingList: []}, function(err,doc){
            if(err) {
                console.log(err);
            }
        });
    });
    res.redirect("/calendar/");
});

router.post("/calendar/event/:id/users", isLoggedIn, function(req,res){
    if(req.user.role.num < 1) return res.redirect("/");
    if(res.locals.config.enableEventRegistration === "off") return res.redirect("/calendar/event/" + req.params.id);
    if(req.body.type === "register") {
        Event.find({eventID: req.params.id}, function(err,foundEvent){
            if(err) {
                console.log(err);
            }
            foundEvent = foundEvent[0];
            const attendingList = foundEvent.attendingList;
            for(let i = 0; i < attendingList.length; i++) {
                if(attendingList[i].username === req.user.username) return res.redirect(`/calendar/event/${req.params.id}`);
            }
            let newList = foundEvent.attendingList;
            newList.push(req.user);
            Event.findByIdAndUpdate(foundEvent._id, {$set:{attendingList: newList}}, function(err,event){
               if(err) {
                   console.log(err);
               }
            });
			req.flash('success', 'You have successfully registered for the event.');
            return res.redirect(`/calendar/event/${req.params.id}`);
        });
    } else if(req.body.type === "unregister"){
        Event.find({eventID: req.params.id}, function(err,foundEvent){
            if(err) {
                console.log(err);
            }
            foundEvent = foundEvent[0];
            const attendingList = foundEvent.attendingList;
            let val = false;
            for(let i = 0; i < attendingList.length; i++) {
                if(attendingList[i].username === req.user.username) val = true;
            }
            if(!val) return res.redirect(`/calendar/event/${req.params.id}`);
            let newList = foundEvent.attendingList;
            const username = req.user.username;
            const index = attendingList.findIndex(user => user.username === username);
            newList.splice(index,1);
            Event.findByIdAndUpdate(foundEvent._id, {$set:{attendingList: newList}}, function(err,event){
               if(err) {
                   console.log(err);
               }
            });
			req.flash('success', 'You have successfully unregistered for the event.');
            return res.redirect(`/calendar/event/${req.params.id}`);
        });
    }
});

router.get("/calendar/events", isLoggedIn, function(req,res){
    if(req.user.role.num < 2) return res.redirect("/");
    Calendar.find({}, function(err, foundEvents){
       if(err) {
           console.log(err);
       }
       res.render("calendar/allevents", {events : foundEvents.reverse()});
    });
});

router.get("/calendar/event/edit/:id", isLoggedIn, function(req,res){
   if(req.user.role.num < 2) return res.redirect("/");
   Calendar.findById(req.params.id, function(err, foundEvent){
        if(err) {
            console.log(err);
        } else {
			res.render("calendar/editevent",{event: foundEvent});
		}
    });
});

router.post("/calendar/event/edit/", isLoggedIn, function(req,res){
    if(req.user.role.num < 2) return res.redirect("/");
    let event = {};
	switch(req.body.eventtype) {
		case "Basic Combat Training":
			event = {type: "Basic Combat Training", color : "#007bff"};
			break;
		case "Qualification":
			event = {type: "Qualification", color : "#663399"};
			break;
		case "Training/FTX":
			event = {type: "Training/FTX", color : "#33993C"};
			break;
		case "Deployment":
			event = {type: "Deployment", color : "#993333"};
			break;
		case "Staff Meeting":
			event = {type: "Staff Meeting", color : "#E6A118"};
			break;
		default:
			event = {type: "", color : "#000000"};
			break;
	}
    const body = req.body;
    Calendar.findByIdAndUpdate(body.id, {
            $set: {
                title: body.eventname,
				start: body.eventstart,
				description: body.desc,
				startTime: body.eventtime,
				imageName: body.imagename,
				eventType: event
            }
        }, function(err, doc){
        if(err) {
            console.log(err);
			req.flash("error",error.message);
			res.redirect("/calendar/event/edit/"+body.id);
        } else {
			req.flash("success","Successfully edited the event.");
			res.redirect("/calendar/event/edit/"+body.id);
		}
    });
});

router.post("/calendar/events/:id", isLoggedIn, function(req, res){
    if(req.user.role.num < 2) return res.redirect("/");
    Calendar.findByIdAndDelete(req.params.id, err => {
        if(err) {
            console.log(err);
        }
    });
    Event.findOneAndDelete({eventID: req.params.id}, err => {
       if(err) {
           console.log(err);
       }
    });
    res.redirect("/calendar/events");
});

 function isLoggedIn(req,res,next){
     if(req.isAuthenticated()){
         return next();
     }
     res.redirect("/login");
 }

function isVisible(req, res, next) {
    if (res.locals.config.enableVisibility === "on" || req.isAuthenticated()) {
        return next();
    }
    res.redirect("/login");
}

 module.exports = router;