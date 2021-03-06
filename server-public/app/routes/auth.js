const express = require("express");
const config = require("config");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const router = express.Router();
const path = require("path");
const jwtPrivateKey = config.get("jwtPrivateKey"); //privatekey used for crypting the token that is checked on every page reload
const pass = config.get("password");
const name = config.get("name");
const Authentication = require("../utils/authentication");

const ROOT_DIR = require("../utils/rootDirPath");

tokenValidityTime_inSeconds = 60 * 60;

//check authentication status
router.get("/status", async (req, res) => {
  if (Authentication.validateRequest(req)) {
    res.status(202).send();
  }
  res.status(401).send();
});

router.post("/", async (req, res) => {
  //verify name
  if (!req.body.name || !req.body.password || req.body.name !== name) {
    console.log("Invalid credentials provided [name, password]:", [req.body.name, req.body.password]);
    //run decryption just to delay response to not hint invalid name
    await bcrypt.compare("dummy password to delay response", pass);
    return res.status(400).send("Invalid credentials.");
  }
  //verify password
  const validPassword = await bcrypt.compare(req.body.password, pass);
  if (!validPassword) {
    console.log("Invalid password requested:", req.body.password);
    return res.status(400).send("Invalid credentials.");
  }
  //at this point, user is authenticated:
  const token = jwt.sign({ email: "marek.drabik@protonmail.com" }, jwtPrivateKey, {
    expiresIn: tokenValidityTime_inSeconds,
  }); //sign the token with privatekey
  res.cookie("access_token", token, {
    //send the signed token in the cookie
    secure: true,
    httpOnly: true,
  });

  console.log("User successfully authenticated");

  res.status(202).end();
});

module.exports = router;
