const express = require("express");
const app = express();
const axios = require("axios");
const qs = require("qs");
const path = require("path");
const ejsMate = require("ejs-mate");
const port = process.env.PORT || 8080;
const fs = require("fs");
const bodyParser = require("body-parser");

app.engine("ejs", ejsMate);
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.static(path.join(__dirname, "public")));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.get("/", (req, res) => {
  body = [];
  a = [];
  c = [];
  res.render("index", { body, a, c });
});

app.post("/", (req, res) => {
  const body = req.body.form.body;
  const lang = req.body.form.language;
  const input = req.body.form.input;
  console.log(req.body);
  const data = qs.stringify({
    code: body,
    language: lang,
    input: "",
  });

  const config = {
    method: "post",
    url: "https://codex-api.herokuapp.com/",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
    data: data,
  };
  axios(config)
    .then(function (response) {
      a = JSON.stringify(response.data);

      b = JSON.parse(JSON.stringify(response.data));
      if (!b.error) {
        c = b.output;
        res.render("index", { body, lang, input, a, b, c });
      } else {
        c = b.error;
        res.render("index", { body, lang, input, a, b, c });
      }
    })
    .catch(function (error) {
      console.log(error);
    });
});

app.listen(port, () => {
  console.log(`listening on ${port}`);
});
