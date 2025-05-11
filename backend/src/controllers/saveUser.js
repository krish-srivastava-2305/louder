import User from "../models/user.model.js";

const saveUser = async (req, res) => {
    try {
        const { name, email } = req.body;

        if (!name || !email) {
            return res.status(400).json({ message: "All fields are required" });
        }

        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(200).json({ message: "User already exists, You can continue" });
        }

        const newUser = new User({ name, email });
        await newUser.save();

        res.status(201).json({ message: "User saved successfully", user: newUser });
        
    } catch (error) {
        console.error("Error saving user:", error);
        res.status(500).json({ message: "Internal server error" });
    }
}

export default saveUser;