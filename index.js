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

var keys = {
  photoshop : {
      mac : {
              "Draw Marquee from Center" :	"Option-Marquee",
              "Add to a Selection" :	"Shift",
              "Subtract from a Selection" :	"Option",
              "Intersection with a Selection" :	"Shift-Option",
              "Make Copy of Selection" :	"Option-Drag Selection",
              "Move Selection" :	"Arrow Keys",
              "Select all Opaque Pixels" : "Cmd-Click on Layer Thumbnail (in Layers panel)",
              "Restore Last Selection" :	"Cmd-Shift-D",
              "Feather Selection" :	"Shift-F6",
              "Move Marquee while drawing" :	"Hold Space while drawing marquee"
  },
      windows : {}
  }
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


controller.hears(['help'], ['mention'], function(bot,message) {

  // start a conversation to handle this response.
  bot.startConversation(message,function(err,convo) {

    convo.say(
`type this to do that
Then also type this
and this.
but don't type this.`
);
    convo.say('Have a nice day!');

  });
});



controller.hears(['go'], ['mention'],function(bot,message){
  bot.startConversation(message,function(err,convo) {
    convo.ask('what do you wanna do?',function(response,convo) {
      convo.say(getQuery(response.text));
      convo.next()
    })
  })
});


//functions
var primaryFunction = (bot,message) => {
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
        convo.ask("Let me just confirm, you are a " + state.platform + " user and you are using " + state.app +  ". Is this correct?",function(response,convo) {
          if (response.text === "yes" ) {
            convo.say('type go @helperbot to start');
            convo.next()
          } else {
            convo.say("oh, I must have made a mistake, or you did. It was probably you.");
            convo.next();
          }
        });
      });

    });

  })
}





//Conversation starters
controller.hears(['config'], ['mention'],primaryFunction);

controller.hears(['go'], ['mention'],function(bot,message){
  bot.startConversation(message,function(err,convo) {
    convo.ask('What are you trying to do?',function(response,convo) {
      convo.say(`The keyboard shortcut for ${response.text} is ${getQuery(response.text)}`);
      convo.next()
    })
  })
});

//I want to !zoom in
//key for !zoom in
//function to get user request

function getQuery(string){
  var queryString = string.slice(string.indexOf("!")+1,string.length);
  var program = state.app;
  var os = state.platform;
  return keys[program][os][queryString]
}
