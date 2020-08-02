const omdb = new (require("omdbapi"))("1ccca99a");
const telegraf = require("telegraf");
const express = require("express");
const bp = require("body-parser");

require("dotenv").config();

const bot = new telegraf(process.env.TOKEN);

bot.command("start", ctx => {
  ctx.reply("Hello!");
});

// omdb.search({
//     search: 'fringe'
// }).then(res => console.log(res));

// omdb
//   .get({
//     id: "tt1119644"
//   })
//   .then(res => console.log(res));

const app = new express();
app.use(bp.json());

app.post("/" + process.env.TOKEN, (req, res) => {
  bot.handleUpdate(req.body, res);
});

app.listen(process.env.PORT || 3000);
