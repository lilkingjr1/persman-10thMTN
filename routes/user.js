const express = require("express"), 
    router = express.Router(), 
    passport = require("passport"),
    EditLog = require("../models/editlog"),
    ServiceRecord = require("../models/servicerecord"),
    Pagination = require("pagination");

let perPage = 10;

router.get("/user/:id", isLoggedIn, function (req, res) {
    let User = require("../models/user")(res.locals.config);

    User.findById(req.params.id, function (err, foundUser) {
        if (err) {
            console.log(err);
            return res.redirect("/404/");
        } else {
            ServiceRecord.find({userID: req.params.id}, function(err, serviceRecords) {
                if (err) {
                    console.log(err);
                    return res.redirect("/");
                } else {
                    let sortedRecords = serviceRecords.sort((a, b) => b.date - a.date);
                    let pagination = new Pagination.TemplatePaginator({prelink: "/user/" + req.params.id + "/records/all", current: 1, rowsPerPage: perPage, totalResult: sortedRecords.length, slashSeparator: false, template: paginationTemplate});
                    res.render("userpage", {user: foundUser, serviceRecords: sortedRecords.slice(0, perPage), viewRecords: false, recordsPagination: pagination.render()});
                }
            });
        }
    });
});

router.get("/user/:id/records/all", isLoggedIn, function (req, res) {
    let User = require("../models/user")(res.locals.config);

    User.findById(req.params.id, function (err, foundUser) {
        if (err) {
            console.log(err);
            return res.redirect("/404/");
        } else {
            ServiceRecord.find({userID: req.params.id}, function(err, serviceRecords) {
                if (err) {
                    console.log(err);
                    return res.redirect("/");
                } else {
                    let page = Number(req.query.page) || 1;
                    let sortedRecords = serviceRecords.sort((a, b) => b.date - a.date);
                    let pagination = new Pagination.TemplatePaginator({prelink: "/user/" + req.params.id + "/records/all", current: page, rowsPerPage: perPage, totalResult: sortedRecords.length, slashSeparator: false, template: paginationTemplate});
                    let startPoint = (perPage * page) - perPage;
                    res.render("userpage", {user: foundUser, serviceRecords: sortedRecords.slice(startPoint, startPoint + perPage), viewRecords: "All", recordsPagination: pagination.render()});
                }
            });
        }
    });
});

router.get("/user/:id/records/rank", isLoggedIn, function (req, res) {
    let User = require("../models/user")(res.locals.config);

    User.findById(req.params.id, function (err, foundUser) {
        if (err) {
            console.log(err);
            return res.redirect("/404/");
        } else {
            ServiceRecord.find({userID: req.params.id, category: "Rank"}, function(err, serviceRecords) {
                if (err) {
                    console.log(err);
                    return res.redirect("/");
                } else {
                    let page = Number(req.query.page) || 1;
                    let sortedRecords = serviceRecords.sort((a, b) => b.date - a.date);
                    let pagination = new Pagination.TemplatePaginator({prelink: "/user/" + req.params.id + "/records/rank", current: page, rowsPerPage: perPage, totalResult: sortedRecords.length, slashSeparator: false, template: paginationTemplate});
                    let startPoint = (perPage * page) - perPage;
                    res.render("userpage", {user: foundUser, serviceRecords: sortedRecords.slice(startPoint, startPoint + perPage), viewRecords: "Rank", recordsPagination: pagination.render()});
                }
            });
        }
    });
});

