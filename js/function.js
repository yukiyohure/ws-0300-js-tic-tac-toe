// 関数型プログラミング = 「状態」と「振る舞い」を切り離すことが大事
// 関数結果の冪等性

// 状態を定義

// 状態
const states = {
  isCircleTurn: true,
  activeClass: 'is-active',
  cells: new Array(9), // ここで予め9つの要素の配列であることを明示しておくことで、draw判定がやりやすくなる
  turnCount: 0
};

// セルに入る文字
const players = {
  circle: '○',
  cross: '×'
};

// tic-tac-toeの全勝利パターン
const winningPattern = [
  // row
  [0, 1, 2],
  [3, 4, 5],
  [6, 7, 8],
  // column
  [0, 3, 6],
  [1, 4, 7],
  [2, 5, 8],
  // diagonal
  [0, 4, 8],
  [2, 4, 6]
]

// DOMs
const elements = {
  cells: document.querySelectorAll('.js-cell'),
  circle: document.querySelector('.js-circle'),
  cross: document.querySelector('.js-cross'),
  stateMessage: document.querySelector('.state-message'),
  restartButton: document.querySelector('.js-restart-button')
};


// 振る舞いを定義
// イベントリスナー作成
const addEventLister = () => {
  elements.cells.forEach(cell => {
    // {once:true}を第3引数に渡すことで1度実行したリスナーを破棄する
    cell.addEventListener('click', onClickCell, {once: true});
  })
  elements.restartButton.addEventListener('click', onclickRestartButton);
};

// 勝敗出力
const statusMessages = {
  starting: () => 'starting...',
  win: (name) => `${name} win!`,
  draw: () => 'draw'
};

// セルがクリックされたときの処理
const onClickCell = (e) => {
  // クリックされたセルのdomを取得
  const clickedCellElement = e.currentTarget;
  // クリックされたセルの番号を取得
  const index = clickedCellElement.dataset.cell;
  // セルに記入するのは○か×かを判断
  const mark = states.isCircleTurn ? players.circle : players.cross;
  // 勝敗判定用にcellの中を表している配列を作成 ※JSのオブジェクトは参照型
  const cells = states.cells;

  // ◯か×を記入
  clickedCellElement.innerHTML = mark;
  // 勝敗判定用の配列にもクリックされた場所に対応する場所にmarkを代入
  cells[index] = mark;

  // 勝ったかどうか
  if (checkWin()) {
    elements.stateMessage.innerHTML = statusMessages.win(mark);
    // ゲームが終了したのでセルを操作できないようにする
    elements.cells.forEach(cell => {
      cell.removeEventListener('click', onClickCell);
    })
    return
  }

  // 勝ち負けが決まらなかった回数をカウントしていく。9になったら引き分け。
  states.turnCount++;

  // 引き分け(全部セルが埋まった)かどうか
  if (states.turnCount === 9) {
    elements.stateMessage.innerHTML = statusMessages.draw();
  }

  // turnの切り替え
  states.isCircleTurn = !states.isCircleTurn;
  swapTurn();
};

const checkWin = () => {
  // 勝敗判定のための空の配列を作成
  const cells = states.cells;

  return winningPattern.some((pattern) => {
    // patternsのうち、一つでもそのpatternの数字の番号のセルに同じマークが揃っていれば勝ち
    const firstMark = cells[pattern[0]];
    const secondMark = cells[pattern[1]];
    const thirdMark = cells[pattern[2]];
    // firstMarkの存在を先にチェック
    return firstMark && firstMark === secondMark && firstMark === thirdMark;
  });
};

const swapTurn = () => {
  states.isCircleTurn ? activeCircleTurn() : activeCrossTurn();
};

const activeCircleTurn = () => {
  elements.cross.classList.remove(states.activeClass);
  elements.circle.classList.add(states.activeClass);
};

const activeCrossTurn = () => {
  elements.circle.classList.remove(states.activeClass);
  elements.cross.classList.add(states.activeClass);
};

const onclickRestartButton = (e) => {
  // リスタートボタンがクリックされたときの処理
  // ページをリロードさせる
  location.reload();
};

addEventLister();