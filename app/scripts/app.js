'use strict';
// Using IIFE to create a namespace so that we don't pollute global namespace
(function(MYAPP) {
  // Closure variables that will be used by functions below
  var React = window.React = require('react'),
      ReactDOM = window.React = require('react-dom'),
      mountNode = document.getElementById("app"),
      // change the below value for n*n board
      MAX_ROWS = 3;
  // Initializing the empty arryas which represents the board.
  var ticTacArray = [], temp = [], i, j;
  // Data Structure for a player object
  var playerObj = {
    id: 0,
    name: "",
    win: 0,
    loss: 0,
    draw: 0,
    total: 0
  };
  /*
    A single box in the Tic Tac Toe board where the user clicks
  */
  var Box = React.createClass({
    // When the box is clicked, just pass the index of the box to the parent
    handleClick: function(){
      this.props.handleClick(this.props.columnIndex);
    },
    render: function(){
      return (
        <div className="tic-button" onClick={this.handleClick}>
          <span className="tic-value">{this.props.value}</span>
        </div>
      );
    }
  });
  /*
    A single row in the Tic Tac Toe board.
    This will contain the Box Components as stated above
  */
  var Row = React.createClass({
    // When a box in the row is clicked, pass the row and column index to the parent
    handleClick: function(columnIndex){
      this.props.handleClick(this.props.rowIndex, columnIndex);
    },
    render: function(){
      var boxes = this.props.rowValues.map(function(value, index){
        return (
          <Box value={value} key={index} columnIndex={index} handleClick={this.handleClick} />
        );
      }.bind(this));
      return (
        <div className="clear-both tic-row">
          {boxes}
        </div>
      );
    }
  });
  /*
    An individual box in the Tic Tac Toe board.
    This will contain the Row components as stated above
  */
  var TicTacBoard = React.createClass({
    getInitialState: function() {
      // Deep copy the ticTacArray
      var initialArray = JSON.parse(JSON.stringify(ticTacArray));
      return {
        clicks: 0,
        boardValues: initialArray,
        nextValue: 'X',
        players: [],
        currentPlayer: ''
      };
    },
    // When the component is mounted, set the first player's name
    componentDidMount: function() {
      this.setState({currentPlayer: this.state.players[0].name});
    },
    // This will reset the board and changes the current player to player 1
    resetBoard: function() {
      var initialArray = JSON.parse(JSON.stringify(ticTacArray));
      var resetBoard = initialArray;
      var currentPlayerName = this.state.players[0].name;
      this.setState({clicks: 0, nextValue: 'X', boardValues : resetBoard, currentPlayer: currentPlayerName});
    },
    updateScore: function() {
      this.props.updateScore(this.state.players);
    },
    /*
      On clicking check the status of the game
    */
    handleClick: function(rowIndex, columnIndex) {
      var currBoardValues = this.state.boardValues;
      var currPlayers = this.state.players;
      var newValue, winner, nextPlayer, me;
      // Throw an alert if a user is trying to click the box which has a value already
      if(currBoardValues[rowIndex][columnIndex] === 'X' || currBoardValues[rowIndex][columnIndex] === 'O') {
        alert('Not permitted');
      } else {
        // Store the value for passing it to checking function
        newValue = this.state.nextValue;
        // Update the array which represents the tic tac toe board
        currBoardValues[rowIndex][columnIndex] = newValue;
        nextPlayer = this.state.players[(this.state.clicks + 1) % 2].name;
        // Update the state of the component
        this.setState({
          clicks: this.state.clicks + 1,
          boardValues: currBoardValues,
          currentPlayer: nextPlayer,
          nextValue: this.state.nextValue === 'X' ? 'O' : 'X'
        });
        // Check whether the game is over and update the scores accordingly
        if(this.checkStatus(rowIndex, columnIndex, newValue)) {
          if(newValue === 'X') {
            winner = currPlayers[0].name;
            currPlayers[0].win += 1;
            currPlayers[0].total += 1;
            currPlayers[1].loss += 1;
            currPlayers[1].total -= 1;
          } else {
            winner = currPlayers[1].name;
            currPlayers[1].win += 1;
            currPlayers[1].total += 1;
            currPlayers[0].loss += 1;
            currPlayers[0].total -= 1;
          }
          this.setState({players: currPlayers});
          this.updateScore(this.state.players);
          me = this;
          // Adding a small delay so that the clicking and resetting the box is visible
          window.setTimeout(function() {
             alert('Game Over.\nWinner is ' + winner);
             me.resetBoard();
          }, 200);
          
        } else if(this.state.clicks === (MAX_ROWS*MAX_ROWS)-1) {
          currPlayers[0].draw += 1;
          currPlayers[1].draw += 1;
          this.setState({players: currPlayers});
          this.updateScore(this.state.players);
          me = this;
          window.setTimeout(function() {
             alert('Match Draw');
             me.resetBoard();
          }, 200);
        }
      }
    },
    // Checking the borad status and return true if the game is over
    // This logic is independent of the number of squares in the tic tac toe board :)
    checkStatus: function(rowIndex, columnIndex, symbol) {
      var gameOver = false;
      var boardValues = this.state.boardValues;
      var boardLength = boardValues[rowIndex].length;
      var matchCount, checkLeadingDiag = false, checkOtherDiag = false;
      // Check in the same row
      function checkRow() {
        matchCount = 0;
        for(var i = 0; i < boardLength; i++) {
          if((i !== columnIndex) && boardValues[rowIndex][i] === symbol) {
            matchCount++;
          }
        }
        return (matchCount === boardLength - 1);
      }
      // Check in the same column
      function checkColumn() {
        matchCount = 0;
        for(var i = 0; i < boardLength; i++) {
          if((i !== rowIndex) && boardValues[i][columnIndex] === symbol) {
            matchCount++;
          }
        }
        return (matchCount === boardLength - 1);
      }
      // Check in the diagnols
      function checkDiagnols() {
        var i;
        matchCount = 0;
        if((rowIndex + columnIndex)%2 === 0) {
          if(rowIndex + columnIndex === boardLength - 1) {
            checkOtherDiag = true;
            if((rowIndex*2)+1 === boardLength){
              checkLeadingDiag = true;
            }
          } else {
            checkLeadingDiag = true;
          }
        } else if(rowIndex + columnIndex === boardLength - 1) {
          checkOtherDiag = true;
        } 
        if(checkLeadingDiag) {
          for(i =  0; i < boardLength; i++) {
            if((i !== rowIndex) && boardValues[i][i] === symbol) {
              matchCount++;
            }
          }
          if(matchCount === boardLength - 1) {
            return true;
          }
        }
        matchCount = 0;
        if(checkOtherDiag) {
          for(i = 0; i < boardLength; i++) {
            if((i !== rowIndex) && boardValues[i][boardLength - 1 -i] === symbol) {
              matchCount++;
            }
          }
          if(matchCount === boardLength - 1) {
            return true;
          }
        }
      }
      
      if(checkRow()) {
        return true;
      }
      if(checkColumn()) {
        return true;
      }
      if(checkDiagnols()) {
        return true;
      }
      return gameOver;
    },
    render: function(){
      this.state.players = this.props.players;
      var rows = this.state.boardValues.map(function(row, index){
        return (
            <Row key={index} rowValues={row} rowIndex={index} handleClick={this.handleClick} />
        )
      }.bind(this));
      return (
        <div>
          <CurrentPlayer playerName={this.state.currentPlayer} symbol={this.state.nextValue} />
          <div className="tic-board">
            {rows}
          </div>
        </div>
      );
    }
  });
  /*
    Component for displaying current user's name and his/her symbol
  */
  var CurrentPlayer = React.createClass({
    render: function() {
      return (
        <div className="alert alert-info" role="alert">
          <div>Current player is <strong>{this.props.playerName}</strong>. Symbol for the current player is <strong>{this.props.symbol}</strong></div>
        </div>
        );
    }
  });
  /*
    Leader Board as a individual component
    Displays win, loss, draw and total
  */
  var LeaderBoard = React.createClass({
    render: function() {
      var setPlayerInfo = function(player, index) {
        return (
          <tr key={player.id}>
            <td>{player.name}</td>
            <td>{player.win}</td>
            <td>{player.loss}</td>
            <td>{player.draw}</td>
            <td>{player.total}</td>
          </tr>);
      }
      return (
        <div>
          <h2 className="text-center">Leader Board</h2>
          <div className="table-responsive">
            <table className="table table-hover table-points">
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Wins</th>
                  <th>Losses</th>
                  <th>Draws</th>
                  <th>Total</th>
                </tr>
              </thead>
              <tbody>
                {this.props.players.map(setPlayerInfo)}
              </tbody>
            </table>
          </div>
        </div>
      );
    }
  });
  /*
    The parent component which holds all the above components
  */
  var TicTacToeApp = React.createClass({
    getInitialState: function() {
      var player1 = JSON.parse(JSON.stringify(playerObj));
      var player2 = JSON.parse(JSON.stringify(playerObj));
      player1.id = 1;
      player2.id = 2;
      return {
          players:[player1, player2],
          player1Name: "",
          player2Name: "",
          currentPage: "index"
      };
    },
    componentDidMount: function() {
      // Closures
      var me = this;
      MYAPP.resetComponent = function() {
        me.replaceState(me.getInitialState());
      }
    },
    setPlayer1: function(e) {
      this.setState({player1Name: e.target.value});
    },
    setPlayer2: function(e) {
      this.setState({player2Name: e.target.value});
    },
    handleSubmit: function(e) {
      var playersArray;
      e.preventDefault();
      if(this.state.player1Name.trim() && this.state.player2Name.trim()) {
        playersArray = this.state.players;
        playersArray[0].name = this.state.player1Name;
        playersArray[1].name = this.state.player2Name;
        this.setState({players: playersArray, player1Name: "", player2Name: "", currentPage: "game"});
      }
    },
    updateScore: function(playersArray) {
      this.setState({players: playersArray});
    },
    resetGame: function() {
      this.setState(this.getInitialState());
    },
    resetScoreBoard: function() {
      var player1 = this.state.players[0];
      var player2 = this.state.players[1];
      player1.win = player1.loss = player1.draw = player1.total = 0;
      player2.win = player2.loss = player2.draw = player2.total = 0;
      this.setState({players: [player1, player2]});
      alert('Leader Board is reset. Please continue the game');
    },
    render: function() {
      var partial;
      if(this.state.currentPage === 'index') {
        partial = (<form className="form-inline" onSubmit={this.handleSubmit}>
                    <h1 className="text-center">Want to play Tic Tac Toe?</h1>
                    <h3 className="text-center">Please enter the players name to start playing</h3>
                    <div className="text-center">
                      <div className="form-group">
                        <input className="form-control form-name" onChange={this.setPlayer1} value={this.state.player1Name} placeholder="Player1 Name" type="text" required />
                      </div>
                      <div className="form-group">
                        <input className="form-control form-name" onChange={this.setPlayer2} value={this.state.player2Name} placeholder="Player2 Name" type="text" required />
                      </div>
                      <div className="form-group">
                        <button className="btn btn-success btn-lg">Submit</button>
                      </div>
                    </div>
                  </form>);
      } else if(this.state.currentPage === 'game') {
        partial = (<div>
                    <LeaderBoard players={this.state.players} />
                    <TicTacBoard players={this.state.players} updateScore={this.updateScore} currentPlayer={this.state.players[0].name}/>
                    <div className="text-center">
                      <button onClick={this.resetScoreBoard} className="btn btn-danger btn-reset btn-options">Reset Leader Board</button>
                      <button onClick={this.resetGame} className="btn btn-danger btn-reset btn-options">Change Players</button>
                    </div>
                  </div>);
      }
      return (
        <div>
          {partial}
        </div>
        );
    }
  });
  // Function that needs to be called when the program is starting
  MYAPP.init = function() {
    // On clicking on logo reset the component
    // Effectively it lands on the index page
    var $logo = document.getElementById('logo');
    $logo.addEventListener('click', function() {
      MYAPP.resetComponent();
    });
    for(i = 0; i < MAX_ROWS; i++) {
      temp = [];
      for(j = 0; j < MAX_ROWS; j++) {
        temp[j] = '';
      }
      ticTacArray.push(temp);
    }
    // Render the App
    ReactDOM.render(<TicTacToeApp />, mountNode);
  }

  MYAPP.init();

})(window.MYAPP = window.MYAPP || {});
