// const userDb = {
//   users: require("../data/users.json"),
//   setUsers: function (data) {
//     this.users = data;
//   },
// };

const User = require("../models/User");
// const fsPromise = require("fs").promises;
// const path = require("path");

const handleLogout = async (req, res) => {
  const cookies = req.cookies;

  if (!cookies?.jwt) return res.sendStatus(204);

  const refreshToken = cookies.jwt;
  // const foundedUser = userDb.users.find(
  //   (user) => user.refreshToken === refreshToken
  // );
  const foundedUser = await User.findOne({ refreshToken }).exec();

  if (!foundedUser) {
    res.clearCookie("jwt", { httpOnly: true, sameSite: "None", secure: true });
    return res.sendStatus(204);
  }

  // delete jwt in db
  // const otherUsers = userDb.users.filter(
  //   (user) => user.refreshToken !== foundedUser.refreshToken
  // );
  // const currentUser = { ...foundedUser, refreshToken: "" };

  // userDb.setUsers([...otherUsers, currentUser]);

  // await fsPromise.writeFile(
  //   path.join(__dirname, "..", "data", "users.json"),
  //   JSON.stringify(userDb.users)
  // );

  foundedUser.refreshToken = "";
  const result = await foundedUser.save();

  res.clearCookie("jwt", { httpOnly: true, maxAge: 24 * 60 * 60 * 1000 });
  return res.sendStatus(204);
};

module.exports = { handleLogout };
