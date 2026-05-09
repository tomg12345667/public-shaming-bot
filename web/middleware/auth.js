module.exports = function(req, res, next) {
    if (!req.user) {
        return res.redirect("/");
    }

    const hasRole = req.user.roles.includes(
        process.env.REQUIRED_ROLE_ID
    );

    if (!hasRole) {
        return res.send("No permission.");
    }

    next();
};
