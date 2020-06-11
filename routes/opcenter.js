const express = require("express"),
    router = express.Router(),
    Discharge = require("../models/discharge"),
    Leave = require("../models/loa"),
    async = require("async"),
    Application = require("../models/application"),
    EditLog = require("../models/editlog"),
    ServiceRecord = require("../models/servicerecord"),
    Pagination = require("pagination");

let perPage = 10;

router.get("/opcenter", isLoggedIn, function(req, res){
   res.render("opcenter/opcenter", {submitted: 0});
});

router.get("/opcenter/discharge", isLoggedIn, function(req, res){
    if(req.user.role.num === 0) return res.redirect("/");
    res.render("opcenter/discharge", {user:req.user});
});

router.get("/opcenter/loa", isLoggedIn, function(req, res){
    if(req.user.role.num === 0) return res.redirect("/");
    res.render("opcenter/loa", {user:req.user});
});

router.get("/opcenter/yourrequests", isLoggedIn, function(req, res){
   Discharge.find({ownerID: req.user.id}, function(err,discharge){
       if(err) {
           console.log(err);
       }
        Leave.find({ownerID: req.user.id}, function(err, leave){
            if(err) {
                console.log(err);
            }
            Application.find({ownerID: req.user.id}, function(err,app){
                if(err) {
                    console.log(err);
                }
                res.render("opcenter/userrequests", {leaves: leave, discharges: discharge, applications: app, user: req.user});
            });
        });
   });
});

router.post("/opcenter/discharge", isLoggedIn, function(req, res){
    if(req.user.role.num === 0) return res.redirect("/");

    Discharge.create({reason: req.body.reason, ownerID: req.body.id, dateCreated: Date.now()}, function(err){
        if(err) {
            console.log(err);
        } else {
			res.render("opcenter/opcenter", {submitted: 1});
        }
    });
});

router.post("/opcenter/loa", isLoggedIn, function(req, res){
    if(req.user.role.num === 0) return res.redirect("/");

    Leave.create({reason: req.body.reason, leaveDate: req.body.begindate, returnDate: req.body.enddate, ownerID: req.body.id, dateCreated: Date.now()}, function(err){
        if(err) {
            console.log(err);
        } else {
			res.render("opcenter/opcenter", {submitted: 1});
        }
    });
});

router.get("/opcenter/requests/applications", isLoggedIn, function(req, res) {
    if (req.user.role.num < 3) return res.redirect("/");

    let User = require("../models/user")(res.locals.config);

    User.find({}, function(err, users) {
        if (err) {
            console.log(err);
        } else {
            Application.find({}, function(err, applications) {
                if (err) {
                    console.log(err)
                } else {
                    let page = Number(req.query.page) || 1;
                    let sortedApplications = applications.sort((a, b) => b.dateCreated - a.dateCreated);
                    let pagination = new Pagination.TemplatePaginator({prelink: "/opcenter/requests/applications", current: page, rowsPerPage: perPage, totalResult: sortedApplications.length, slashSeparator: false, template: paginationTemplate});
                    let startPoint = (perPage * page) - perPage;
                    res.render("opcenter/requests", {users: users, requests: sortedApplications.slice(startPoint, startPoint + perPage), viewRequests: "Applications", requestsPagination: pagination.render()});
                }
            });
        }
    });
});

router.get("/opcenter/requests/discharges", isLoggedIn, function(req, res) {
    if (req.user.role.num < 3) return res.redirect("/");

    let User = require("../models/user")(res.locals.config);

    User.find({}, function(err, users) {
        if (err) {
            console.log(err);
        } else {
            Discharge.find({}, function(err, discharges) {
                if (err) {
                    console.log(err);
                } else {
                    let page = Number(req.query.page) || 1;
                    let sortedDischarges = discharges.sort((a, b) => b.dateCreated - a.dateCreated);
                    let pagination = new Pagination.TemplatePaginator({prelink: "/opcenter/requests/discharges", current: page, rowsPerPage: perPage, totalResult: sortedDischarges.length, slashSeparator: false, template: paginationTemplate});
                    let startPoint = (perPage * page) - perPage;
                    res.render("opcenter/requests", {users: users, requests: sortedDischarges.slice(startPoint, startPoint + perPage), viewRequests: "Discharges", requestsPagination: pagination.render()});
                }
            });
        }
    });
});

