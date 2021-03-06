// object to set the state and determine the views
var state = {
  acceptedStates : {app : ["photoshop"], platform : ["mac","windows"]},
  platform : "" ,
  app : "",
  users : [],
  userNames: []
}

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




//fetching from the api

bot.api.users.list({},function(err,response) {
  state.users = response.members
  var keysIn = Object.keys(state.users);
  //create array from user names
  for (i=0 ;i<response.members.length;i++) {
      state.userNames.push(response.members[i].name)
  }
  if (err) {
    console.log("api call failed")
  }
})



//utility functions


function getState(string) {
  var arr = string.split(" ");
  if (setState(arr,"^","platform") && setState(arr,"*","app") ) {
    return getQuery(string);
  } else {
    return "There was an error in the operation\n Please check you have defined a value for ^platform and *application\n type: `@hotkeybot help` to see a list of commands " ;
  }
}

function setState(arr,selector,key){
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
      return "when using " + state.app + " on " + state.platform + " the keyboard shortcut to " + queryStringUp +  " is " + "`"+location[queryStringLow]+"`";
  }
    return "the command _" + queryStringLow + "_ is undefined \n an example of a valid command in *" + state.app + "* on *" + state.platform + "* is *"+ getRandomArray(keysInLocation) + "*" ;
}

function getQueryTwo(string){
  var queryStringUp = string.slice(string.indexOf("~")+1,string.length);
  var queryStringLow = queryStringUp.toLowerCase()
  var program = state.app.toString();
  var os = state.platform.toString();
  var location = keys[program][os];
  var keysInLocation = Object.keys(location);
  if (location[queryStringLow] !== undefined){
      return "when using " + state.app + " on " + state.platform + " the keyboard shortcut to " + queryStringUp +  " is " + "`"+location[queryStringLow]+"`";
  }
    return "the command _" + queryStringLow + "_ is undefined \n an example of a valid command in *" + state.app + "* on *" + state.platform + "* is *"+ getRandomArray(keysInLocation) + "*" ;
}

function getRandomArray(arr){
 var randomNum = Math.round(Math.random() * arr.length);
 return arr[randomNum];
}

function getRandomUser(arr){
 var randomNum = Math.round(Math.random() * arr.length);
 var messageString = arr[randomNum]["id"]
 var messageName = arr[randomNum]["real_name"]
 var userAvatar = arr[randomNum]["profile"]["image_72"]
 return "the user's id is <@" + messageString + "> \n the users name is *" + messageName + "* \n And their profile picture is \n" + userAvatar ;
 ;
}



//Callbacks

var welcomeUser = (whichBot, message) => {
  whichBot.reply(message,"Hello, I am *hotkeybot*. \n Here for all your keyboard shortcut needs \n type `@hotkeybot help` to see my commands.");
}

var helpDialogue = (bot,message) => {
  bot.startConversation(message,function(err,convo) {
    var buildHelpString = "*Here are list of my commands* ```just type @hotkeybot and your command to use them when you want me!``` "
    buildHelpString += "type `hello` to see my welcome message \n"
    buildHelpString += "type `help` to see this message again \n"
    buildHelpString += "type `platforms` to see a list of currently supported operating systems \n"
    buildHelpString += "type `platform setup` to set the platform \n"
    buildHelpString += "type `program setup` to set the current program to search keys for \n"
    buildHelpString += "type `programs` to see a list of currently supported programs\n"
    buildHelpString += "type `current commands` to see a list of the current commands for your selected Platform and Program configuration\n"
    buildHelpString += "*how to find keys* \n"
    buildHelpString += "once you've set default platform and program, type `key for ~command query` to search for a command, ie: `key for ~zoom tool`"
    buildHelpString += "*advanced use* \n"
    buildHelpString += "to set the platform and program, and search for keys in one command type `*program ^platform !command query`\n"
    buildHelpString += "Example: `*photoshop ^mac !shape tool`"
    convo.say(buildHelpString);
    convo.say('To see this list again, just type "help" and mention me!');
  });
}

