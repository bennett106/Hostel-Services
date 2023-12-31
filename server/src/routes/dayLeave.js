const express = require("express");
const router = express.Router();
const {getDayLeave, createDayLeave, showData} = require("../controllers/dayLeave");
const validateToken = require("../middleware/auth");
// const {getDayLeave, createDayLeave} = require("../controllers/dayLeave");

//* using the validation for dayleave route
//* made it private route after using validateToken  only verified users can perform this action

router.get("/day-leave", validateToken, getDayLeave);
router.post("/day-leave", validateToken, createDayLeave);

//retrieve all the dayleave data
router.get("/dayleavedata", showData)


module.exports = router;