// object to set the state and determine the views
var state = {
  acceptedStates : {app : ["photoshop"], platform : ["mac","windows"]},
  platform : "" ,
  app : "",
  users : []
}

// state.app = "photoshop";
// state.platform = "mac";

// a second object to hold hotkeys / help information
var keys = {
  photoshop : {
    mac : {
      "start help" : "Help key",
      "Undo" : "Command + Z",
      "redo" :	"Command + Y",
      "cut" :	"Command + X",
      "copy" :	"Command + C",
      "paste" :	"Command + V",
      "show/hide brush panel" :	"F5",
      "color panel" :	"F6",
      "layers panel" :	"F7",
      "info panel" :	"F8",
      "actions panel" :	"Option + F9",
      "revert" :	"F12",
      "fill" :	"Shift + F5",
      "feather selection" :	"Shift + F6",
      "inverse selection" :	"Command + Shift + I",
      "move tool"	: "V",
      "marquee tool" :	"M",
      "lasso tool" :	"L",
      "magic wand" :	"W",
      "crop tool" :	"C",
      "eyedropper tool" :	"I",
      "spot healing" :	"J",
      "brush tool"	:"B",
      "clone stamp tool" :	"S",
      "history brush tool" :	"Y",
      "eraser tool" :	"E",
      "gradient tool" :	"G",
      "dodge tool" :	"O",
      "pen tool" : "P",
      "type tool" :	"T",
      "direct selection tool" :	"A",
      "shape tool" :	"U",
      "hand tool" :	"H",
      "rotate View tool" :	"R",
      "zoom tool" :	"Z"
          },
    windows : {
      "start help" : "F1",
      "undo" : "Ctrl + Z",
      "redo" : "Ctrl + Y",
      "cut" : "Ctrl + X",
      "copy" : "Ctrl + C",
      "paste" : "Ctrl + V",
      "show/hide brush panel" : "F5",
      "color panel" : "F6",
      "layers panel" : "F7",
      "info panel" : "F8",
      "actions panel" : "F9",
      "revert" : "F12",
      "fill" : "Shift + F5",
      "feather selection"	:	"Shift + F6",
      "inverse selection"	:	"Ctrl + Shift + I",
      "move tool"	:	"V",
      "marquee tool"	:	"M",
      "lasso tool"	:	"L",
      "magic wand"	:	"W",
      "crop tool"	:	"C",
      "eyedropper tool"	:	"I",
      "spot healing"	:	"J",
      "brush tool"	:	"B",
      "clone stamp tool"	:	"S",
      "history brush tool"	:	"Y",
      "eraser tool"	:	"E",
      "gradient tool"	:	"G",
      "dodge tool"	:	"O",
      "pen tool"	:	"P",
      "type tool"	:	"T",
      "direct selection tool"	:	"A",
      "shape tool"	:	"U",
      "hand tool"	:	"H",
      "rotate view tool"	:	"R",
      "zoom tool"	:	"Z"
    }
  }
}


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



//
// //fetching from the api
//
// bot.api.users.list({},function(err,response) {
//   console.log(response.members[0].name)
//   var members = response.members
//   var keysIn = Object.keys(response.members);
//   keysIn.forEach(function(key){
//     state.users.push(response.members[key].name);
//   })
// console.log(getRandomUser(state.users))
// console.log(state.users)
//   if (err) {
//     console.log("api call failed")
//   }
// })
//


//utility functions
getState("*photoshop ^mac !magic wand");

function getState(string) {
  var arr = string.split(" ");
  if (setState(arr,"^","platform") && setState(arr,"*","app") ) {
    return getQuery(string);
  } else {
    return "There was an error in the operation\nPlease check you have defined a value for ^platform and *application\n type: ```?help``` to see a list of commands " ;
  }
}

function setState(arr,selector,key){
  console.log(arr, selector, key)
  var query = arr.filter(function(val){
    return val[0] === selector;
  });

  var arrayToString = query.join();
  var newState = arrayToString.slice(1,arrayToString.length);
  var finalQuery = newState.toLowerCase();
  var queryString = finalQuery.toString();
    if (state.acceptedStates[key].indexOf(queryString) !== -1) {
        state[key] = queryString;
        return true;
    } else {
      return false;
    }
}

function getQuery(string){
  var queryStringUp = string.slice(string.indexOf("!")+1,string.length);
  var queryStringLow = queryStringUp.toLowerCase()
  var program = state.app.toString();
  var os = state.platform.toString();
  var location = keys[program][os];
  var keysInLocation = Object.keys(location);
  if (location[queryStringLow] !== undefined){
      return "when using " + state.app + " on " + state.platform + " the keyboard shortcut to " + queryStringUp +  " is " + "*"+location[queryStringLow]+"*";
  }
    return "the command _" + queryStringLow + "_ is undefined \n an example of a valid command in *" + state.app + "* on *" + state.platform + "* is *"+ getRandomUser(keysInLocation) + "*" ;
}

function getRandomUser(arr){

 var randomNum = Math.round(Math.random() * arr.length);
 return arr[randomNum];
}





//Listening functions

var helpDialogue = (bot,message) => {
  bot.startConversation(message,function(err,convo) {
    convo.say(
`type this to do that
Then also type this
and this.
but don't type this.`
);
    convo.say('To see this list again, just type "help" and mention me!');
  });
}

//response functions
var runSetup = (bot,message) => {
  bot.startConversation(message,function(err,convo) {
    convo.ask('What platform are you using?',function(response,convo) {
      if(response.text === "mac") {
       state.platform = "mac";
       convo.next();
      }
      else if (response.text === "windows") {
        state.platform = "windows";
        convo.next();
      }
      convo.next();
      convo.ask("What program are you using?",function(response,convo) {
        if (response.text !== "photoshop") {
          convo.say('unfortunately, I can\'t help you, becuause nick has only programmed photoshop in at this stage.');
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

var shortCut = (whichBot, message) => {
  whichBot.reply(message,getState(message.text));
}

var welcomeUser = (whichBot, message) => {
  whichBot.reply(message,"Hello, I am a bot");
}

var tryAgain = (whichBot,message) => {
  whichBot.reply(message,"Did you mention me? I don't recognize that command. \n try typing @helperbot help to see what I can do!")
}

//Conversation starters
controller.hears(['hello','hey','hi','ahoy hoy','papahotkeys'],['mention','direct_mention'],welcomeUser)
controller.hears(['help'], ['mention','direct_mention'],helpDialogue)
controller.hears(['config'], ['mention'],runSetup);
controller.hears( ["^"] && ["*"] && ['!'] , ['ambient','direct_mention'], shortCut);
controller.hears([""],['mention','direct_mention'],tryAgain)
