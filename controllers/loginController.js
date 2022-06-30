const userDb = {
  users: require("../data/users.json"),
  setUsers: function (data) {
    this.users = data;
  },
};

const User = require("../models/User");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
// const fsPromise = require("fs").promises;
// const path = require("path");

const handleLogin = async (req, res) => {
  const { username, password } = req.body;

  if (!username || !password)
    return res
      .status(400)
      .json({ message: "username and password is required." });

  // const foundedUser = userDb.users.find((user) => user.username === username);

  const foundedUser = await User.findOne({ username }).exec();
  if (!foundedUser) return res.status(401).json({ message: "user not found." });

  const match = await bcrypt.compare(password, foundedUser.password);

  if (match) {
    const roles = Object.values(foundedUser.roles);

    const accessToken = jwt.sign(
      {
        userInfo: {
          username: foundedUser.username,
          roles,
        },
      },
      process.env.ACCESS_TOKEN_SECRET,
      { expiresIn: "30m" }
    );

    const refreshToken = jwt.sign(
      { username: foundedUser.username },
      process.env.REFRESH_TOKEN_SECRET,
      { expiresIn: "1d" }
    );

    // const otherUsers = userDb.users.filter(
    //   (user) => user.username !== foundedUser.username
    // );
    // const currentUser = { ...foundedUser, refreshToken };

    // userDb.setUsers([...otherUsers, currentUser]);

    // await fsPromise.writeFile(
    //   path.join(__dirname, "..", "data", "users.json"),
    //   JSON.stringify(userDb.users)
    // );

    foundedUser.refreshToken = refreshToken;
    const result = await foundedUser.save();

    res.cookie("jwt", refreshToken, {
      httpOnly: true,
      sameSite: "None",
      secure: true,
      maxAge: 24 * 60 * 60 * 1000,
    });

    return res.json({ accessToken });
  } else return res.sendStatus(401);
};

module.exports = { handleLogin };
