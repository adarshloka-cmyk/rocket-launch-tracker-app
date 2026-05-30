// FULL CLEAN WORKING SERVER.JS

const express =
  require("express");

const cors =
  require("cors");

require("dotenv").config({

  path: "./.env",
});

console.log(
  process.env.JWT_SECRET
);

/* =========================
   DATABASE
========================= */

const connectDB =
  require("./config/db");

/* =========================
   ROUTES
========================= */

const authRoutes =
  require("./routes/authRoutes");

/* =========================
   MODELS
========================= */

const User =
  require("./models/User");

/* =========================
   MIDDLEWARE
========================= */

const authMiddleware =
  require(
    "./middleware/authMiddleware"
  );

/* =========================
   APP
========================= */

const app =
  express();

/* =========================
   CONNECT DATABASE
========================= */

connectDB();

/* =========================
   MIDDLEWARE
========================= */

app.use(cors());

app.use(express.json());

/* =========================
   HOME ROUTE
========================= */

app.get("/", (req, res) => {

  res.send(
    "Rocket Launch Backend Running 🚀"
  );

});

/* =========================
   AUTH ROUTES
========================= */

app.use(
  "/api/auth",
  authRoutes
);

/* =========================
   LAUNCHES ROUTE
========================= */

app.get(

  "/api/launches",

  async (req, res) => {

    try {

      const response =
        await fetch(

          "https://ll.thespacedevs.com/2.2.0/launch/upcoming/?limit=50"
        );

      const data =
        await response.json();

      res.json(
        data.results
      );

    } catch (error) {

      console.log(error);

      res.status(500).json({

        message:
          "Failed to fetch launches",
      });

    }

  }
);

/* =========================
   PROFILE ROUTE
========================= */

app.get(

  "/api/profile",

  authMiddleware,

  async (req, res) => {

    try {

      const user =
        await User.findById(
          req.user.id
        ).select("-password");

      res.json(user);

    } catch (error) {

      console.log(error);

      res.status(500).json({

        message:
          "Server Error",
      });

    }

  }
);

/* =========================
   TOGGLE FAVOURITE
========================= */

app.post(

  "/api/favourites/:launchId",

  authMiddleware,

  async (req, res) => {

    try {

      const user =
        await User.findById(
          req.user.id
        );

      const launchId =
        req.params.launchId;

      const alreadyFavourite =
        user.favourites.includes(
          launchId
        );

      /* REMOVE */

      if (alreadyFavourite) {

        user.favourites =
          user.favourites.filter(

            (id) =>
              id !== launchId
          );

        await user.save();

        return res.json({

          message:
            "Removed from favourites",

          favourites:
            user.favourites,
        });

      }

      /* ADD */

      user.favourites.push(
        launchId
      );

      await user.save();

      res.json({

        message:
          "Added to favourites",

        favourites:
          user.favourites,
      });

    } catch (error) {

      console.log(error);

      res.status(500).json({

        message:
          "Server Error",
      });

    }

  }
);

/* =========================
   GET FAVOURITES
========================= */

app.get(

  "/api/favourites",

  authMiddleware,

  async (req, res) => {

    try {

      const user =
        await User.findById(
          req.user.id
        );

      res.json({

        favourites:
          user.favourites,
      });

    } catch (error) {

      console.log(error);

      res.status(500).json({

        message:
          "Server Error",
      });

    }

  }
);

/* =========================
   SERVER
========================= */

const PORT =
  process.env.PORT || 5000;

app.listen(PORT, () => {

  console.log(

    `Server running on port ${PORT}`
  );

});