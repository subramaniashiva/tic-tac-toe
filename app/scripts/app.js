
var React = window.React = require('react'),
    ReactDOM = require('react-dom'),
    mountNode = document.getElementById("app"),
    MAX_ROWS = 3;

var ticTacArray = [], temp = [];
for(var i = 0; i < MAX_ROWS; i++) {
  temp = [];
  for(var j = 0; j < MAX_ROWS; j++) {
    temp[j] = '';
  }
  ticTacArray.push(temp);
}
var Box = React.createClass({
  handleClick: function(){
    this.props.handleClick(this.props.rowIndex);
  },
  render: function(){
    return (
      <div className="tic-button" onClick={this.handleClick}>
        <span className="tic-value">{this.props.value}</span>
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
      <div className="clear-both tic-row">
        {boxes}
      </div>
    );
  }
});
var TicTacBoard = React.createClass({
  getInitialState: function(){
    var initialArray = JSON.parse(JSON.stringify(ticTacArray));
    return {
      clicks: 0,
      boardValues: initialArray,
      nextValue: 'X',
      players: [],
      currentPlayer: ''
    };
  },
  componentDidMount: function() {
    this.setState({currentPlayer: this.state.players[0].name});
  },
  resetBoard: function() {
    var initialArray = JSON.parse(JSON.stringify(ticTacArray));
    var resetBoard = initialArray;
    var currentPlayerName = this.state.players[0].name;
    this.setState({clicks: 0, nextValue: 'X', boardValues : resetBoard, currentPlayer: currentPlayerName});
  },
  updateScore: function() {
    this.props.updateScore(this.state.players);
  },
  handleClick: function(boardIndex, rowIndex) {
    var currBoardValues = this.state.boardValues;
    var currPlayers = this.state.players;
    if(currBoardValues[boardIndex][rowIndex] === 'X' || currBoardValues[boardIndex][rowIndex] === 'O') {
      alert('Not permitted');
    } else {
      var newValue = this.state.nextValue;
      var winner;
      currBoardValues[boardIndex][rowIndex] = newValue;
      var nextPlayer = this.state.players[(this.state.clicks + 1) % 2].name;
      this.setState({
        clicks: this.state.clicks + 1,
        boardValues: currBoardValues,
        currentPlayer: nextPlayer,
        nextValue: this.state.nextValue === 'X' ? 'O' : 'X'
      });
      if(this.checkStatus(boardIndex, rowIndex, newValue)) {
        if(newValue === 'X') {
          winner = currPlayers[0].name;
          currPlayers[0].win += 1;
          currPlayers[1].loss += 1;
        } else {
          winner = currPlayers[1].name;
          currPlayers[1].win += 1;
          currPlayers[0].loss += 1;
        }
        this.setState({players: currPlayers});
        this.updateScore(this.state.players);
        var me = this;
        window.setTimeout(function() {
           alert('Game Over.\nWinner is ' + winner);
           me.resetBoard();
        }, 100);
        
      } else if(this.state.clicks === (MAX_ROWS*MAX_ROWS)-1) {
        alert('Match Draw');
        currPlayers[0].draw += 1;
        currPlayers[1].draw += 1;
        this.setState({players: currPlayers});
        this.updateScore(this.state.players);
        this.resetBoard();
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
          <Row key={index} rowValues={row} boardIndex={index} handleClick={this.handleClick} />
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
var CurrentPlayer = React.createClass({
  render: function() {
    return (
      <div className="alert alert-info" role="alert">
        <div>Current Player is <strong>{this.props.playerName}</strong>. Symbol for the current player is <strong>{this.props.symbol}</strong></div>
      </div>
      );
  }
});
var LeaderBoard = React.createClass({
  render: function() {
    var setPlayerInfo = function(player, index) {
      return (
        <tr key={player.id}>
          <td>{player.name}</td>
          <td>{player.win}</td>
          <td>{player.loss}</td>
          <td>{player.draw}</td>
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
var playerObj = {
    id: 0,
    name: "",
    win: 0,
    loss: 0,
    draw: 0
  };
var TicTacToeApp = React.createClass({
  getInitialState: function() {
    var player1 = JSON.parse(JSON.stringify(playerObj));
    player1.id = 1;
    var player2 = JSON.parse(JSON.stringify(playerObj));
    player2.id = 2;
    return {
        players:[player1, player2],
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
  resetGame: function() {
    var player1 = JSON.parse(JSON.stringify(playerObj));
    player1.id = 1;
    var player2 = JSON.parse(JSON.stringify(playerObj));
    player2.id = 2;
    this.setState({players: [player1, player2], player1Name: "", player2Name: "", currentPage: "index"});
  },
  resetScoreBoard: function() {
    var player1 = this.state.players[0];
    player1.win = player1.loss = player1.draw = 0;
    var player2 = this.state.players[1];
    player2.win = player2.loss = player2.draw = 0;
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