router.get("/user/:id/records/merits", isLoggedIn, function (req, res) {
    let User = require("../models/user")(res.locals.config);

    User.findById(req.params.id, function (err, foundUser) {
        if (err) {
            console.log(err);
            return res.redirect("/404/");
        } else {
            ServiceRecord.find({userID: req.params.id, category: "Merits"}, function(err, serviceRecords) {
                if (err) {
                    console.log(err);
                    return res.redirect("/");
                } else {
                    let page = Number(req.query.page) || 1;
                    let sortedRecords = serviceRecords.sort((a, b) => b.date - a.date);
                    let pagination = new Pagination.TemplatePaginator({prelink: "/user/" + req.params.id + "/records/merits", current: page, rowsPerPage: perPage, totalResult: sortedRecords.length, slashSeparator: false, template: paginationTemplate});
                    let startPoint = (perPage * page) - perPage;
                    res.render("userpage", {user: foundUser, serviceRecords: sortedRecords.slice(startPoint, startPoint + perPage), viewRecords: "Merits", recordsPagination: pagination.render()});
                }
            });
        }
    });
});

router.get("/user/:id/records/mos", isLoggedIn, function (req, res) {
    let User = require("../models/user")(res.locals.config);

    User.findById(req.params.id, function (err, foundUser) {
        if (err) {
            console.log(err);
            return res.redirect("/404/");
        } else {
            ServiceRecord.find({userID: req.params.id, category: "MOS"}, function(err, serviceRecords) {
                if (err) {
                    console.log(err);
                    return res.redirect("/");
                } else {
                    let page = Number(req.query.page) || 1;
                    let sortedRecords = serviceRecords.sort((a, b) => b.date - a.date);
                    let pagination = new Pagination.TemplatePaginator({prelink: "/user/" + req.params.id + "/records/mos", current: page, rowsPerPage: perPage, totalResult: sortedRecords.length, slashSeparator: false, template: paginationTemplate});
                    let startPoint = (perPage * page) - perPage;
                    res.render("userpage", {user: foundUser, serviceRecords: sortedRecords.slice(startPoint, startPoint + perPage), viewRecords: "MOS", recordsPagination: pagination.render()});
                }
            });
        }
    });
});

router.get("/user/:id/records/position", isLoggedIn, function (req, res) {
    let User = require("../models/user")(res.locals.config);

    User.findById(req.params.id, function (err, foundUser) {
        if (err) {
            console.log(err);
            return res.redirect("/404/");
        } else {
            ServiceRecord.find({userID: req.params.id, category: "Position"}, function(err, serviceRecords) {
                if (err) {
                    console.log(err);
                    return res.redirect("/");
                } else {
                    let page = Number(req.query.page) || 1;
                    let sortedRecords = serviceRecords.sort((a, b) => b.date - a.date);
                    let pagination = new Pagination.TemplatePaginator({prelink: "/user/" + req.params.id + "/records/position", current: page, rowsPerPage: perPage, totalResult: sortedRecords.length, slashSeparator: false, template: paginationTemplate});
                    let startPoint = (perPage * page) - perPage;
                    res.render("userpage", {user: foundUser, serviceRecords: sortedRecords.slice(startPoint, startPoint + perPage), viewRecords: "Position", recordsPagination: pagination.render()});
                }
            });
        }
    });
});

router.get("/user/:id/records/status", isLoggedIn, function (req, res) {
    let User = require("../models/user")(res.locals.config);

    User.findById(req.params.id, function (err, foundUser) {
        if (err) {
            console.log(err);
            return res.redirect("/404/");
        } else {
            ServiceRecord.find({userID: req.params.id, category: "Status"}, function(err, serviceRecords) {
                if (err) {
                    console.log(err);
                    return res.redirect("/");
                } else {
                    let page = Number(req.query.page) || 1;
                    let sortedRecords = serviceRecords.sort((a, b) => b.date - a.date);
                    let pagination = new Pagination.TemplatePaginator({prelink: "/user/" + req.params.id + "/records/status", current: page, rowsPerPage: perPage, totalResult: sortedRecords.length, slashSeparator: false, template: paginationTemplate});
                    let startPoint = (perPage * page) - perPage;
                    res.render("userpage", {user: foundUser, serviceRecords: sortedRecords.slice(startPoint, startPoint + perPage), viewRecords: "Status", recordsPagination: pagination.render()});
                }
            });
        }
    });
});

