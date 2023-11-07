const express =require("express");
const router = express.Router();
const validateToken = require("../middleware/auth");
const { getGrievances, createGrievances } = require("../controllers/grievances");


//* using the validation for dayleave route
//* made it private route after using validateToken  only verified users can perform this action

router.get("/grievance", validateToken, getGrievances);
router.post("/grievance", validateToken, createGrievances);


module.exports = router;