router.get("/opcenter/requests/leaves", isLoggedIn, function(req, res) {
    if (req.user.role.num < 3) return res.redirect("/");

    let User = require("../models/user")(res.locals.config);

    User.find({}, function(err, users) {
        if (err) {
            console.log(err);
        } else {
            Leave.find({}, function(err, leaves) {
                if (err) {
                    console.log(err);
                } else {
                    let page = Number(req.query.page) || 1;
                    let sortedLeaves = leaves.sort((a, b) => b.dateCreated - a.dateCreated);
                    let pagination = new Pagination.TemplatePaginator({prelink: "/opcenter/requests/leaves", current: page, rowsPerPage: perPage, totalResult: sortedLeaves.length, slashSeparator: false, template: paginationTemplate});
                    let startPoint = (perPage * page) - perPage;
                    res.render("opcenter/requests", {users: users, requests: sortedLeaves.slice(startPoint, startPoint + perPage), viewRequests: "Leaves", requestsPagination: pagination.render()});
                }
            });
        }
    });
});

router.post("/opcenter/deleterequest/:id", isLoggedIn, function(req,res){
    if(req.user.role.num < 3) return res.redirect("/");
    if(req.body.requestType === "Discharge") {
        Discharge.findByIdAndDelete(req.params.id, function(err){
            if(err) {
                console.log(err);
            }
        });
    } else if(req.body.requestType === "Leave") {
        Leave.findByIdAndDelete(req.params.id, function(err){
            if(err) {
                console.log(err);
            }
        });
    } else if(req.body.requestType === "Application") {
        Application.findByIdAndDelete(req.params.id, function(err){
            if(err) {
                console.log(err);
            }
        });
    }
    res.redirect("/opcenter/requests");
});

router.post("/opcenter/viewrequest/:id", isLoggedIn, function(req,res){
    let User = require("../models/user")(res.locals.config);

    if(req.body.requestType === "Discharge" && req.user.role.num >= 3) {
        Discharge.findById(req.params.id, function(err, foundDischarge){
            if(err) {
                console.log(err);
            } else {
                User.find({}, function(err, allUsers){
                    if(err) {
                        console.log(err);
                    } else {
                        res.render("opcenter/viewdischarge", {discharge: foundDischarge, users: allUsers});
                    }
                })
            }
        });
    } else if(req.body.requestType === "Leave" && req.user.role.num >= 3) {
        Leave.findById(req.params.id, function(err, foundLeave){
            if(err) {
                console.log(err);
            } else {
                User.find({}, function(err, allUsers){
                    if(err) {
                        console.log(err);
                    } else {
                        res.render("opcenter/viewloa", {loa: foundLeave, users: allUsers});
                    }
                })
            }
        });
    } else if(req.body.requestType === "Application") {
        Application.findById(req.params.id, function(err, foundApp){
           if(err) {
               console.log(err);
           }
           User.find({}, function(err, allUsers){
              if(err) {
                  console.log(err);
              }
              res.render("opcenter/viewapplication", {app: foundApp, users: allUsers})
           });
        });
    } else {
		return res.redirect("/");
	}
});

router.get("/opcenter/application", isLoggedIn, function(req,res){
    if(req.user.role.num === 5 || req.user.role.num === 0) {
        res.render("opcenter/createapplication", {user: req.user});
    } else {
        return res.redirect("/");
    }
});

router.post("/opcenter/application", isLoggedIn, function(req,res){
    const newApplication = new Application({
        requestType: "Application",
        country: req.body.country,
        age: req.body.age,
        hours: req.body.hours,
        reason: req.body.reason,
        position: req.body.position,
        positionReason: req.body.positionReason,
        findUs: req.body.findUs,
        steamProfile: req.body.steamProfile,
        arma3: req.body.arma3,
        mic: req.body.mic,
        ts3: req.body.ts3,
        tfar: req.body.tfar,
        discord: true,
        discordUsername: req.body.discordUsername,
        language: req.body.language,
        ace: req.body.ace,
        youngLeadership: req.body.youngLeadership,
        milsim: req.body.milsim,
        ownerID: req.user._id,
        read: "Pending",
        dateCreated: Date.now(),
    });
    Application.create(newApplication, function(err,app){
        if(err) {
            console.log(err);
        }
        res.render("opcenter/opcenter", {submitted: 2});
    });
});