var setPlatform = (bot,message) => {
  bot.startConversation(message,function(err,convo) {

    convo.ask('What platform are you currently using',function(response,convo) {
      if (state.acceptedStates.platform.indexOf(response.text) !== -1) {
          state.platform = response.text;
          convo.say("okay, your platform has been set to " + state["platform"]);
          convo.next();
      } else {
        convo.say("Sorry, " + response.text + "is not in my supported platforms, try one of these instead *" + state.acceptedStates.platform + "*")
        convo.next();
        convo.repeat();
    };
  })
})
}

var setProgram = (bot,message) => {
  bot.startConversation(message,function(err,convo) {
    convo.ask('What program do you want to set as default?',function(response,convo) {
      if (state.acceptedStates.app.indexOf(response.text) !== -1) {
          state.app = response.text;
          convo.say("okay, your platform has been set to " + state["app"]);
          convo.next();
      } else {
        convo.say("Sorry, " + response.text + " is not in my programs, try one of these instead *" + state.acceptedStates.app + "*")
        convo.next();
        convo.repeat();
    };
  })
})
}

var currentApp = (whichBot,message) => {
  whichBot.reply(message,"Platform is set to *" + state.app + "*")
}

var currentPlatform = (whichBot,message) => {
  whichBot.reply(message,"Platform is set to *" + state.platform + "*")
}

var shortCut = (whichBot, message) => {
  whichBot.reply(message,getState(message.text));
}

var tryAgain = (whichBot,message) => {
  whichBot.reply(message,"_Sorry I don't recognize that command._ \n try typing `@hotkeybot help` to see what I can do!")
}

var supportedApps = (whichBot,message) => {
  whichBot.reply(message,"currently the programs I have keys for are: *" +  state.acceptedStates.app+"*")
}


var supportedOs = (whichBot,message) => {
  whichBot.reply(message,"currently the platforms I have keys for are: *" +  state.acceptedStates.platform+"*")
}

var commandsFor = (whichBot,message) => {
  if(state.app && state.platform){
  whichBot.reply(message,"the commands for *" + state.app + "* are   ```" + Object.keys(keys[state.app][state.platform])+ "```")
  }
  whichBot.reply(message,"You haven't set either a platform or program yet. type `platform setup` and `program setup` before running `current commands`")
}

var hotKeyFor = (whichBot,message) => {
  if(state.app && state.platform){
    whichBot.reply(message,getQueryTwo(message.text))
  } else {
      whichBot.reply(message,"You haven't set either a platform or program yet. type `platform setup` and `program setup` before running `key for`")
  }

}

var randomUser = (whichBot,message) => {

  whichBot.reply(message,"_Picking a random user..._")
  setTimeout(function(){
      whichBot.reply(message, getRandomUser(state.users))
  },2000)

}


//Conversation starters
controller.hears(['hello','hey','hi','ahoy hoy','papahotkeys'],['mention','direct_mention'],welcomeUser);
controller.hears(['help'], ['mention','direct_mention'],helpDialogue);
controller.hears(['programs'],['mention','direct_mention'],supportedApps);
controller.hears(['platforms'],['mention','direct_mention'],supportedOs)
controller.hears(['platform setup','setup platform','os setup','set os','setup os'], ['mention'],setPlatform);
controller.hears(['program setup','app setup','setup program','setup app'], ['mention'],setProgram);
controller.hears(['current program','current app',],['mention','direct_mention'],currentApp);
controller.hears(['current platform','current os'],['mention','direct_mention'],currentPlatform);
controller.hears(['current commands'],['mention','direct_mention'],commandsFor);
controller.hears(['random user'],['mention','direct_mention'],randomUser)
controller.hears(['key for'] && ["~"],['direct_mention','ambient'],hotKeyFor)
controller.hears( ["^"] && ["*"] && ['!'] , ['ambient','direct_mention'], shortCut);
controller.hears([""],['mention','direct_mention'],tryAgain)
