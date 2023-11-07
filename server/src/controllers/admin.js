const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const Admin = require("../models/admin");


//? creating an admin user
const registerAdmin = async (req, res) => {
    try {
        //* destructure the fields from req.body
        const { username, password } = req.body

        //* check if any fields are missing
        if (!username || !password) {
        return res.status(400).send({ msg: "Please fill all fields" });
        }

        //* hash the password
        const hashedPassword = await bcrypt.hash(password, 10);

        //* create the user record in the database
        const admin_generation = await Admin.create({
            username,
            password: hashedPassword
        });

        if (admin_generation) {
            console.log("admin created successfully!");
            res.status(201).json({
                msg:"Admin Created Successfully!",
                data:{
                    id : admin_generation._id,
                    username : admin_generation.username,
                    password : admin_generation.password
                }
            });
        } else {
            res.status(400)
        }
    } catch (error) {
        console.log('Error: ', error);
    }
}

//? logging in with the admin user
const loginAdmin = async (req, res) => {
    try {
        //* destructure data from the req.body
        const { username, password } = req.body;

        //* check if the fields are provided
        if(!username || !password) {
            res.status(400)
            throw new Error("All fields are mandatory");
        }

        //* check if the user is present in the database
        const adminUser = await Admin.findOne({ username });

        //* compare the password provided with the hashed password
        if (adminUser && (await bcrypt.compare(password, adminUser.password))) {
            //* generate a token for the user and send it as response
            const accesstoken = jwt.sign({ 
                _id: adminUser._id 
            }, 
            process.env.JWT_SECRET,
            { expiresIn: "7d" }
            );

            //* respond with the token
            res.status(200).json({
                message: 'Logged In',
                token: accesstoken
            })
        } else {
            res.status(401)     //401 for unauthorized
            throw new Error("Invalid Credentials")
        }

    } catch (error) {
        console.log("Error", error)
    }
}

const currentAdmin = async (req, res) => {
    try {
      const currentAdminData = req.user;
      res.status(200).json(currentAdminData);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Internal server error' });
    }
  }

module.exports = { registerAdmin, loginAdmin, currentAdmin };