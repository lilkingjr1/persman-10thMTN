const express = require("express"), 
    router = express.Router(), 
    passport = require("passport"),
    EditLog = require("../models/editlog"),
    ServiceRecord = require("../models/servicerecord");

router.get("/user/:id", isLoggedIn, function (req, res) {
    let User = require("../models/user")(res.locals.config);

    User.findById(req.params.id, function (err, foundUser) {
        if (err) {
            console.log(err);
            return res.redirect("/404/");
        } else {
            ServiceRecord.find({userID: req.params.id}, function(err, serviceRecords) {
                res.render("userpage", {user: foundUser, serviceRecords: serviceRecords.sort((a, b) => b.date - a.date)});
            });
        }
    });
});

router.get("/user/edit/:id", isLoggedIn, function (req, res) {
    if (req.user.role.num < 3) return res.redirect("/");
    
    let User = require("../models/user")(res.locals.config);

    User.findById(req.params.id, function (err, foundUser) {
        if (err) {
            console.log(err);
            return res.redirect("/404/");
        } else {
            res.render("edit", {user: foundUser});
        }
    });
});

router.post("/user/edit", isLoggedIn, function (req, res) {
    if (req.user.role.num < 3) return res.redirect("/");

    let userCerts = [];
    let userTabs = [];
    let userAwards = [];
    let userSShops = [];

    let User = require("../models/user")(res.locals.config);

    User.find({_id: req.body.id}, function (err, user) {
        if (err) {
            console.log(err);
            return res.redirect("/404/");
        }

        let userResult = user[0];

		if(typeof req.body.certifications === "string") {
            userCerts.push(req.body.certifications);
        } else {
            userCerts = req.body.certifications;
        }
		if(typeof req.body.tabs === "string") {
            userTabs.push(req.body.tabs);
        } else {
            userTabs = req.body.tabs;
        }
		if(typeof req.body.awards === "string") {
            userAwards.push(req.body.awards);
        } else {
            userAwards = req.body.awards;
        }
		if(typeof req.body.sShops === "string") {
            userSShops.push(req.body.sShops);
        } else {
            userSShops = req.body.sShops;
        }

        if (JSON.stringify(userResult.certifications) !== JSON.stringify(userCerts)) {
            if (userResult.certifications === null || userResult.certifications === undefined) {
                if (userCerts !== null && userCerts !== undefined) {
                    for (var i=0; i<userCerts.length; i++) {
                        let newRecord = new ServiceRecord({
                            userID: req.body.id,
                            date: Date.now(),
                            category: "Merits",
                            description: userCerts[i] + " certified."
                        });
                        newRecord.save();
                    }
                }
            } else if (userCerts === null || userCerts === undefined) {
                if (userResult.certifications !== null && userResult.certifications !== undefined) {
                    for (var i=0; i<userResult.certifications.length; i++) {
                        let newRecord = new ServiceRecord({
                            userID: req.body.id,
                            date: Date.now(),
                            category: "Merits",
                            description: userResult.certifications[i] + " certification revoked."
                        });
                        newRecord.save();
                    }
                }
            } else {
                let differences = arrayDifference(userResult.certifications, userCerts)
                
                for (var i=0; i<differences[0].length; i++) {
                    let newRecord = new ServiceRecord({
                        userID: req.body.id,
                        date: Date.now(),
                        category: "Merits",
                        description: differences[0][i] + " certification revoked."
                    });
                    newRecord.save();
                }

                for (var i=0; i<differences[1].length; i++) {
                    let newRecord = new ServiceRecord({
                        userID: req.body.id,
                        date: Date.now(),
                        category: "Merits",
                        description: differences[1][i] + " certified."
                    });
                    newRecord.save();
                }
            }
        }

        if (JSON.stringify(userResult.tabs) !== JSON.stringify(userTabs)) {
            if (userResult.tabs === null || userResult.tabs === undefined) {
                if (userTabs !== null && userTabs !== undefined) {
                    for (var i=0; i<userTabs.length; i++) {
                        let newRecord = new ServiceRecord({
                            userID: req.body.id,
                            date: Date.now(),
                            category: "Merits",
                            description: "Received " + userTabs[i] + " tab."
                        });
                        newRecord.save();
                    }
                }
            } else if (userTabs === null || userTabs === undefined) {
                if (userResult.tabs !== null && userResult.tabs !== undefined) {
                    for (var i=0; i<userResult.tabs.length; i++) {
                        let newRecord = new ServiceRecord({
                            userID: req.body.id,
                            date: Date.now(),
                            category: "Merits",
                            description: userResult.tabs[i] + " tab revoked."
                        });
                        newRecord.save();
                    }
                }
            } else {
                let differences = arrayDifference(userResult.tabs, userTabs)
                
                for (var i=0; i<differences[0].length; i++) {
                    let newRecord = new ServiceRecord({
                        userID: req.body.id,
                        date: Date.now(),
                        category: "Merits",
                        description: differences[0][i] + " tab revoked."
                    });
                    newRecord.save();
                }

                for (var i=0; i<differences[1].length; i++) {
                    let newRecord = new ServiceRecord({
                        userID: req.body.id,
                        date: Date.now(),
                        category: "Merits",
                        description: "Received " + differences[1][i] + " tab."
                    });
                    newRecord.save();
                }
            }
        }

        if (JSON.stringify(userResult.awards) !== JSON.stringify(userAwards)) {
            if (userResult.awards === null || userResult.awards === undefined) {
                if (userAwards !== null && userAwards !== undefined) {
                    for (var i=0; i<userAwards.length; i++) {
                        let newRecord = new ServiceRecord({
                            userID: req.body.id,
                            date: Date.now(),
                            category: "Merits",
                            description: "Given " + userAwards[i] + " award."
                        });
                        newRecord.save();
                    }
                }
            } else if (userAwards === null || userAwards === undefined) {
                if (userResult.awards !== null && userResult.awards !== undefined) {
                    for (var i=0; i<userResult.awards.length; i++) {
                        let newRecord = new ServiceRecord({
                            userID: req.body.id,
                            date: Date.now(),
                            category: "Merits",
                            description: userResult.awards[i] + " award revoked."
                        });
                        newRecord.save();
                    }
                }
            } else {
                let differences = arrayDifference(userResult.awards, userAwards)
                
                for (var i=0; i<differences[0].length; i++) {
                    let newRecord = new ServiceRecord({
                        userID: req.body.id,
                        date: Date.now(),
                        category: "Merits",
                        description: differences[0][i] + " award revoked."
                    });
                    newRecord.save();
                }

                for (var i=0; i<differences[1].length; i++) {
                    let newRecord = new ServiceRecord({
                        userID: req.body.id,
                        date: Date.now(),
                        category: "Merits",
                        description: "Given " + differences[1][i] + " award."
                    });
                    newRecord.save();
                }
            }
        }

        let newUnit = {company: req.body.company, platoon: req.body.platoon, squad: req.body.squad, team: req.body.team};
		if(req.body.status === "Reserve") {
            newUnit = {company: req.body.company, platoon: "None", squad: "None", team: "None"};
		} else if(req.body.status === "Retired" || req.body.status === "Discharged") {
            newUnit = {company: "None", platoon: "None", squad: "None", team: "None"};
        }

        if (req.body.status !== userResult.status) {
            let newRecord = new ServiceRecord({
                userID: req.body.id,
                date: Date.now(),
                category: "Status",
                description: "Status changed to " + req.body.status + "."
            });
            newRecord.save();
        }

        if (userResult.unit.company !== newUnit.company || userResult.unit.platoon !== newUnit.platoon || userResult.unit.squad !== newUnit.squad || userResult.unit.team !== newUnit.team) {
            let newRecord = new ServiceRecord({
                userID: req.body.id,
                date: Date.now(),
                category: "Position",
                description: `Position changed to ${newUnit.company} Company, ${newUnit.platoon}, ${newUnit.squad}, ${newUnit.team} Team.`
            });
            newRecord.save();
        }

        let roleNum = 0;
		if(req.body.role !== undefined){
			switch (req.body.role) {
				case res.locals.config.userGroups[0]:
					roleNum = 0;
					break;
				case res.locals.config.userGroups[1]:
					roleNum = 1;
					break;
				case res.locals.config.userGroups[2]:
					roleNum = 2;
					break;
				case res.locals.config.userGroups[3]:
					roleNum = 3;
					break;
				case res.locals.config.userGroups[4]:
					roleNum = 4;
					break;
				case res.locals.config.userGroups[5]:
					roleNum = 5;
					break;
            }
            
            if (roleNum !== userResult.role.num) {
                let newRecord = new ServiceRecord({
                    userID: req.body.id,
                    date: Date.now(),
                    category: "Role",
                    description: "Role changed to " + req.body.role + "."
                });
                newRecord.save();
            }

			User.findOneAndUpdate({_id: req.body.id}, {$set: {role: {name: req.body.role, num: roleNum}}
			}, function (err, doc) {
				if (err) {
					console.log(err);
				}
			});
        }
        
        if (userResult.rank !== req.body.rank) {
            let newRecord = new ServiceRecord({
                userID: req.body.id,
                date: Date.now(),
                category: "Rank",
                description: "Rank changed to " + req.body.rank + "."
            });
            newRecord.save();
        }

        if (userResult.position !== req.body.position) {
            let newRecord = new ServiceRecord({
                userID: req.body.id,
                date: Date.now(),
                category: "MOS",
                description: "MOS changed to " + req.body.position + "."
            });
            newRecord.save();
        }
		
        User.findOneAndUpdate({_id: req.body.id}, {
            $set: {
				displayname: req.body.displayname,
				registrationDate: req.body.registrationDate,
                rank: req.body.rank,
                status: req.body.status,
                position: req.body.position,
                sShop: req.body.sShop,
                unit: newUnit,
                certifications: userCerts,
                tabs: userTabs,
                awards: userAwards,
                sShops: userSShops
            }
        }, function (err, doc) {
            if (err) {
                console.log(err);
				req.flash("error",err.message);
				res.redirect("/user/edit/"+req.body.id);
            } else {
                let newLog = new EditLog({
                    editor: req.user.username, 
                    editorID: req.user._id, 
                    editedUser: req.body.username, 
                    editedUserID: req.body.id, 
                    editDate: Date.now(), 
                    editDescription: "Edited User"
                });
                newLog.save();

				req.flash("success","Successfully edited the user.");
				res.redirect("/user/edit/"+req.body.id);
			}
        });
    });
});

