const express = require("express");
const router = express.Router();
const {getVacationLeave, createVacationLeaves, showData} = require("../controllers/vacationLeave")
const validateToken = require("../middleware/auth");


//* using the validation for dayleave route
//* made it private route after using validateToken  only verified users can perform this action

router.get("/vacation-leave", validateToken, getVacationLeave);
router.post("/vacation-leave", validateToken, createVacationLeaves);

router.get("/vacationleavedata",showData)


module.exports = router;