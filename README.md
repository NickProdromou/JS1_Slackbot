hotkeybot
========

***hotkeybot*** is a Slackbot that allows users to request keyboard shortcuts to programs on different operating systems. At this stage, hotkeybot has one program built in; photoshop for mac and windows. It's more of a proof of concept at the moment.

The idea is that, once I have the basic functionality down, hotkeybot can be extended by adding more programs, and eventually could be come a  useful library and tool for creative teams using slack. I plan to move beyond just design programs too.

Why I built hotkeybot
---
Coming from a design background, I know for a fact that knowing the keyboard shortcuts to common commands can speed up workflow phenomenally.

hotkeybot comes with a large list of commands,and the bot will respond to you if you're doing something wrong. I have done a lot of error handling and made sure that if something goes wrong the user knows exactly why they didn't get the expected output.

***Currently, hotkeybot can respond to the following commands:***

* Type **hello** Welcome the user, and explain what it's purpose is
* Type **help** to show a comprehensive list of commands and how to use them
* Type **programs** to show a list of currently supported programs, which hotkeybot has keys for
* Type **platforms** to show a list of currently supported operating systems (mac or windows)
* Type **platform setup** here you can set the platform
* Type **program setup** Here you can set the program to find keys for
* Type **current commands** hotkeybot will show you what the current commands are for your platform/program combination
* Type **key for ~<command to search for>** to search your current platform/program for the keyboard shortcut of that command. If your query is unsuccessful, hotkeybot will give an example of a correct command, selected randomly from your platform/program configuration. If platform and program aren't set, hotkeybot prompts you to set those before running this particular command.
* type ****program ^platform !<command to search for>*** to do a quick search, this command also sets the program and platform in the process, and then searches that configuration. If there is an error, hotkeybot will advise what you got wrong. An example of how to use this shortcut is  ****photoshop ^mac !zoom in*** The order is important.
* Type **random user** hotkeybot will return a random user from the current team, @mention them, print their real name and show their avatar.

Difficulties/Unresolved issues
------
The most difficult part was conditionally accessing the correct object per the users configuration. The quick search function relies on the command being typed last, If the user uses the quick search function and puts the command anywhere but the final position, hotkeybot will advise the user that the command was not found, and return an example of a command that does work.

Another difficulty was dealing with the data, I had to source the hotkeys from online, place them into a spreadsheet program, and copy them into a separate js file to format them correctly.

The process
---
The first step was to model the data, I wrote pages of how I would structure the project before I wrote a line of code, once I knew how the program should work, I started playing with the functionality of botkit. Once I had the data, I decided how I wanted to use the search function, I didn't initially plan on having something as complex as I did.

Once I started writing the program, I did a lot of testing inside slack, working with responses sent from the bot. This lead me to type the same string over and over ****photoshop ^mac !zoom tool*** which was very tedious. I worked out that since I was working with simple strings, I could automate my testing by using console.log statement... This lead me to A LOT of console.log statements with strings like ("line 54, the variable query contains" + query) just to keep track of where I was. Line by line, I followed the code in my sorting and querying algorithms for 2 days just to work out that what was being returned from interaction with the bot was very different to what I was testing in my console.log statements. So I combined the strategies, taking the strings given to the bot and line-by-line working out what was happening to my data.

Once I worked out the querying functions, and the object iteration, I started writing the helper functions (set the platform, list the available platforms, help dialogue etc)... which were a cakewalk compared to the querying.


Installation instructions
---
Coming soon.
