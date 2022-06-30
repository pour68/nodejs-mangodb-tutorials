// const userDb = {
//   users: require("../data/users.json"),
//   setUsers: function (data) {
//     this.users = data;
//   },
// };

const User = require("../models/User");
// const fsPromises = require("fs").promises;
// const path = require("path");
const bcrypt = require("bcrypt");

const HandleUserRegister = async (req, res) => {
  const { username, password } = req.body;
  console.log(username, password);

  if (!username || !password)
    return res
      .status(400)
      .json({ message: "username and password is required." });

  // const duplicate = userDb.users.find((user) => user.username === username);
  const duplicate = await User.findOne({ username }).exec();
  if (duplicate)
    return res.status(400).json({ message: "user already exist." });

  try {
    const hashedPassword = await bcrypt.hash(password, 10);

    const user = {
      username: username,
      password: hashedPassword,
    };

    const result = await User.create(user);

    // userDb.setUsers(JSON.stringify([...userDb.users, user]));

    // await fsPromises.writeFile(
    //   path.join(__dirname, "..", "data", "users.json"),
    //   userDb.users
    // );

    return res.status(201).json({ message: "new user created" });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

module.exports = { HandleUserRegister };