router.get("/user/:id/records/role", isLoggedIn, function (req, res) {
    if (req.user.role.num < 3) return res.redirect("/user/" + req.params.id);

    let User = require("../models/user")(res.locals.config);

    User.findById(req.params.id, function (err, foundUser) {
        if (err) {
            console.log(err);
            return res.redirect("/404/");
        } else {
            ServiceRecord.find({userID: req.params.id, category: "Role"}, function(err, serviceRecords) {
                if (err) {
                    console.log(err);
                    return res.redirect("/");
                } else {
                    let page = Number(req.query.page) || 1;
                    let sortedRecords = serviceRecords.sort((a, b) => b.date - a.date);
                    let pagination = new Pagination.TemplatePaginator({prelink: "/user/" + req.params.id + "/records/role", current: page, rowsPerPage: perPage, totalResult: sortedRecords.length, slashSeparator: false, template: paginationTemplate});
                    let startPoint = (perPage * page) - perPage;
                    res.render("userpage", {user: foundUser, serviceRecords: sortedRecords.slice(startPoint, startPoint + perPage), viewRecords: "Role", recordsPagination: pagination.render()});
                }
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
    
    let serviceRecordBatch = [];

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
                            subCategory: "Certifications",
                            item: userCerts[i],
                            granted: true
                        });
                        serviceRecordBatch.push(newRecord);
                    }
                }
            } else if (userCerts === null || userCerts === undefined) {
                if (userResult.certifications !== null && userResult.certifications !== undefined) {
                    for (var i=0; i<userResult.certifications.length; i++) {
                        let newRecord = new ServiceRecord({
                            userID: req.body.id,
                            date: Date.now(),
                            category: "Merits",
                            subCategory: "Certifications",
                            item: userResult.certifications[i],
                            granted: false
                        });
                        serviceRecordBatch.push(newRecord);
                    }
                }
            } else {
                let differences = arrayDifference(userResult.certifications, userCerts)
                
                for (var i=0; i<differences[0].length; i++) {
                    let newRecord = new ServiceRecord({
                        userID: req.body.id,
                        date: Date.now(),
                        category: "Merits",
                        subCategory: "Certifications",
                        item: differences[0][i],
                        granted: false
                    });
                    serviceRecordBatch.push(newRecord);
                }

                for (var i=0; i<differences[1].length; i++) {
                    let newRecord = new ServiceRecord({
                        userID: req.body.id,
                        date: Date.now(),
                        category: "Merits",
                        subCategory: "Certifications",
                        item: differences[1][i],
                        granted: true
                    });
                    serviceRecordBatch.push(newRecord);
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
                            subCategory: "Tabs",
                            item: userTabs[i],
                            granted: true
                        });
                        serviceRecordBatch.push(newRecord);
                    }
                }
            } else if (userTabs === null || userTabs === undefined) {
                if (userResult.tabs !== null && userResult.tabs !== undefined) {
                    for (var i=0; i<userResult.tabs.length; i++) {
                        let newRecord = new ServiceRecord({
                            userID: req.body.id,
                            date: Date.now(),
                            category: "Merits",
                            subCategory: "Tabs",
                            item: userResult.tabs[i],
                            granted: false
                        });
                        serviceRecordBatch.push(newRecord);
                    }
                }
            } else {
                let differences = arrayDifference(userResult.tabs, userTabs)
                
                for (var i=0; i<differences[0].length; i++) {
                    let newRecord = new ServiceRecord({
                        userID: req.body.id,
                        date: Date.now(),
                        category: "Merits",
                        subCategory: "Tabs",
                        item: differences[0][i],
                        granted: false
                    });
                    serviceRecordBatch.push(newRecord);
                }

                for (var i=0; i<differences[1].length; i++) {
                    let newRecord = new ServiceRecord({
                        userID: req.body.id,
                        date: Date.now(),
                        category: "Merits",
                        subCategory: "Tabs",
                        item: differences[1][i],
                        granted: true
                    });
                    serviceRecordBatch.push(newRecord);
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
                            subCategory: "Awards",
                            item: userAwards[i],
                            granted: true
                        });
                        serviceRecordBatch.push(newRecord);
                    }
                }
            } else if (userAwards === null || userAwards === undefined) {
                if (userResult.awards !== null && userResult.awards !== undefined) {
                    for (var i=0; i<userResult.awards.length; i++) {
                        let newRecord = new ServiceRecord({
                            userID: req.body.id,
                            date: Date.now(),
                            category: "Merits",
                            subCategory: "Awards",
                            item: userResult.awards[i],
                            granted: false
                        });
                        serviceRecordBatch.push(newRecord);
                    }
                }
            } else {
                let differences = arrayDifference(userResult.awards, userAwards)
                
                for (var i=0; i<differences[0].length; i++) {
                    let newRecord = new ServiceRecord({
                        userID: req.body.id,
                        date: Date.now(),
                        category: "Merits",
                        subCategory: "Awards",
                        item: differences[0][i],
                        granted: false
                    });
                    serviceRecordBatch.push(newRecord);
                }

                for (var i=0; i<differences[1].length; i++) {
                    let newRecord = new ServiceRecord({
                        userID: req.body.id,
                        date: Date.now(),
                        category: "Merits",
                        subCategory: "Awards",
                        item: differences[1][i],
                        granted: true
                    });
                    serviceRecordBatch.push(newRecord);
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
                item: req.body.status
            });
            serviceRecordBatch.push(newRecord);
        }

        if (userResult.unit.company !== newUnit.company || userResult.unit.platoon !== newUnit.platoon || userResult.unit.squad !== newUnit.squad || userResult.unit.team !== newUnit.team) {
            let newRecord = new ServiceRecord({
                userID: req.body.id,
                date: Date.now(),
                category: "Position",
                item: `${newUnit.company},${newUnit.platoon},${newUnit.squad},${newUnit.team}`
            });
            serviceRecordBatch.push(newRecord);
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
                    item: req.body.role
                });
                serviceRecordBatch.push(newRecord);
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
                item: req.body.rank
            });
            serviceRecordBatch.push(newRecord);
        }

        if (userResult.position !== req.body.position) {
            let newRecord = new ServiceRecord({
                userID: req.body.id,
                date: Date.now(),
                category: "MOS",
                item: req.body.position
            });
            serviceRecordBatch.push(newRecord);
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
                ServiceRecord.insertMany(serviceRecordBatch, function(err) {
                    if (err) {
                        console.log(err);
                    }
                });

                let newLog = new EditLog({
                    editor: req.user.username, 
                    editorID: req.user._id, 
                    editedUser: req.body.username, 
                    editedUserID: req.body.id, 
                    editDate: Date.now(), 
                    editType: "Edit"
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
                        editedUserID: req.params.id,
                        editDate: Date.now(),
                        editType: "Deletion"
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

function paginationTemplate(result) {
    var i, len, prelink;
    var html = '<div><ul class="pagination justify-content-center">';
    if (result.pageCount < 2) {
        html += '</ul></div>';
        return html;
    }
    prelink = this.preparePreLink(result.prelink);
    if (result.previous) {
        html += '<li class="page-item"><a class="page-link" href="' + prelink + result.previous + '">' + this.options.translator('PREVIOUS') + '</a></li>';
    }
    if (result.range.length) {
        for (i=0, len=result.range.length; i<len; i++) {
            if (result.range[i] === result.current) {
                html += '<li class="active page-item"><a class="page-link" href="' + prelink + result.range[i] + '">' + result.range[i] + '</a></li>';
            } else {
                html += '<li class="page-item"><a class="page-link" href="' + prelink + result.range[i] + '">' + result.range[i] + '</a></li>';
            }
        }
    }
    if (result.next) {
        html += '<li class="page-item"><a class="page-link" href="' + prelink + result.next + '" class="paginator-next">' + this.options.translator('NEXT') + '</a></li>';
    }
    html += '</ul></div>';
    return html;
}

module.exports = router;