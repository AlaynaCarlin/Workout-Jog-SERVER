const router = require("express").Router();
const { UserModel } = require("../models");
const { UniqueConstraintError } = require("sequelize/lib/errors");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");

router.get('/practice', (req, res) => {
    res.send("Hey, this is a practice route for user controller!")
});

router.post("/register", async (req, res) => {
    let { username, passwordhash } = req.body.user;
    try {
        const newUser = await UserModel.create({
            username,
            passwordhash: bcrypt.hashSync(passwordhash, 13)
        });

        let token = jwt.sign({id: newUser.id}, process.env.JWT_SECRET, {expiresIn: 60 * 60 * 24});

        res.status(201).json({
            message: "User successfully registered!",
            user: newUser,
            sessionToken: token
        });
    } catch (err) {
        if (err instanceof UniqueConstraintError) {
            res.status(409).json({
                message: "Username already in use"
            });
        } else {
            res.status(500).json({
                message: "Failed to register user"
            });
        }
    }
})

router.post("/login", async (req, res) => {
    let { username, passwordhash } = req.body.user;

    try {
        const loginUser = await UserModel.findOne({
            where: {
                username: username
            },
        });
        if (loginUser) {

            let passwordComparison = await bcrypt.compare(passwordhash, loginUser.passwordhash);

            if (passwordComparison) {

            let token = jwt.sign({id: loginUser.id}, process.env.JWT_SECRET, {expiresIn: 60 * 60 * 24});

            res.status(200).json({
                user: loginUser,
                message: "User successfully logged in!",
                sessionToken: token
            });
            } else {
                res.status(401).json({
                    message: "Incorrect username or *password"
                })
            }
        } else {
            res.status(401).json({
                message: "Incorrect *username or password"
            });
        }
    } catch (err) {
        res.status(500).json({
            message: `failed to log user in error -> ${err}`
            
        })
    }
});

module.exports = router;