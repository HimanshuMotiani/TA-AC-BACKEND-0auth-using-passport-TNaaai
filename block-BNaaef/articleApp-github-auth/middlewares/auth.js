var User = require("../models/user")
module.exports = {
    isUserLoggedIn: (req, res, next) => {
        console.log(req.session)
        if (req.session && req.session.userId) {
            next();
        }
        else if (req.session && req.session.passport) {
            next();
        }
        else {
            req.flash("error", "User is not logged in")
            res.redirect("/users/login")
        }
    },
    userInfo: (req, res, next) => {
        var userId = req.session && req.session.userId;
        if (userId) {
            User.findById(userId, "name email", (err, user) => {
                if (err) return next(err);
                req.user = user;
                res.locals.user = user;
                next();
            })
        }
        else {
            req.user = null;
            req.locals.user = null;
            next()
        }
    }
}