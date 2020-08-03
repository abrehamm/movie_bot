const omdb = new(require("omdbapi"))("1ccca99a");
const telegraf = require("telegraf");
const express = require("express");
const bp = require("body-parser");
const axios = require("axios");
const markup = require('telegraf/extra').markdown();

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

let help_msg = `Selam selam! 

Send me
*/movie* - to search for movies
*/series* - to search for series

Then I'll ask you for the *title* & you'll send me the *exact* title. Easy.`;

bot.command("start", ctx => {
    ctx.reply(help_msg, markup);
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
            info = `*${result.title}*
*Year:* ${result.year}
*Rated: ${result.rated}*
*Genre:* ${Object.values(result.genre).toString()}
*Actors:* ${Object.values(result.actors).toString()}
*Director:* ${Object.values(result.director).toString()}

*Plot:* _${result.plot}_
            
*IMDb Rating: ${result.imdbrating}*`;

            if (result.type == "series") {
                info += `
*Seasons: ${result.totalseasons}*`;
            }
            // let infokw = [
            //     ['Title', 'title'],
            //     ['Year', 'year'],
            //     ['Plot', 'plot'],
            //     ['IMDb Rating', 'imdbrating']
            // ];
            // infokw.forEach(element => {
            //     info += element[0] + ' : ' + result[element[1]] + '\n';
            // });
            console.log(res);
            ctx.replyWithPhoto({
                url: result.poster
            }).then(ctx.reply(info, markup));

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