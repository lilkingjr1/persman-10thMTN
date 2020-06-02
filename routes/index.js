const express = require("express"),
    router = express.Router(),
    passport = require("passport"),
    Calendar = require("../models/calendar"),
    async = require("async"),
    nodemailer = require("nodemailer"),
    crypto = require("crypto");

router.get("/", function(req, res){
    Calendar.find({}, function(err, allEvents){
        if(err) {
            console.log(err);
        }
        if(allEvents.length !== 0) { // Prevent while loop looking at null
			let today = new Date();
			today.setHours(0,0,0,0); // Set time to 0 to allow all today's events (because they don't have a timestamp)
			allEvents.sort((a, b) => new Date(a.start) - new Date(b.start)); // Sort event objects by the date property
			while(today - new Date(allEvents[0].start) > 0) { // While event start date is before today...
				allEvents.shift(); // ...pop it off the front of the array.
				if(allEvents.length <= 0) break; // Break out if array becomes size 0 to prevent null
			}
			allEvents = allEvents.slice(0,3); // Strip array of all but the first 3 elements
		}
        res.render("landing", {events: allEvents});
    });
 });

router.get("/forgot", function(req,res){
    res.render("forgot");
});

router.get("/faq", function(req,res){
    res.render("faq");
});

router.post('/forgot', function(req, res, next) {
    async.waterfall([
        function(done) {
            crypto.randomBytes(20, function(err, buf) {
                var token = buf.toString('hex');
                done(err, token);
            });
        },
        function(token, done) {
            let User = require("../models/user")(res.locals.config);

            User.findOne({ email: req.body.email }, function(err, user) {
                if (!user) {
                    req.flash('error', 'No account with that email address exists.');
                    return res.redirect('/forgot');
                }

                user.resetPasswordToken = token;
                user.resetPasswordExpires = Date.now() + 3600000; // 1 hour

                user.save(function(err) {
                    done(err, token, user);
                });
            });
        },
        function(token, user, done) {
            var smtpTransport = nodemailer.createTransport({
                service: 'Gmail',
                auth: {
                    user: res.locals.config.mailerEmail,
                    pass: res.locals.config.mailerPassword
                }
            });
            var mailOptions = {
                to: user.email,
                from: res.locals.config.mailerEmail,
                subject: res.locals.config.websiteName + ' - Password Reset',
                text: 'You are receiving this because you (or someone else) have requested the reset of the password for your account: ' + user.username + '\n\n' +
                    'Please click on the following link, or paste this into your browser to complete the process:\n\n' +
                    'http://' + req.headers.host + '/reset/' + token + '\n\n' +
                    'If you did not request this, please ignore this email and your password will remain unchanged.\n'
            };
            smtpTransport.sendMail(mailOptions, function(err) {
                req.flash('success', 'An e-mail has been sent to ' + user.email + ' with further instructions.');
                done(err, 'done');
            });
        }
    ], function(err) {
        if (err) return next(err);
        res.redirect('/forgot');
    });
});

router.get('/reset/:token', function(req, res) {
    let User = require("../models/user")(res.locals.config);

    User.findOne({ resetPasswordToken: req.params.token, resetPasswordExpires: { $gt: Date.now() } }, function(err, user) {
        if (!user) {
            console.log("password token invalid");
            req.flash('error', 'Password reset token is invalid or has expired.');
            return res.redirect('/forgot');
        }
        res.render('reset', {token: req.params.token});
    });
});

router.post('/reset/:token', function(req, res) {
    async.waterfall([
        function(done) {
            let User = require("../models/user")(res.locals.config);

            User.findOne({ resetPasswordToken: req.params.token, resetPasswordExpires: { $gt: Date.now() } }, function(err, user) {
                if (!user) {
                    req.flash('error', 'Password reset token is invalid or has expired.');
                    return res.redirect('back');
                }
                if(req.body.password === req.body.confirm) {
                    user.setPassword(req.body.password, function(err) {
                        user.resetPasswordToken = undefined;
                        user.resetPasswordExpires = undefined;

                        user.save(function(err) {
                            req.logIn(user, function(err) {
                                done(err, user);
                            });
                        });
                    })
                } else {
                    req.flash("error", "Passwords do not match.");
                    return res.redirect('back');
                }
            });
        },
        function(user, done) {
            var smtpTransport = nodemailer.createTransport({
                service: 'Gmail',
                auth: {
                    user: res.locals.config.mailerEmail,
                    pass: res.locals.config.mailerPassword
                }
            });
            var mailOptions = {
                to: user.email,
                from: res.locals.config.mailerEmail,
                subject: res.locals.config.websiteName + ' - Your password has been changed',
                text: 'Hello,\n\n' +
                    'This is a confirmation that the password for your account ' + user.email + ' has just been changed.\n'
            };
            smtpTransport.sendMail(mailOptions, function(err) {
                req.flash('success', 'Success! Your password has been changed.');
                done(err);
            });
        }
    ], function(err) {
        res.redirect('/');
    });
});
 
 router.get("/register", function(req,res){
     res.render("register", {email: "", username: "", displayname: "", password: "", error: ""});
 });
 
 router.post("/register", function(req, res){
     let role = {name:res.locals.config.userGroups[0], num:0};
     if(req.body.username === "Red-Thirten") role = {name: res.locals.config.userGroups[5], num:5};

    let User = require("../models/user")(res.locals.config);

     const newUser = new User({
         email: req.body.email,
         username: req.body.username,
		 displayname: req.body.displayname,
         role: role,
		 registrationDate: Date.now()
     });
     User.register(newUser, req.body.password, function(err,user){
         if(err) {
             console.log(err.name);
			 let errMessage = err.message;
			 errMessage = errMessage.replace("User validation failed: ", "");
			 errMessage = errMessage.replace("email: ", " - ");
			 errMessage = errMessage.replace(", ", "<br>");
			 errMessage = errMessage.replace("displayname: ", " - ");
			 errMessage = errMessage.replace("displayname", "display name");
             return res.render("register", {email: req.body.email, username: req.body.username, displayname: req.body.displayname, password: req.body.password, error: errMessage});
         }
         passport.authenticate("local")(req,res,function(){
             res.redirect("/opcenter/");
         })
     });
 });
 
 router.get("/login", function(req, res){
     res.render("login");
 });
 
 router.post("/login", passport.authenticate("local", 
     {
         successRedirect:"/", 
         failureRedirect:"/login",
         failureFlash: true
     }), function(req, res){
 });
 
 router.get("/logout", function(req, res){
     req.logout();
     res.redirect("/");
 });

 module.exports = router;