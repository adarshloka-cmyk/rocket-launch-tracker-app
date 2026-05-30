const User =
  require("../models/User");

const bcrypt =
  require("bcryptjs");

const jwt =
  require("jsonwebtoken");

/* =========================
   SIGNUP
========================= */

const signup =
  async (req, res) => {

    try {

      const {
        name,
        email,
        password,
      } = req.body;

      const existingUser =
        await User.findOne({
          email,
        });

      if (existingUser) {

        return res.status(400).json({

          message:
            "User already exists",
        });
      }

      const hashedPassword =
        await bcrypt.hash(
          password,
          10
        );

      const newUser =
        new User({

          name,
          email,

          password:
            hashedPassword,
        });

      await newUser.save();

      res.status(201).json({

        message:
          "Signup successful",
      });

    } catch (error) {

      console.log(error);

      res.status(500).json({

        message:
          "Server Error",
      });

    }

  };

/* =========================
   LOGIN
========================= */

const login =
  async (req, res) => {

    try {

      const {
        email,
        password,
      } = req.body;

      const user =
        await User.findOne({
          email,
        });

      if (!user) {

        return res.status(400).json({

          message:
            "User not found",
        });
      }

      const isMatch =
        await bcrypt.compare(

          password,

          user.password
        );

      if (!isMatch) {

        return res.status(400).json({

          message:
            "Invalid password",
        });
      }

const token =
  jwt.sign(

    {
      id: user._id,
    },

    "rocketsecret123",

    {
      expiresIn: "7d",
    }
  );

      res.status(200).json({

        token,

        user: {

          id: user._id,

          name: user.name,

          email: user.email,
        },
      });

    } catch (error) {

      console.log(error);

      res.status(500).json({

        message:
          "Server Error",
      });

    }

  };

module.exports = {

  signup,
  login,
};