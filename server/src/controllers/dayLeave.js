const DayLeave = require("../models/dayLeave");
const User = require("../models/user");


// const showData = async (req, res) => {
//   try {
//     const data = await DayLeave.find()
//     res.status(200).json({data})
//   } catch (error) {
//     res.status(500).json({
//       error: "error has occured"
//     });
//   }
// }


const showData = async (req, res) => {
  try {
    // Retrieve and project only the selected fields
    const data = await DayLeave.find({}, {
      // dateOfLeaving: 1,
      timeOfLeaving: 1,
      purpose: 1,
      timeOfReturn: 1,
      fullname: 1,

      // contactNumber: 1,
      // emailID: 1,
      // rollNo: 1,
      department: 1,
    });

    res.status(200).json({ data });
  } catch (error) {
    res.status(500).json({
      error: "Error has occurred",
    });
  }
};



//? Retrieve day leave requests
//? this code will get all the dayleave applications created by the specific user.
const getDayLeave = async (req, res) => {
  try {
    //* Check if the authenticated user's ID is available in req.user
    if (!req.user || !req.user.id) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    //* Retrieve the user's ID from req.user
    const userId = req.user.id;

    //* Use the user's ID to filter day leave applications
    const dayLeave_data = await DayLeave.find({ PostedBy: userId });

    res.status(200).json({ dayLeave_data });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal server error" });
  }
};


// Create day leave requests
const createDayLeave = async (req, res) => {
  try {
    // Extract user information from the token
    const { _id } = req.user; // Assuming user's identity is stored in the "user" property of the request
    console.log("Object ID for the day leave application: ", _id);

    // Fetch user details from the User model
    const user = await User.findById(_id).select(
      'fullname contactNumber emailID studentInfo.rollNo studentInfo.department'
    );

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }
    console.log(user);

    const dayLeaveData = req.body;
    const {
      dateOfLeaving,
      timeOfLeaving,
      purpose,
      timeOfReturn,
    } = dayLeaveData;
    
    const timeOfLeavingDate = new Date(`${dateOfLeaving}T${timeOfLeaving}:00.000Z`);
    const timeOfReturnDate = new Date(`${dateOfLeaving}T${timeOfReturn}:00.000Z`);


    console.log(req.body);
    console.log(dateOfLeaving, timeOfLeavingDate, purpose, timeOfReturnDate);

    // Define and assign values to verified and approvedBy
    const verified = false; // Example value, you can set it based on your logic
    const approvedBy = null; // Example value, after proper implementation some faculty's name will come here.

    try {
      const dayLeave = new DayLeave({
        dateOfLeaving,
        timeOfLeaving: timeOfLeavingDate,
        purpose,
        timeOfReturn: timeOfReturnDate,
        PostedBy: _id, // Assign the user's _id
        fullname: user.fullname, // Add the selected fields
        contactNumber: user.contactNumber,
        emailID: user.emailID,
        rollNo: user.studentInfo.rollNo,
        department: user.studentInfo.department,
        verified,
        approvedBy
      });
      await dayLeave.save(); // Wait for the post to be saved before proceeding
      console.log("Success!");
      return res.json(dayLeave);
    } catch (error) {
      console.log(error);
      return res
        .status(400)
        .send("Error while submitting the content. Please try again.");
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal server error" });
  }
};

module.exports = { getDayLeave, createDayLeave, showData };
