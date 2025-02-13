// api/index.js

const express = require("express");
// Allow communications between front and back end
// Must npm install cors
const cors = require("cors");

const apiRouter = express.Router();

apiRouter.use(
  cors({
    origin: "*",
    methods: ["GET", "POST", "PATCH", "DELETE"],
  })
);

// Allows access to the body of the request req.body
apiRouter.use(express.json());

// set `req.user` if possible
apiRouter.use(async (req, res, next) => {
  const prefix = "Bearer ";
  const auth = req.header("Authorization");

  if (!auth) {
    // nothing to see here
    next();
  } else if (auth.startsWith(prefix)) {
    const token = auth.slice(prefix.length);

    try {
      const { id } = jwt.verify(token, JWT_SECRET);

      if (id) {
        req.user = await getUserById(id);
        next();
      } else {
        next({
          name: "AuthorizationHeaderError",
          message: "Authorization token malformed",
        });
      }
    } catch ({ name, message }) {
      next({ name, message });
    }
  } else {
    next({
      name: "AuthorizationHeaderError",
      message: `Authorization token must start with ${prefix}`,
    });
  }
});

apiRouter.use((req, res, next) => {
  if (req.user) {
    console.log("User is set:", req.user);
  }

  next();
});
const genresRouter = require("./genres");
apiRouter.use("/genres", genresRouter);

const booksRouter = require("./books");
apiRouter.use("/books", booksRouter);

const usersRouter = require("./users");
apiRouter.use("/users", usersRouter);

const commentsRouter = require("./comments");
apiRouter.use("/comments", commentsRouter);

const bookGenresRouter = require("./bookGenres");
apiRouter.use("/bookGenres", bookGenresRouter);

apiRouter.use((error, req, res, next) => {
  res.send(error);
});

module.exports = apiRouter;
