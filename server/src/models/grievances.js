const mongoose = require("mongoose");
const { ObjectId } = mongoose.Schema.Types;

const grievanceSchema = new mongoose.Schema({

    //* add valid fields here
    description: { type: String, required: true },
    selectedGrievance : {
        type: String,
        required: true,
        enum: ['Noisy Neighbours', 'Maintenance Issues', 'Security Concerns', 'Roomate Problems', 'Other'],
    },
    otherValue: {
        type: String,
        required: function() {
            return this.selectedGrievance === 'Other';
        },
    },
    PostedBy: {
        type: ObjectId,
        ref: "User",
        select: 'fullname contactNumber studentInfo.rollNo studentInfo.department',
      },
      fullname: String, 
      contactNumber: String, 
      rollNo: Number, 
      department: String,
}, {
    timestamps: true
})

const Grievances = mongoose.model("Grievance", grievanceSchema);

module.exports = Grievances;