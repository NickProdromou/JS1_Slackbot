bot.startConversation(message,function(err,convo) {
  convo.say("Alright, answer the following questions to set me up.")
  convo.ask('What platform are you using?, currently supported platforms are: *' +  state.acceptedStates.platform + '*' ,function(response,convo) {
    if(response.text === "mac") {
     state.platform = "mac";
    }
    else if (response.text === "windows") {
      state.platform = "windows";
    } else {
      convo.say("sorry, I don't support " + response.text + " currently supported programs are: *" + state.acceptedStates.platform + "*")
      convo.repeat();
    }
    convo.next();

    convo.ask("What program are you using? currently supported platforms are: *" +  state.acceptedStates.app + "*" ,function(response,convo) {
      if (response.text !== "photoshop") {
        convo.say('unfortunately, I can\'t help you, becuause nick has only programmed *' + state.acceptedStates.app + '* in at this stage.');
        convo.convo.repeat();
      } else {
        state.app = "photoshop";
        convo.say('Great, we\'re all set up, just type *@helperbot !Command* at any time');
        convo.next();
      }
      convo.stop()
    });
  });
})
