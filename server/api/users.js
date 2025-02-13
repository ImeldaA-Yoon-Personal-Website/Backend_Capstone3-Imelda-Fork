const express = require("express");
const usersRouter = express.Router();

const {
  getAllUsers,
  createUser,
  getUserById,
  updateUser,
  deleteUserById,
} = require("../db");

/*
        name VARCHAR(100) NOT NULL,
        email VARCHAR(100) UNIQUE NOT NULL,
        username VARCHAR(50) UNIQUE NOT NULL,
        password VARCHAR(50) NOT NULL,
        status VARCHAR(20),
*/
usersRouter.post("/", async (req, res, next) => {
  const { name, email, username, password, status } = req.body;

  const userData = {};

  try {
    userData.name = name;
    userData.email = email;
    userData.username = username;
    userData.password = password;
    userData.status = status;

    console.log(`Trying to createUser ${userData}`);

    const user = await createUser(userData);

    if (user) {
      res.send(user);
    } else {
      next({
        name: "userCreationError",
        message:
          "There was an error creating your user. Please try again. Possibly user's name or email are not unique or pre-existing",
      });
    }
  } catch ({ name, message }) {
    next({ name, message });
  }
});

usersRouter.get("/", async (req, res, next) => {
  try {
    const allUsers = await getAllUsers();

    res.send({
      allUsers,
    });
  } catch ({ name, message }) {
    next({ name, message });
  }
});

usersRouter.get("/:id", async (req, res, next) => {
  const { id } = req.params;

  try {
    const user = await getUserById(id);

    res.send({ user });
  } catch ({ name, message }) {
    next({ name, message });
  }
});

usersRouter.patch("/:id", async (req, res, next) => {
  const { id } = req.params;
  const { name, email, username, password, status } = req.body;

  try {
    const updatedUser = await updateUser(
      id,
      name,
      email,
      username,
      password,
      status
    );

    res.send({ user: updatedUser });
  } catch ({ name, message }) {
    console.error({ name, message });
    next({ name, message });
  }
});

usersRouter.delete("/:id", async (req, res, next) => {
  try {
    const { id } = req.params;
    const user = await deleteUserById(id);

    if (!user) {
      next({
        name: "NotFound",
        message: `Cannot find user with ID ${user_id} to delete.`,
      });
    } else {
      res.send({ success: true, user });
    }
  } catch ({ name, message }) {
    next({ name, message });
  }
});

module.exports = usersRouter;


