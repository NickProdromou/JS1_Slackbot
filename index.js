/**
 * Your slackbot token is available as the global variable:

process.env.SLACKBOT_TOKEN

 * When deployed to now.sh, the URL of your application is available as the
 * global variable:

process.env.NOW_URL

 * The URL is useful for advanced use cases such as setting up an Outgoing
 * webhook:
 * https://github.com/howdyai/botkit/blob/master/readme-slack.md#outgoing-webhooks-and-slash-commands
 *
 */
var Botkit = require('botkit');


var Os = {
  windows : "windows",
  mac : "mac"
}



var controller = Botkit.slackbot();
var bot = controller.spawn({
  token: process.env.SLACKBOT_TOKEN
})
bot.startRTM(function(error, whichBot, payload) {
  if (error) {
    throw new Error('Could not connect to Slack');
  }
});


controller.hears(['question me'],['direct_message','direct_mention','mention','ambient'],function(bot,message) {

  // start a conversation to handle this response.
  bot.startConversation(message,function(err,convo) {

    convo.ask('Windows or mac?',function(response,convo) {
  // say a different thing based on user response
      if (response.text = Os.windows ) {
        convo.say("okay, windows user eh?")
      } else if (response.text = Os.mac ) {
        convo.say("alright, we have a mac user")
      } else {
        convo.say("sorry" + response.text + "isn't known to me yet")
      }

    });

  })

});




controller.hears(['hello'], ['mention'], function(whichBot, message) {
  whichBot.reply(message, 'Hello, I am hotkey bot, I can tell you shortcuts for your programs \n'
  + "Just tell me if you are using if you are using *OSX* or *WINDOWS* and we can get started" + Os.mac);


});
