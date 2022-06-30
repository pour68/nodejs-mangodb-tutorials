// const userDb = {
//   users: require("../data/users.json"),
//   setUsers: function (data) {
//     this.users = data;
//   },
// };

const User = require("../models/User");
const jwt = require("jsonwebtoken");

const handleRefreshToken = async (req, res) => {
  const cookies = req.cookies;

  if (!cookies?.jwt) return res.sendStatus(401);

  const refreshToken = cookies.jwt;
  // const foundedUser = userDb.users.find(
  //   (user) => user.refreshToken === refreshToken
  // );

  const foundedUser = await User.findOne({ refreshToken }).exec();

  if (!foundedUser) return res.sendStatus(403);

  jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET, (err, decoded) => {
    if (err || foundedUser.username !== decoded.username)
      return res.sendStatus(403);

    const roles = Object.values(foundedUser.roles);
    const accessToken = jwt.sign(
      {
        userInfo: {
          username: decoded.username,
          roles,
        },
      },
      process.env.ACCESS_TOKEN_SECRET,
      { expiresIn: "30m" }
    );

    return res.json({ accessToken });
  });
};

module.exports = { handleRefreshToken };
