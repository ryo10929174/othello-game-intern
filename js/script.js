var which_turn = "black";

// 駒を指定する
function target_piece(x, y) {
    try {
        var result = document.getElementById(x + "," + y);
    } catch {
        return false;
    }
    return result;
}

// index.html から呼ばれる
function start_game() {
    // 盤面を作成する
    create_board()
    // click イベント
    target_piece(0, 0).addEventListener(
        "click", () => alert("test")
    );
    
}

//ボードをセットする
function create_board() {
    var tr = document.createElement("tr");
    var td = document.createElement("td");
    var div = document.createElement("div");
    
    // idに座標を入力
    div.className = "none";
    div.id = 0 + "," + 0;
    td.appendChild(div);
    tr.appendChild(td);

    document.getElementById("board").appendChild(tr);
}

// 駒を置く
function put_piece() {

}

// 駒を返す
function turn_over() {

}

// 駒を返すチェックを行う
function turn_piece_check() {

}

// 合計の駒数を数える
function total_piece_count() {

}

// 駒の置ける場所を数える
function count_places() {

}

// 白黒を変える
function change_turn() {
    var black_result = document.getElementById("black-result");
    var white_result = document.getElementById("white-result");

    if (which_turn == "black") {
        which_turn = "white";
        black_result.className = "result";
        white_result.className = "result selected";
    } else {
        which_turn = "black";
        black_result.className = "result selected";
        white_result.className = "result";
    }
}
