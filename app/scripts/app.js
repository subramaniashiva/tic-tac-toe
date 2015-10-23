
var React = window.React = require('react'),
    ReactDOM = require('react-dom'),
    mountNode = document.getElementById("app");

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
      partial = <LeaderBoard players={this.state.players} />
    }
    return (
      <div>
        {partial}
      </div>
      );
  }
});
var TodoApp = React.createClass({
  getInitialState: function() {
    return {items: [], text: ''};
  },
  onChange: function(e) {
    this.setState({text: e.target.value});
  },
  handleSubmit: function(e) {
    e.preventDefault();
    var nextItems = this.state.items.concat([this.state.text]);
    var nextText = '';
    this.setState({items: nextItems, text: nextText});
  },
  render: function() {
    return (
      <div>
        <TicTacToeApp />
      </div>
    );
  }
});


ReactDOM.render(<TodoApp />, mountNode);