router.post("/opcenter/:id/", isLoggedIn, function(req,res){
    let User = require("../models/user")(res.locals.config);

    if(req.body.requestType === "Leave") {
        if(req.body.approve === "1") {
            Leave.findByIdAndUpdate({_id: req.body.id}, {read: "Approved"}, function(err, doc){
                if(err) {
                    console.log(err);
                }

                let newRecord = new ServiceRecord({
                    userID: doc.ownerID,
                    date: Date.now(),
                    category: "Status",
                    item: "Leave of Absence"
                });
                newRecord.save();

				User.findByIdAndUpdate({_id: doc.ownerID}, {$set:{status: "Leave of Absence"}}, function(err){
					if(err) {
						console.log(err);
					}
				});
            });
        } else {
            Leave.findByIdAndUpdate({_id: req.body.id}, {read: "Denied"}, function(err){
                if(err) {
                    console.log(err);
                }
            });
        }
    } else if(req.body.requestType === "Discharge") {
        if(req.body.approve === "1") {
            Discharge.findById(req.body.id, function(err, foundDischarge){
                if(err) {
                    console.log(err);
                } else {
                    Discharge.findOneAndUpdate({_id: req.body.id}, {$set:{type:req.body.dischargeType, read:"Approved"}}, function(err){
                        if(err) {
                            console.log(err);
                        }
                    });

                    let newRecord = new ServiceRecord({
                        userID: foundDischarge.ownerID,
                        date: Date.now(),
                        category: "Status",
                        item: "Retired"
                    });
                    newRecord.save();

                    User.findOneAndUpdate({_id: foundDischarge.ownerID}, {$set:{status:"Retired", unit: {company: "none", platoon: "none", squad:"none", team:"none"}, rank:"none"}}, function(err){
                        if(err) {
                            console.log(err);
                        }
                    });
                }
            });
        } else {
            Discharge.findOneAndUpdate({_id: req.body.id}, {$set:{read: "Denied"}}, function(err){
                if(err) {
                    console.log(err);
                }
            });
        }
    } else if(req.body.requestType === "Application") {
        if(req.body.approve === "1") {
            Application.findByIdAndUpdate(req.body.id, {$set:{read: "Approved"}}, function(err, doc){
                if(err) {
                    console.log(err);
                }

                let newRecord = new ServiceRecord({
                    userID: doc.ownerID,
                    date: Date.now(),
                    category: "Status",
                    item: "Joined"
                });
                newRecord.save();

				User.findByIdAndUpdate({_id: doc.ownerID}, {$set:{status: "Active Duty", rank: res.locals.config.ranks[1], role: {name: res.locals.config.userGroups[1], num: 1}, steamProfile: doc.steamProfile, discordUsername: doc.discordUsername, age: doc.age, country: doc.country}}, function(err){
					if(err) {
						console.log(err);
					}
				});
            });
        } else {
            Application.findByIdAndUpdate(req.body.id, {$set:{read: "Denied"}}, function(err, doc){
               if(err) {
                   console.log(err);
               }
            });
        }
    }
    res.redirect("/opcenter/requests");
});

router.get("/settings", isLoggedIn, function(req,res){
    if(req.user.role.num < 4) return res.redirect("/");
    res.render("opcenter/settings");
});

