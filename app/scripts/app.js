
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
  checkStatus: function(boardIndex, rowIndex, symbol) {
    var gameOver = false;
    var boardValues = this.state.boardValues;
    if(boardIndex === 0) {
      if(boardValues[1][rowIndex] === symbol && boardValues[2][rowIndex] === symbol) {
        return true;
      }
    } else if(boardIndex === 1) {
      if(boardValues[0][rowIndex] === symbol && boardValues[2][rowIndex] === symbol) {
        return true;
      }

    } else if(boardIndex === 2) {
      if(boardValues[0][rowIndex] === symbol && boardValues[1][rowIndex] === symbol) {
        return true;
      }
    }
    return gameOver;
  },
  render: function(){
    this.state.players = this.props.players;
    var rows = this.state.boardValues.map(function(row, index){
      return (
        <div className="clear-both"><Row key={index} rowValues={row} boardIndex={index} handleClick={this.handleClick} /></div>
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

