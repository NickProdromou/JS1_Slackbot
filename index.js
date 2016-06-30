//require the botkit package
var Botkit = require('botkit');

//initiate the bot via the spawn method
var controller = Botkit.slackbot();
var bot = controller.spawn({
  token: process.env.SLACKBOT_TOKEN
})
bot.startRTM(function(error, whichBot, payload) {
  if (error) {
    throw new Error('Could not connect to Slack');
  }
});



// object to set the state and determine the views
var state = {
  platform : "",
  app : "",
  users : []
}
// a second object to hold hotkeys / help information

//to add: git, sketch, cli for mac, chrome etc etc.
var keys = {
  photoshop : {
      mac : {
              "draw marquee from center" :	"Option-Marquee",
              "add to a selection" :	"Shift",
              "subtract from a selection" :	"Option",
              "intersection with a selection" :	"Shift-Option",
              "make copy of selection" :	"Option-Drag Selection",
              "move selection" :	"Arrow Keys",
              "select all opaque pixels" : "Cmd-Click on Layer Thumbnail (in Layers panel)",
              "restore last selection" :	"Cmd-Shift-D",
              "feather selection" :	"Shift-F6",
              "move marquee while drawing" :	"Hold Space while drawing marquee"
  },
      windows : {}
  }
}


//fetching from the api

bot.api.users.list({},function(err,response) {
  console.log(response.members[0].name)
  var members = response.members
  var keysIn = Object.keys(response.members);
  keysIn.forEach(function(key){
    state.users.push(response.members[key].name);
  })
  console.log(getRandomUser(state.users))
console.log(state.users)
  if (err) {
    console.log("api call failed")
  }
})

//utility functions
function getQuery(string){
  var queryStringUp = string.slice(string.indexOf("!")+1,string.length);
  var queryStringLow = queryStringUp.toLowerCase()
  var program = state.app;
  var os = state.platform;
  if (keys[program][os][queryStringLow]){
      return "when using " + state.app + " on " + state.platform + " the keyboard shortcut to " + queryStringUp +  " is " + "*"+keys[program][os][queryStringLow]+"*"
  }
    return "this command is unknown error"
}





//Listening functions

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

function getRandomUser(arr){
 var randomNum = Math.round(Math.random() * arr.length);
 return arr[randomNum];
}




//Conversation starters
controller.hears(['config'], ['mention'],primaryFunction);

controller.hears(['go'], ['mention'],function(bot,message){
  bot.startConversation(message,function(err,convo) {
    convo.ask('What are you trying to do?',function(response,convo) {
      convo.say(getQuery(response.text));
      convo.next()
    })
  })
});

//I want to !zoom in
//key for !zoom in
//function to get user request