router.post("/settings", isLoggedIn, function(req,res){
    if(req.user.role.num < 4) return res.redirect("/");

    let enableApplication = req.body.enableApplication;
    let websiteName = req.body.websiteName;
    let websiteSubtitle = req.body.websiteSubtitle;
    let websiteLogo = req.body.websiteLogo;
    let landingText = req.body.landingText;
    let faq = req.body.faq;
    let mailerEmail = req.body.mailerEmail;
    let mailerPassword = req.body.mailerPassword;
    let discordURL = req.body.discordURL;
    let ts3URL = req.body.ts3URL;
    let modlistURL = req.body.modlistURL;
    let youtubeURL = req.body.youtubeURL;
    let instagramURL = req.body.instagramURL;
    let a3unitsURL = req.body.a3unitsURL;
    let steamgroupURL = req.body.steamgroupURL;
    let donateURL = req.body.donateURL;
    let enableRetiredMembers = req.body.enableRetiredMembers;
    let enableVisibility = req.body.enableVisibility;
    let enableCallToAction = req.body.enableCallToAction;
    let certifications = req.body.certifications.split(",");
    let carouselImages = req.body.carouselImages.split(",");
    let carouselTitles = req.body.carouselTitles.split(",");
    let resourceLinks = req.body.resourceLinks.split(",");
    let resourceTitles = req.body.resourceTitles.split(",");
    let tabs = req.body.tabs.split(",");
    let tabDesc = req.body.tabDesc.split(",");
    let awards = req.body.awards.split(",");
    let awardDesc = req.body.awardDesc.split(",");
    let roles = req.body.roles.split(",");
    let companies = req.body.companies.split(",");
    let platoons = req.body.platoons.split(",");
    let squads = req.body.squads.split(",");
    let teams = req.body.teams.split(",");
    let sShops = req.body.sShops.split(",");
    let ranks = req.body.ranks.split(",");
	let userGroups = [req.body.userGroup0, req.body.userGroup1, req.body.userGroup2, req.body.userGroup3, req.body.userGroup4, req.body.userGroup5];
    if(req.body.enableApplication === undefined) enableApplication = "off";
    if(req.body.enableRetiredMembers === undefined) enableRetiredMembers = "off";
    if(req.body.enableVisibility === undefined) enableVisibility = "off";
    if(req.body.enableCallToAction === undefined) enableCallToAction = "off";
	
	if((tabs.length !== tabDesc.length) || (awards.length !== awardDesc.length) || (carouselImages.length !== carouselTitles.length) || (resourceLinks.length !== resourceTitles.length)) {
        req.flash('error', 'Operations Center Error: Number of descriptions do not match their parent.');
        return res.redirect("/settings");
	}		
	
    if((enableApplication === res.locals.config.enableApplication)
		&& (websiteName === res.locals.config.websiteName)
		&& (websiteSubtitle === res.locals.config.websiteSubtitle)
		&& (websiteLogo === res.locals.config.websiteLogo)
		&& (landingText === res.locals.config.landingText)
		&& (faq === res.locals.config.faq)
		&& (mailerEmail === res.locals.config.mailerEmail)
		&& (mailerPassword === res.locals.config.mailerPassword)
		&& (discordURL === res.locals.config.discordURL)
		&& (ts3URL === res.locals.config.ts3URL)
		&& (modlistURL === res.locals.config.modlistURL)
		&& (youtubeURL === res.locals.config.youtubeURL)
		&& (instagramURL === res.locals.config.instagramURL)
		&& (a3unitsURL === res.locals.config.a3unitsURL)
		&& (steamgroupURL === res.locals.config.steamgroupURL)
		&& (donateURL === res.locals.config.donateURL)
		&& (enableRetiredMembers === res.locals.config.enableRetiredMembers)
		&& (enableVisibility === res.locals.config.enableVisibility)
		&& (enableCallToAction === res.locals.config.enableCallToAction)
		&& (JSON.stringify(certifications) === JSON.stringify(res.locals.config.certifications))
		&& (JSON.stringify(carouselImages) === JSON.stringify(res.locals.config.carouselImages))
		&& (JSON.stringify(carouselTitles) === JSON.stringify(res.locals.config.carouselTitles))
		&& (JSON.stringify(resourceLinks) === JSON.stringify(res.locals.config.resourceLinks))
		&& (JSON.stringify(resourceTitles) === JSON.stringify(res.locals.config.resourceTitles))
		&& (JSON.stringify(tabs) === JSON.stringify(res.locals.config.tabs))
		&& (JSON.stringify(tabDesc) === JSON.stringify(res.locals.config.tabDesc))
		&& (JSON.stringify(awards) === JSON.stringify(res.locals.config.awards))
		&& (JSON.stringify(awardDesc) === JSON.stringify(res.locals.config.awardDesc))
		&& (JSON.stringify(roles) === JSON.stringify(res.locals.config.roles))
		&& (JSON.stringify(companies) === JSON.stringify(res.locals.config.companies))
		&& (JSON.stringify(squads) === JSON.stringify(res.locals.config.squads))
		&& (JSON.stringify(teams) === JSON.stringify(res.locals.config.teams))
		&& (JSON.stringify(sShops) === JSON.stringify(res.locals.config.sShops))
		&& (JSON.stringify(userGroups) === JSON.stringify(res.locals.config.userGroups))
		&& (JSON.stringify(ranks) === JSON.stringify(res.locals.config.ranks))
		&& (JSON.stringify(platoons) === JSON.stringify(res.locals.config.platoons))) {
        req.flash('error', 'No changes to the settings have been made.');
        return res.redirect("/settings");
    }

    res.locals.config.enableApplication = enableApplication;
    res.locals.config.websiteName = websiteName;
    res.locals.config.websiteSubtitle = websiteSubtitle;
    res.locals.config.websiteLogo = websiteLogo;
    res.locals.config.landingText = landingText;
    res.locals.config.faq = faq;
    res.locals.config.mailerEmail = mailerEmail;
    res.locals.config.mailerPassword = mailerPassword;
    res.locals.config.discordURL = discordURL;
    res.locals.config.ts3URL = ts3URL;
    res.locals.config.modlistURL = modlistURL;
    res.locals.config.youtubeURL = youtubeURL;
    res.locals.config.instagramURL = instagramURL;
    res.locals.config.a3unitsURL = a3unitsURL;
    res.locals.config.steamgroupURL = steamgroupURL;
    res.locals.config.donateURL = donateURL;
    res.locals.config.enableRetiredMembers = enableRetiredMembers;
    res.locals.config.enableVisibility = enableVisibility;
    res.locals.config.enableCallToAction = enableCallToAction;
    res.locals.config.certifications = certifications;
    res.locals.config.carouselImages = carouselImages;
    res.locals.config.carouselTitles = carouselTitles;
    res.locals.config.resourceLinks = resourceLinks;
    res.locals.config.resourceTitles = resourceTitles;
    res.locals.config.tabs = tabs;
    res.locals.config.tabDesc = tabDesc;
    res.locals.config.awards = awards;
    res.locals.config.awardDesc = awardDesc;
    res.locals.config.roles = roles;
    res.locals.config.companies = companies;
    res.locals.config.platoons = platoons;
    res.locals.config.squads = squads;
    res.locals.config.teams = teams;
    res.locals.config.sShops = sShops;
    res.locals.config.ranks = ranks;
    res.locals.config.userGroups = userGroups;

    res.locals.config.save({
        enableApplication: enableApplication,
        websiteName: websiteName,
        websiteSubtitle: websiteSubtitle,
        websiteLogo: websiteLogo,
        landingText: landingText,
        faq: faq,
        mailerEmail: mailerEmail,
        mailerPassword: mailerPassword,
        discordURL: discordURL,
        ts3URL: ts3URL,
        modlistURL: modlistURL,
        youtubeURL: youtubeURL,
        instagramURL: instagramURL,
        a3unitsURL: a3unitsURL,
        steamgroupURL: steamgroupURL,
        donateURL: donateURL,
        enableRetiredMembers: enableRetiredMembers,
        enableVisibility: enableVisibility,
        enableCallToAction: enableCallToAction,
        certifications: certifications,
        carouselImages: carouselImages,
        carouselTitles: carouselTitles,
        resourceLinks: resourceLinks,
        resourceTitles: resourceTitles,
        tabs: tabs,
        tabDesc: tabDesc,
        awards: awards,
        awardDesc: awardDesc,
        roles: roles,
        companies: companies,
        platoons: platoons,
        squads: squads,
        teams: teams,
        sShops: sShops,
        ranks: ranks,
        userGroups: userGroups
    }, function(err, product) {
        if (err) return console.log(err);
        console.log("Updated config to DB");
    });

    req.flash('success', 'Settings have been successfully updated.');
    res.redirect("/settings");
});

