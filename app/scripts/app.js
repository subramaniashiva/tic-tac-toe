
var React = window.React = require('react'),
    ReactDOM = require('react-dom'),
    mountNode = document.getElementById("app");

var Box = React.createClass({
  handleClick: function(){
    this.props.handleClick(this.props.rowIndex);
  },
  render: function(){
    return (
      <div className="tic-button pull-left"
        onClick={this.handleClick}
      >
        {this.props.value}
      </div>
    );
  }
});

var Row = React.createClass({
  handleClick: function(rowIndex){
    this.props.handleClick(this.props.boardIndex, rowIndex);
  },
  render: function(){
    var boxes = this.props.rowValues.map(function(value, index){
      return (
        <Box value={value} key={index} rowIndex={index} handleClick={this.handleClick} />
      );
    }.bind(this));
    return (
      <div>
        {boxes}
      </div>
    );
  }
});

var TicTacBoard = React.createClass({
  getInitialState: function(){
    return {
      clicks: 0,
      boardValues: [
        [' ', ' ', ' '],
        [' ', ' ', ' '],
        [' ', ' ', ' ']
      ],
      nextValue: 'X',
      players: []
    };
  },
  resetBoard: function() {
    var resetBoard = [
        [' ', ' ', ' '],
        [' ', ' ', ' '],
        [' ', ' ', ' ']
      ];
    this.setState({clicks: 0, nextValue: 'X', boardValues : resetBoard});
  },
  updateScore: function() {
    this.props.updateScore(this.state.players);
  },
  handleClick: function(boardIndex, rowIndex) {
    var boardValues = this.state.boardValues;
    var currPlayers = this.state.players;
    if(boardValues[boardIndex][rowIndex] === 'X' || boardValues[boardIndex][rowIndex] === 'O') {
      alert('Not permitted');
    } else {
      var newValue = this.state.nextValue;
      var winner = 'player2';
      boardValues[boardIndex][rowIndex] = newValue;
        this.setState({
          clicks: this.state.clicks + 1,
          boardValues: this.state.boardValues,
          nextValue: this.state.nextValue === 'X' ? 'O' : 'X'
        });
      //this.props.gameStarted = false;
      if(this.checkStatus(boardIndex, rowIndex, newValue)) {
        if(newValue === 'X') {
          winner = 'player1';
          currPlayers[0].win += 1;
          currPlayers[1].loss += 1;
        } else {
          currPlayers[1].win += 1;
          currPlayers[0].loss += 1;
        }
        this.setState({players: currPlayers});
        this.updateScore(this.state.players);
        this.resetBoard();
        alert('gameOver. Winner is ' + winner);
      } else if(this.state.clicks === 8) {
        currPlayers[0].draw += 1;
        currPlayers[1].draw += 1;
        this.setState({players: currPlayers});
        this.updateScore(this.state.players);
        this.resetBoard();
        alert('Match Draw');
      }
    }
  },
  // Checking the borad status and return true if the game is over
  // This logic is independent of the number of squares in the tic tac toe board :)
  checkStatus: function(boardIndex, rowIndex, symbol) {
    var gameOver = false;
    var boardValues = this.state.boardValues;
    var boardLength = boardValues[boardIndex].length;
    var matchCount;
    var checkLeadingDiag = false, checkOtherDiag = false;
    // Check in the same row
    function checkRow() {
      matchCount = 0;
      for(var i = 0; i < boardLength; i++) {
        if((i !== rowIndex) && boardValues[boardIndex][i] === symbol) {
          matchCount++;
        }
      }
      return (matchCount === boardLength - 1);
    }
    // Check in the same column
    function checkColumn() {
      matchCount = 0;
      for(var i = 0; i < boardLength; i++) {
        if((i !== boardIndex) && boardValues[i][rowIndex] === symbol) {
          matchCount++;
        }
      }
      return (matchCount === boardLength - 1);
    }
    // Check in the diagnols
    function checkDiagnols() {
      var i;
      matchCount = 0;
      if((boardIndex + rowIndex)%2 === 0) {
        if(boardIndex + rowIndex === boardLength - 1) {
          checkOtherDiag = true;
          if((boardIndex*2)+1 === boardLength){
            checkLeadingDiag = true;
          }
        } else {
          checkLeadingDiag = true;
        }
      }
      if(checkLeadingDiag) {
        for(i =  0; i < boardLength; i++) {
          if((i !== boardIndex) && boardValues[i][i] === symbol) {
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
          if((i !== boardIndex) && boardValues[i][2-i] === symbol) {
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
        <div  key={index} className="clear-both"><Row rowValues={row} boardIndex={index} handleClick={this.handleClick} /></div>
      )
    }.bind(this));
    return (
      <div>
        {rows}
      </div>
    );
  }
});

var LeaderBoard = React.createClass({
  render: function() {
    var setPlayerInfo = function(player, index) {
      return (
        <div className="clear-both" key={player.id}>
          <div className="pull-left leader-box">{player.name}</div>
          <div className="pull-left leader-box">{player.win}</div>
          <div className="pull-left leader-box">{player.loss}</div>
          <div className="pull-left leader-box">{player.draw}</div>
        </div>);
    }
    return (
      <div>
        <h4>Leader Board</h4>
        <div className="clear-both">
          <div className="pull-left leader-box">Name</div>
          <div className="pull-left leader-box">Wins</div>
          <div className="pull-left leader-box">Losses</div>
          <div className="pull-left leader-box">Draws</div>
        </div>
        {this.props.players.map(setPlayerInfo)}
      </div>
      );
  }
});
var TicTacToeApp = React.createClass({
  getInitialState: function() {
    return {
        players:[{
          id: 1,
          name: "",
          win: 0,
          loss: 0,
          draw: 0
          }, {
          id: 2,
          name: "",
          win: 0,
          loss: 0,
          draw: 0
          }
        ],
        player1Name: "",
        player2Name: "",
        currentPage: "index"
    };
  },
  setPlayer1: function(e) {
    this.setState({player1Name: e.target.value});
  },
  setPlayer2: function(e) {
    this.setState({player2Name: e.target.value});
  },
  handleSubmit: function(e) {
    e.preventDefault();
    if(this.state.player1Name.trim() && this.state.player2Name.trim()) {
      var playersArray = this.state.players;
      playersArray[0].name = this.state.player1Name;
      playersArray[1].name = this.state.player2Name;
      this.setState({players: playersArray, player1Name: "", player2Name: "", currentPage: "game"});
    }
  },
  updateScore: function(playersArray) {
    this.setState({players: playersArray});
  },
  render: function() {
    var partial;
    if(this.state.currentPage === 'index') {
      partial = (<form onSubmit={this.handleSubmit}>
                  <h3>Enter Players name to start playing</h3>
                  <input onChange={this.setPlayer1} value={this.state.player1Name} placeholder="Player1 Name" type="text" required />
                  <input onChange={this.setPlayer2} value={this.state.player2Name} placeholder="Player2 Name" type="text" required />
                  <button>Submit</button>
                </form>);
    } else if(this.state.currentPage === 'game') {
      partial = (<div>
                  <LeaderBoard players={this.state.players} />
                  <TicTacBoard players={this.state.players} updateScore={this.updateScore} />
                </div>)
    }
    return (
      <div>
        {partial}
      </div>
      );
  }
});

ReactDOM.render(<TicTacToeApp />, mountNode);

