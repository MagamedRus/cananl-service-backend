import axios from "axios";
import { JSON_PLACEHOLDER_URL, ROUTE_USERS } from "../constants/server.js";
import usersData from "../db/users.json";

class UserController {
  async #getUserData(userId) {
    let result = null;
    await axios
      .get(`${JSON_PLACEHOLDER_URL}${ROUTE_USERS}/${userId}`)
      .then((res) => {
        result = res.data;
      });

    return result;
  }

  async loginUser(req, res) {
    const body = req.body;
    try {
      const { login, password } = body;
      if (!login || !password) {
        res.status(400).json({ message: "login and password are required!" });
      } else {
        let [user] = usersData.users?.filter((el) => el.login === login);
        if (!user || user.password !== password) {
          res.status(404).json({ message: "Bad auth" });
        } else {
          const userData = await this.#getUserData(user.id);
          if (!userData?.id) {
            res.status(500).json({ message: "User data is not found!" });
          } else {
            res.json({ userData });
          }
        }
      }
    } catch (e) {
      console.log(e);
      res.status(500).json({ message: e });
    }
  }
}

export default UserController;
