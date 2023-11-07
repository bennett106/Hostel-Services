const Grievance = require("../models/grievances");
const User = require('../models/user');

const getGrievances = async(req, res) => {
    try {
        //* Check if the authenticated user's ID is available in req.user
        if (!req.user || !req.user.id) {
            return res.status(401).json({ error: "Unauthorized" });
        }
        //* Retrieve the user's ID from req.user
        const userID = req.user.id; 

        //* Find all grievances for this particular user and populate them with their respective user details
        const grievance_data = await Grievance.find({ PostedBy : userID });

        //* display the fetched data
        res.status(200).json({ grievance_data });

    } catch (error) {
        res.status(500).json({
            error: "An error occurred while fetching grievances"
        })
    }
}


const createGrievances = async (req, res) => {
    try {
        
        //* Step 1: retrieve user data from the token
        const { _id } = req.user._id;

        //* step 2: check whether the user exists in the database
        const user = await User.findById( _id ).select('fullname contactNumber studentInfo.rollNo studentInfo.department');

        if (!user) {
            return res.status(404).json({ error: "User not found" });
        }
      
        console.log(user);

        //* Step 3: Destructure the request before saving it to the database
        const grievanceData = req.body;

        // add the fields here
        const { description, selectedGrievance, otherValue } = grievanceData;

        console.log(req.body);

        //* Step 4: create a entry in the database
        try {
            const grievance = new Grievance({
                description,
                selectedGrievance,
                otherValue,
                PostedBy: _id, // Assign the user's _id
                fullname: user.fullname, // Add the selected fields
                contactNumber: user.contactNumber,
                rollNo: user.studentInfo.rollNo,
                department: user.studentInfo.department,
              });
    
              await grievance.save();    //saving the data in database
              console.log("Successfully created a grievance")
    
              //* send response back to client
              res.status(201).json(grievance);
        } catch (error) {
            console.log(error);
            return res
              .status(400)
              .send("Error while submitting the content. Please try again.");
        }

    } catch (error) {
        console.log(error);
        res.status(500).json({
            error: "Internal Server error"
        });
    }
}


module.exports = { getGrievances, createGrievances };