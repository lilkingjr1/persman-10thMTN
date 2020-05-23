const express = require("express"), 
    router = express.Router(), 
    passport = require("passport"),
    _ = require("lodash");

router.get("/listusers", isVisible, function (req, res) {
    let companies = [];
    let platoons = [];
    let sShops = [];
    const sortingPlatoons = res.locals.config.platoons;
    const sortingSquads = res.locals.config.squads;
    const sortingTeams = res.locals.config.teams;
	const sortingRanks = res.locals.config.ranks;
	const sortingSShops = res.locals.config.sShops;
	let numOfReserve = 0;
    let numOfRetired = 0;

    let User = require("../models/user")(res.locals.config);
        
    User.find({}, function (err, allUsers) {
        if (err) {
            console.log(err);
        } else {
            allUsers.forEach(function (user){
                const platoonName = user.unit.platoon;
                const squadName = user.unit.squad;
				if(user.status === "Reserve") numOfReserve++; // Counts the number of reserve and retired people to determine if those sections should be shown
				if(user.status === "Retired") numOfRetired++;
                if(platoonName.toLowerCase() === "none") return;
				// Goes through all users to see what platoons are actually being used (for display purposes)
                if(search(platoons, platoonName) === false) {
                    let newSquads = [];
                    newSquads.push(squadName);
                    let platoon = ({
                        name: platoonName,
                        squads : newSquads
                    });
                    platoons.push(platoon);
                }
				// Goes through all users to see what squads are actually being used (for display purposes), and sorts the squads in order of config.squads
                if(searchSquads(platoons, platoonName, squadName) === false) {
                    let platoon = platoons.find(o => o.name === platoonName);
                    let newSquads;
                    if(platoon.squads.length !== 0) newSquads = platoon.squads;
                    newSquads.push(squadName);
                    newSquads.sort(function (a, b) {
                        return sortingSquads.indexOf(a) - sortingSquads.indexOf(b);
                    });
                    for(let i = 0; i < platoons.length; i++) {
                        if(platoons[i].name === platoon) {
                            platoons[i].squads = newSquads;
                            break;
                        }
                    }
                }
            });
			allUsers.forEach(function (user){
				if(!user.sShops) return;
				for(let s = 0; s < user.sShops.length; s++) {
					if(sShops.includes(user.sShops[s]) === false) {
						sShops.push(user.sShops[s]);
					}
				}				
            });

            const platoonsByOrder = new Map(sortingPlatoons.map((t, i) => [t, i]));
            const sShopsByOrder = new Map(sortingSShops.map((t, i) => [t, i]));
			const teamsByOrder = new Map(sortingTeams.map((t, i) => [t, i])); // Maps comma-seperated string of teams to a new array
			const ranksByOrder = new Map(sortingRanks.map((t, i) => [t, sortingRanks.length-1-i])); // Maps reverse order of ranks to a new array
            const newPlats = _.sortBy(platoons, o => platoonsByOrder.get(o.name)); // Sorts the platoons in order of config.platoons
            const newSShops = _.sortBy(sShops, o => sShopsByOrder.get(o));
			const sortedUsers = _.sortBy(_.sortBy(allUsers, o => ranksByOrder.get(o.rank)), o => teamsByOrder.get(o.unit.team)); // Sorts users by rank, and then by team
            res.render("listusers", {users: sortedUsers, platoons: newPlats, sShops: newSShops, numOfUsers: allUsers.length, numReserve: numOfReserve, numRetired: numOfRetired});
        }
    })
});

function isVisible(req, res, next) {
    if (res.locals.config.enableVisibility === "on" || req.isAuthenticated()) {
        return next();
    }
    res.redirect("/login");
}

function search(array, key) {
    for(let i = 0; i < array.length; i++) {
        if(array[i].name === key) return true;
    }
    return false;
}

function searchSquads(array, platoon, key) {
    for(let i = 0; i < array.length; i++) {
        if(array[i].name === platoon) {
            for(let j = 0; j < array[i].squads.length; j++) {
                if(array[i].squads[j] === key) {
                    return true;
                }
            }
        }
    }
    return false;
}

module.exports = router;