import React from 'react'
import ReactDOM from 'react-dom'
import './index.css'

// class Square extends React.Component {
//     render() {
//         return (
//         <button
//             className="square"
//             onClick={() => this.props.onClick()}
//         >
//             {this.props.value}
//         </button>
//         );
//     }
// }

function Square(props) {
    return(
        <button 
            className="square" 
            onClick={props.onClick}>
            {props.value}
        </button>
    );
}
class Board extends React.Component {

    renderSquare(i) {
        return (
            <Square 
                value= {this.props.squares[i]}
                onClick={ () => this.props.onClick(i)}
            />
        );
    }

    render() {
        const drawBoard = () =>{
            let board = []
            let num = 0
            for(let i=0; i<3; i++){
                let row = []
                for (let j = 1; j<=3; j++){
                    row.push(this.renderSquare(num++));                    
                }
                board.push(
                    <div className="board-row">
                        {row}
                    </div>
                );
            }
            return board
        };
        return (
            <div>
                {drawBoard()}                   
            </div>
        );
    }
}
  
class Game extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            history: [{
                squares: Array(9).fill(null),
                coordinate: null,
                active: true,
                moves: 0,
            }],
            stepNumber: 0,
            xIsNext: true,            
        }
    }

    handleClick(i) {
        const history =this.state.history.slice(0, this.state.stepNumber + 1);
        const current = history[history.length - 1];
        const squares = current.squares.slice();
        const winner =calculateWinner(squares);
        if (winner || squares[i]) {
            return;
        }
        clearActive(history);
        squares[i] = this.state.xIsNext ? 'X' : 'O';

        let moves = current.moves;
        moves++;

        this.setState({
            history: history.concat([{ 
                squares: squares,
                coordinate: i,
                active: true,
                moves: moves,
            }]),
            stepNumber: history.length,
            xIsNext: !this.state.xIsNext,
        });
    }

    jumpTo(step) {
        clearActive(this.state.history);
        const history = this.state.history.slice();
        history[step].active = true;
        this.setState({
            history: history,
            stepNumber: step,
            xIsNext: (step%2) === 0, 
        });
    }

    sort() {
        const history = this.state.history.slice();
        this.setState({
            history: history.reverse(),
        });
    }

    render() {
        const history = this.state.history;
        const current = history[this.state.stepNumber];
        const winner = calculateWinner(current.squares);

        // const moves = history.map((step, move) => {
        const moves = history.map( (step, moves) => {
            let desc = step.moves ? 
                'Go to move #' + step.moves + ' ' + getCoordinate(step.coordinate):
                'Go to game start (column, row)';
            return (
                <li key={moves}>
                    <button onClick={ () => this.jumpTo(moves)}>                        
                        {step.active ? <b>{desc}</b> : desc}
                    </button>
                </li>
            );
        });

        let status;
        let drawCurrent = current.squares.slice();
        if (winner) {
            if (winner.tie) {
                status = 'Draw. No one wins.'
            } else {
                status = 'Winner: ' + winner.winner + ' ' + winner.squares;
                console.log(current.squares);
                for(const i in winner.squares){
                    let winnerStyle = { color: 'blue', float: 'right'};
                    drawCurrent[winner.squares[i]] = 
                        <button 
                            style={winnerStyle}
                            className="square" 
                            >
                            {winner.winner}
                        </button>;
                }
            }  
        } else {
            status = 'Next player: ' + (this.state.xIsNext ? 'X' : 'O');
        }

        return (
        <div className="game">
            <div className="game-board">
                <Board                
                    squares={drawCurrent}
                    onClick={ (i) => this.handleClick(i) }
                />
            </div>
            <div className="game-info">
            <div>{ status }</div>             
            <button onClick={ ()=> this.sort()}>Sort</button>
            <ol>{moves}</ol>
            </div>
        </div>
        );
    }
}

function clearActive(history) {
    for (const i in history){
        history[i].active = false;
    }
    return history
}

function getCoordinate(i) {
    let coordinates = {
        0: "(1, 1)",
        1: "(2, 1)",
        2: "(3, 1)",
        3: "(1, 2)",
        4: "(2, 2)",
        5: "(3, 2)",
        6: "(1, 3)",
        7: "(2, 3)",
        8: "(3, 3)",
    }
    return coordinates[i]
}

function calculateWinner(squares) {
    const lines = [
        [0, 1, 2],
        [3, 4, 5],
        [6, 7, 8],
        [0, 3, 6],
        [1, 4, 7],
        [2, 5, 8],
        [0, 4, 8],
        [2, 4, 6],
    ];
    let tie = squares.every( (i)=>{ 
        return i != null;
    });    
    for (let i = 0; i < lines.length; i++) {
        const [a, b, c] = lines[i];
        if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
            return {
                winner: squares[a],
                squares: lines[i],
            };
        }
        if (tie) {
            return {tie: tie} 
        }
    }     
    return null ;
}
// ========================================

ReactDOM.render(
    <Game />,
    document.getElementById('root')
);


  