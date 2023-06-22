// 定数
const ROW_NUM = 8; // 列の数
const COL_NUM = 8; // 行の数

// グローバル変数（手番）
let whichTurn = "black";


// ゲームを開始する（メイン関数）
function startGame() {

    // 盤面を作成
    createBoard();

    // 駒を初期配置
    let isInit = true;
    putPiece(3, 4, isInit);
    putPiece(3, 3, isInit);
    putPiece(4, 3, isInit);
    putPiece(4, 4, isInit);

    // 盤面のマスにclickイベントを設定
    isInit = false;
    for (let row = 0; row < ROW_NUM; row++) {
        for (let col = 0; col < COL_NUM; col++) {
            getPiece(row, col).addEventListener(
                "click", () => putPiece(row, col, isInit)
            );
        }
    }
}


// 駒要素を取得する
function getPiece(x, y) {
    return document.getElementById(x + "," + y);
}


// 盤面を作成する
function createBoard() {

    // 列
    for (let row = 0; row < ROW_NUM; row++) {

        // tr要素（列）を生成
        const tr = document.createElement("tr");

        // 行
        for (let col = 0; col < COL_NUM; col++) {
            // td要素（マス）を生成
            const td = document.createElement("td");

            // div要素を生成
            const div = document.createElement("div");
            div.className = 'none';
            div.id = row + "," + col;

            // 各要素を設定
            td.appendChild(div);
            tr.appendChild(td);
        }
        // tr要素（列）を設定
        document.getElementById("board").appendChild(tr);
    }
}


// 駒を置く
function putPiece(row, col, isInit) {

    // 初期配置の場合、設置のみ行う
    if (isInit) {
        getPiece(row, col).className = whichTurn;
        changeTurn();
        countPieces();
        return;
    }


    // 裏返せる数が0（=駒が置けない）場合、returnする
    if (flipPieces(row, col, false) === 0) {
        return;
    }

    // 駒を置く（＝classの書き換え）
    getPiece(row, col).className = whichTurn;

    // 駒を裏返す
    flipPieces(row, col, true);

    // 現在の手番で駒の置き場があるか数える
    const nowNumber = countPlaces();

    // 手番を変更
    changeTurn();

    // 手番を変更した状態で置き場所が無い場合、さらに手番を変更（＝パスさせる）
    const nextNumber = countPlaces();
    if (nowNumber > 0 && nextNumber === 0) {
        alert("パス");
        changeTurn();
    }

    // 表示を変更
    const [blackCount, whiteCount] = countPieces();
    document.getElementById("black-count").textContent = blackCount;
    document.getElementById("white-count").textContent = whiteCount;

    // 勝敗が付いた場合、結果表示
    if (nextNumber === 0 && nowNumber === 0) {
        if (blackCount < whiteCount) {
            alert("白の勝ち！");
        }
        else if (whiteCount < blackCount) {
            alert("黒の勝ち！");
        }
        else {
            alert("引き分け");
        }
    }
}


// 駒を裏返す（flipFlag=true） or 裏返せる駒の数を返却する（flipFlag=false)
function flipPieces(baseRow, baseCol, flipFlag) {

    // 裏返せる合計駒数（8方向分）
    let sumCount = 0;

    // 周囲8方向
    for (let dirX = -1; dirX <= 1; dirX++) {
        for (let dirY = -1; dirY <= 1; dirY++) {

            // 自身の座標の場合は、ループを抜ける 
            if (dirX == 0 && dirY == 0) continue;

            // 裏返せる駒数（1方向分）
            const oneDirCount = countFlipPieces(0, baseRow, baseCol, dirX, dirY);

            // flipFlagがtrueならば、裏返す処理
            if (flipFlag) {
                for (let i = 1; i <= oneDirCount; i++) {
                    const flipPiece = getPiece(baseRow + dirX * i, baseCol + dirY * i);
                    flipPiece.className = whichTurn;
                }
            }

            // 合計駒数に、裏返せる駒数（1方向分）を追加
            sumCount += oneDirCount;
        }
    }

    return sumCount;
}


// 裏返せる駒を数える
function countFlipPieces(count, baseRow, baseCol, dirX, dirY) {

    let nextRow = 0;
    let nextCol = 0;

    // 見ているところが盤外の場合、0を返却
    nextRow = baseRow + dirX;
    nextCol = baseCol + dirY;
    if (nextRow < 0 || nextRow > 7) {
        return 0;
    }
    if (nextCol < 0 || nextCol > 7) {
        return 0;
    }

    // 見ているところの駒の色を取得
    const nextPieceColor = getPiece(nextRow, nextCol).className;

    // nextPositonにコマが無い場合、0を返却
    if (nextPieceColor === 'none') {
        return 0;
    }

    // 見ているところの駒の色がwhichTurnと異なる場合、再帰呼び出し
    if (nextPieceColor !== whichTurn) {
        count = countFlipPieces(count + 1, nextRow, nextCol, dirX, dirY);
    }

    return count;
}


// 黒と白の合計を数える
function countPieces() {

    // 合計を数える
    let blackCount = 0;
    let whiteCount = 0;

    for (let row = 0; row < ROW_NUM; row++) {
        for (let col = 0; col < COL_NUM; col++) {
            if (this.getPiece(row, col).className == "black") {
                blackCount++;
            }
            else if (this.getPiece(row, col).className == "white") {
                whiteCount++;
            }
        }
    }

    return [blackCount, whiteCount];
}


// 駒の置ける場所を数える
function countPlaces() {
    let count = 0;

    for (let row = 0; row < ROW_NUM; row++) {
        for (let col = 0; col < COL_NUM; col++) {
            const canPutPiece = getPiece(row, col).className === "none" && flipPieces(row, col, false) != 0;
            if (canPutPiece) {
                count++;
            }
        }
    }

    return count;
}


// 手番を変える
function changeTurn() {

    const isBlack = (whichTurn === "black");

    // 手番を変更
    whichTurn = isBlack ? "white" : "black";

    // 手番の表示を変更
    document.getElementById("black-result").className = isBlack ? "result" : "result selected";
    document.getElementById("white-result").className = isBlack ? "result selected" : "result";
}
