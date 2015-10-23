Tic Tac Toe in ReactJS
===================

This is an implementation of the popular Tic Tac Toe game in ReactJS. I have taken the following problem statement

 1. It is a 2 player game (no AI)
 2. The app should ask for players' name first before proceeding
 3. The app should have a leaderboard which updates at the end of every round
 4. The user should have options to reset the score board at any time
 
Lets quickly walk through the project.

Setup
-------------

I have used yeoman generator to scaffold the project. I found [this](https://github.com/randylien/generator-react-gulp-browserify) generator to be quite useful.

 - Clone the repo using git clone command
 - Run **npm install && bower install** 
 - Once the above command is successful, run **gulp watch**
 - To run the test cases, run **npm test**
 - Run **gulp build** to generate production code
 - Make sure you have node 0.12.0 and Sass >= 3.4
 
Features
-------------
 - I have Sass to maintain the CSS. To read more about Sass please visit [the official page](http://sass-lang.com/)
 - Used [Bootstrap](http://getbootstrap.com/) for making the site responsive. This game can even be played in devices with a width of 290px and the layout won't break.
 - Though [Modernizr](https://modernizr.com/) - a feature detection library is included, I have not used it much. Will be useful when we want this app to run in older browsers
 - Used Gulp task runner for managing the tasks such as compiling, concatenating files, optimizing resources. You can read more about that [here](http://gulpjs.com/)
 - I have used [Jest](http://facebook.github.io/jest/) for JavaScript unit testing. It is created and maintained by Facebook team.
 - Thought the tic-tac-toe board consists of a 3x3 layout, I have written the logic in a generic way. Just change the variable **MAX_ROWS** in app.js to any other number, you will get a nxn tic-tac-toe board.

Future Improvements
-------------

 - Unit testing is incomplete. Some more cases need to be added to complete the testing.
 - Reset the game in between
 - Have a proper URL structure using History API