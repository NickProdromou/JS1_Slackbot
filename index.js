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


var state = {
  platform : "",
  app : ""
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


controller.hears(['primary function'], ['mention'], function(bot,message) {

  // start a conversation to handle this response.
  bot.startConversation(message,function(err,convo) {

    convo.ask('What platform are you using?',function(response,convo) {

      if(response.text === "mac") {
       convo.say('Ah, a mac user eh? Guess you don\'t like gaming much');
       state.platform = "mac";
       convo.next();
      }
      else if (response.text === "windows") {
        convo.say('Windows user huh?');
        state.platform = "windows";
        convo.next();
      }
      convo.next();

      convo.ask("What program are you using?",function(response,convo) {

        if (response.text !== "photoshop") {
          convo.say('unfortunately, I can\'t help you, becuause nick has only programmed photoshop in at this stage.');state.app = "photoshop";
          convo.next();
        } else {
          convo.say('Great, let\'s get started!');
          state.app = "photoshop";
          convo.next();
        }
        convo.say("Let me just confirm, you are a " + state.platform + " user and you are using " + state.app +  ". Is this correct?");

      });

    });

  })

});
