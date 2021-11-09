const Express = require("express");
const router = Express.Router();
let validateJWT = require("../middleware/validate-jwt");
const { LogModel } = require("../models");

router.get('/practice',validateJWT, (req, res) => {
    res.send("Hey, this is a practice route!")
});

/*
*create log
!----------
*/
router.post("/create", validateJWT, async (req, res) => {
    const { description, definition, result } = req.body.log;
    const { id } = req.user;
    const logEntry = {
        description,
        definition,
        result,
        owner_id: id
    }
    try {
        const newLog = await LogModel.create(logEntry);
        res.status(200).json(newLog);
    } catch (err) {
        res.status(500).json({ error: err });
    }
});


/*
*get journals by user
!--------------------
*/
router.get("/mine", async (req, res) => {
    const { id } = req.user;
    try{
        const logs = await LogModel.findAll({
            where: {
                owner_id: id
            }
        });
        res.status(200).json(logs);
    } catch (err) {
        res.status(500).json({ error: err });
    }
});


/*
*get specific journal by user
!----------------------------
*/
router.get("/mine/:id", async (req, res) => {
    const logId = req.params.id;
    const { id } = req.user;
    try{
        const thisLog = await LogModel.findOne({
            where: {
                id: logId,
                owner_id: id
            }
        });
        res.status(200).json(thisLog);
    } catch (err) {
        res.status(500).json({ error: err });
    }
});


/*
*log update
!----------
*/ // *Get does not need validation because you are retrieving info, but when you want to edit or add info you need validation
router.put("/update/:id", validateJWT, async (req, res) => {
    const { description, definition, result } = req.body.log;
    const logId = req.params.id;
    const { id } = req.user;
    
    const query = {
        where: {
            id: logId,
            owner_id: id
        }
    };

    const updateLog = {
        description: description,
        definition: definition,
        result: result
    };

    try {
        const update = await LogModel.update(updateLog, query);
        res.status(200).json(
            {
                message: `Log successfully updated!`,
                update:update
            });
    } catch (err) {
        res.status(500).json({error: err});
    }
});


/*
*log Delete
!----------
*/
router.delete("/delete/:id", validateJWT, async (req, res) => {
    const logId = req.params.id;
    const { id } = req.user;

    try {
        const query = {
            where: {
                id: logId,
                owner_id: id
            }
        };
        await LogModel.destroy(query);
        res.status(200).json({ message: "log deleted"});
    } catch (err) {
        res.status(500).json({ error: err });
    }
});


module.exports = router;