require("dotenv").config();

const express = require("express");
const session = require("express-session");
const passport = require("passport");
const DiscordStrategy = require("passport-discord").Strategy;
const db = require("../bot/database");
const auth = require("./middleware/auth");

const app = express();

app.set("view engine", "ejs");
app.use(express.static("web/public"));

app.use(session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false
}));

app.use(passport.initialize());
app.use(passport.session());

passport.serializeUser((user, done) => {
    done(null, user);
});

passport.deserializeUser((obj, done) => {
    done(null, obj);
});

passport.use(new DiscordStrategy({
    clientID: process.env.CLIENT_ID,
    clientSecret: process.env.CLIENT_SECRET,
    callbackURL: process.env.CALLBACK_URL,
    scope: ["identify", "guilds", "guilds.members.read"]
},
(accessToken, refreshToken, profile, done) => {
    done(null, profile);
}));

app.get("/", (req, res) => {
    res.render("login");
});

app.get("/auth/discord",
    passport.authenticate("discord")
);

app.get("/auth/discord/callback",
    passport.authenticate("discord", {
        failureRedirect: "/"
    }),
    (req, res) => {
        res.redirect("/dashboard");
    }
);

app.get("/dashboard", auth, (req, res) => {
    const logs = db.prepare(`
        SELECT * FROM logs
        ORDER BY id DESC
    `).all();

    res.render("dashboard", {
        user: req.user,
        logs
    });
});

app.listen(3000, () => {
    console.log("Web panel running.");
});