router.post("/user/delete/:id", isLoggedIn, (req, res) => {
    if (req.user.role.num < 4) return res.redirect("/");

    let User = require("../models/user")(res.locals.config);
        
    User.findByIdAndDelete(req.params.id, err => {
        if (err) {
            res.redirect("/");
        } else {
            ServiceRecord.deleteMany({userID: req.params.id}, err => {
                if (err) {
                    res.redirect("/");
                } else {
                    let newLog = new EditLog({
                        editor: req.user.username,
                        editorID: req.user._id,
                        editedUser: req.body.username,
                        editedUserID: "",
                        editDate: Date.now(),
                        editDescription: "Deleted User"
                    });
                    newLog.save();
        
                    res.redirect("/listusers");
                }
            })
        }
    });
});

function isLoggedIn(req, res, next) {
    if (req.isAuthenticated()) {
        return next();
    }
    res.redirect("/login");
}

function arrayDifference(a1, a2) {
    let temp = [], temp2 = [], difference = [], difference2 = [];

    for (var i=0; i<a1.length; i++) {
        temp[a1[i]] = true;
    }
    for (var i=0; i<a2.length; i++) {
        temp2[a2[i]] = true;
    }

    for (var i=0; i<a2.length; i++) {
        if (temp[a2[i]]) {
            delete temp[a2[i]];
        }
    }
    for (var i=0; i<a1.length; i++) {
        if (temp2[a1[i]]) {
            delete temp2[a1[i]];
        }
    }

    for (var k in temp) {
        difference.push(k);
    }
    for (var k in temp2) {
        difference2.push(k);
    }

    return [difference, difference2];
}

module.exports = router;