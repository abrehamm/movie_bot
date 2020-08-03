const omdb = new(require("omdbapi"))("1ccca99a");
const telegraf = require("telegraf");
const express = require("express");
const bp = require("body-parser");
const axios = require("axios");

require("dotenv").config();

let bot;
if (process.env.NODE_ENV == "production") {
    bot = new telegraf(process.env.TOKEN);

    bot.telegram.setWebhook(process.env.WH_URL + process.env.TOKEN);

    const app = new express();
    app.use(bp.json());

    app.post("/" + process.env.TOKEN, (req, res) => {
        bot.handleUpdate(req.body, res);
    });

    app.listen(process.env.PORT || 3000);
} else {
    bot = new telegraf(process.env.TOKEN, {
        polling: true
    });
    bot.launch();
}

bot.command("start", ctx => {
    ctx.reply("Selam!");
});
let type = "";
let result = {};
bot.command("series", ctx => {
    type = "series";
    ctx.reply("Okay, now tell me the title.");
});
bot.command("movie", ctx => {
    type = "movie";
    ctx.reply("Okay, now tell me the title.");
});

bot.on("text", ctx => {
    omdb
        .get({
            title: ctx.message.text,
            type: type,
        })
        .then(res => {
            result = res;
            let info = '';
            let infokw = [
                ['Title', 'title'],
                ['Year', 'year'],
                ['Plot', 'plot'],
                ['IMDb Rating', 'imdbrating']
            ];
            infokw.forEach(element => {
                info += element[0] + ' : ' + result[element[1]] + '\n';
            });
            console.log(res);
            ctx.replyWithPhoto({
                url: result.poster
            }).then(ctx.reply(info));

        })
        .catch(err => {
            console.log(err);
            ctx.reply(err.message);
        });

    //   axios
    //     .get(
    //       `${process.env.OMDbAPI_URL}/?apikey=${process.env.OMDbAPI_KEY}&s=${ctx.message.text}`
    //     )
    //     .then(res => console.log(res))
    //     .catch(err => console.log(err));

    console.log(ctx.message.text);
    console.log(type);

    type = "";
});

// omdb.search({
//     search: 'fringe'
// }).then(res => console.log(res));

// omdb
//   .get({
//     id: "tt1119644"
//   })
//   .then(res => console.log(res));