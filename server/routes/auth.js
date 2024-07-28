const router = require("express").Router();
const User = require("../models/user");
const bcrypt = require("bcryptjs");
//SIGN UP
// SIGN UP
router.post('/register', async (req, res) => {
  try {
    const { email, username, password } = req.body;

    // Validate input
    if (!email || !username || !password) {
      return res.status(400).json({ message: 'All fields are required' });
    }

    // Check if the user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(409).json({ message: 'User already exists' });
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashpassword = await bcrypt.hash(password, salt);

    // Create new user
    const user = new User({ email, username, password: hashpassword });
    console.log(user);

    // Save user
    await user.save();
    res.status(201).json({ message: 'Sign Up Successful' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error.message});
  }
});
//SIGN IN

router.post("/signin", async (req, res) => {
  try {
    const user = await User.findOne({ email: req.body.email });
    if (!user) {
      return res
        .status(400)
        .json({ message: "User not found. Please Sign Up First" });
    }

    const isPasswordCorrect = bcrypt.compareSync(
      req.body.password,
      user.password
    );
    if (!isPasswordCorrect) {
      return res.status(400).json({ message: "Password is not correct" });
    }

    const { password, ...others } = user._doc;
    res.status(200).json({ user: others });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

module.exports = router;