router.get("/opcenter/logs/edits", isLoggedIn, function(req, res) {
    if (req.user.role.num < 4) return res.redirect("/");

    EditLog.find({editType: "Edit"}, function(err, edits) {
        if (err) {
            console.log(err);
        } else {
            let page = Number(req.query.page) || 1;
            let sortedEdits = edits.sort((a, b) => b.editDate - a.editDate);
            let pagination = new Pagination.TemplatePaginator({prelink: "/opcenter/logs/edits", current: page, rowsPerPage: perPage, totalResult: sortedEdits.length, slashSeparator: false, template: paginationTemplate});
            let startPoint = (perPage * page) - perPage;
            res.render("opcenter/logs", {logs: edits.slice(startPoint, startPoint + perPage), viewLogs: "Edits", logsPagination: pagination.render()});
        }
    });
});

router.get("/opcenter/logs/deletions", isLoggedIn, function(req, res) {
    if (req.user.role.num < 4) return res.redirect("/");

    EditLog.find({editType: "Deletion"}, function(err, deletions) {
        if (err) {
            console.log(err);
        } else {
            let page = Number(req.query.page) || 1;
            let sortedDeletions = deletions.sort((a, b) => b.editDate - a.editDate);
            let pagination = new Pagination.TemplatePaginator({prelink: "/opcenter/logs/deletions", current: page, rowsPerPage: perPage, totalResult: sortedDeletions.length, slashSeparator: false, template: paginationTemplate});
            let startPoint = (perPage * page) - perPage;
            res.render("opcenter/logs", {logs: deletions.slice(startPoint, startPoint + perPage), viewLogs: "Deletions", logsPagination: pagination.render()});
        }
    });
});

function isLoggedIn(req,res,next){
    if(req.isAuthenticated()){
        return next();
    }
    res.redirect("/login");
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