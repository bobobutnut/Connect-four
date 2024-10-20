window.addEventListener("DOMContentLoaded", start);

function start(){
  alert("Joy and Sadness are competing against each other to turn Riley's memory orbs into their respective emotions and colours. Choose your side and help them now!")
}

// #2. Make Connect4 as a class and create game functions.
// KP: Game Functions Setup
class Connect4{

  // #3. Set up initial game settings.
  // KP: Event Listeners
  constructor(selector){
    this.rows = 6;
    this.cols = 7;
    this.player = "Joy";
    this.selector = selector;
    this.isGameOver = false;
    this.onPlayerMove = function(){};
    this.createGrid();
    this.setupEventListeners();
  }

  // #4. Create the Connect4 grids using loops.
  createGrid(){
    const $board = $(this.selector);
    $board.empty();
    this.isGameOver = false;
    this.player = "Joy";
    for (let row = 0; row < this.rows; row++){
      const $row = $("<div>")
        .addClass("row");
      for (let col = 0; col < this.cols; col++){
        const $col = $("<div>")
          .addClass("col empty")
          .attr("data-col", col)
          .attr("data-row", row);
        $row.append($col);
      }
      $board.append($row);
    }
  }

  setupEventListeners(){
    const $board = $(this.selector);
    const that = this;

    function findLastEmptyCell(col){
      const cells = $(`.col[data-col='${col}']`);
      for (let i = cells.length - 1; i >= 0; i--){
        const $cell = $(cells[i]);
        if ($cell.hasClass("empty")){
          return $cell;
           }
      }
      return null;
    }

    $board.on("mouseenter", ".col.empty", function(){
      if (that.isGameOver) return;
      const col = $(this).data("col");
      const $lastEmptyCell = findLastEmptyCell(col);
      $lastEmptyCell.addClass(`next-${that.player}`);
    });

    $board.on("mouseleave", ".col", function(){
      $(".col").removeClass(`next-${that.player}`);
    });

    $board.on("click", ".col.empty", function(){
      if (that.isGameOver) return;
      const col = $(this).data("col")
      const $lastEmptyCell = findLastEmptyCell(col)
      $lastEmptyCell.removeClass(`empty next-${that.player}`);
      $lastEmptyCell.addClass(that.player);
      $lastEmptyCell.data("player", that.player);

      const winner = that.checkForWinner(
        $lastEmptyCell.data("row"),
        $lastEmptyCell.data("col")
        )
      if (winner){
        that.isGameOver = true;
        alert(`Game over! ${that.player} has won this round!`);
        $(".col.empty").removeClass("empty");
        return;
      }

      that.player = (that.player === "Joy") ? "Sadness" : "Joy";
      that.onPlayerMove();
      $(this).trigger("mouseenter");
    });
  }
  checkForWinner(row, col){
    const that = this;

    function $getCell(i, j){
      return $(`.col[data-row="${i}"][data-col="${j}"]`);
    }

    function checkDirection(direction){
      let total = 0;
      let i = row +direction.i;
      let j = col +direction.j;
      let $next = $getCell(i, j);
      while (i >= 0 && i < that.rows && j >= 0 && j <that.cols &&
        $next.data("player") === that.player) {
        total++;
      i += direction.i;
      j += direction.j;
      $next = $getCell(i,j);
      }
      return total;
    }
    function Checkwin(directionA, directionB){
      const total = 1 + checkDirection(directionA) + checkDirection(directionB);
      if (total >= 4) {
        return that.player;
      }else{
          return null;
        }
      }
    function checkDiagnalBLtoTR(){
       return Checkwin ({i:-1, j:1}, {i:1, j:-1})
    }
    function checkDiagnalTLtoBR(){
      return Checkwin ({i:1, j:1}, {i:-1, j:-1})
    }
    function checkVerticals(){
      return Checkwin({i:-1, j:0}, {i:1, j:0});
    }
    function checkHorizontals(){
       return Checkwin({i:0, j:-1}, {i:0, j:1});
    }

    return checkDiagnalTLtoBR() || checkHorizontals() || checkVerticals() || checkDiagnalBLtoTR();
  }
  restart(){
    this.onPlayerMove();
    this.createGrid();

  }
}



$(document).ready(function(){
  const connect4 = new Connect4("#connect4")
  connect4.onPlayerMove = function(){
     $("#player").text(connect4.player);

  }
  $("#zrestart").click(function(){
    connect4.restart();
  });
})