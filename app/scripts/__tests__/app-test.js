jest.dontMock('../app');

describe('App', function () {
    var React = require('react');
    var ReactDOM = require('react-dom');
    var TestUtils = require('react-addons-test-utils');
    var MyApp = require('../app.js');
    var tictactoe = null;
    
    it('intial players is 2', function () {
        tictactoe = TestUtils.renderIntoDocument(<MyApp.TicTacToeApp />);
        expect(tictactoe.state.players.length).toBe(2);
    });
    it('updates score of players', function() {
        var playersArray = [{win:1, loss:1}, {win:2, loss:2}];
        tictactoe = TestUtils.renderIntoDocument(<MyApp.TicTacToeApp />);
        tictactoe.updateScore(playersArray);
        expect(tictactoe.state.players[0].win).toBe(1);
        expect(tictactoe.state.players[0].loss).toBe(1);
        expect(tictactoe.state.players[1].win).toBe(2);
        expect(tictactoe.state.players[1].loss).toBe(2);
    });
    it('resets the scoreboard', function() {
        var playersArray = [{draw:1}, {draw:2}];
        tictactoe = TestUtils.renderIntoDocument(<MyApp.TicTacToeApp />);
        tictactoe.updateScore(playersArray);
        expect(tictactoe.state.players[0].draw).toBe(1);
        expect(tictactoe.state.players[1].draw).toBe(2);
        tictactoe.resetScoreBoard();
        expect(tictactoe.state.players[0].draw).toBe(0);
        expect(tictactoe.state.players[1].draw).toBe(0);
    });
});