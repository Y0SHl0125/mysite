/************************************************************
 長谷部エンジニア養成所 - 勉強会サンプルコード
 課題内容：スプレッドシートのA列の左に「No」を追加して1〜連番に出力する
 URL: https://haseblog.org
 Date: 2020-05-12
 Copyright © 2020 haseblog. All rights reserved.
*************************************************************/
/*
 * カード取得
 * @param  なし
 * @return なし
 */
function getCard() {
    var cards = [];
    // 開発者向けAPIキー
    var trelloKey = "f412d9e7c44a0fd24bae402bf7cc2e75"; // ★★★
    // 開発者トークン
    var trelloToken = "5e9c8073b61158c4ec9c647c30e3f78cd245c7b4952db32945ef82e6d2738fb8"; // ★★★
    // リストID
    var listId = "5e99d1e7aee8c765d2c72850";
    // カード一覧取得
    var json = getCards(listId, trelloKey, trelloToken);
    // カード一覧分繰り返し
    for (var i = 0; i < json.length; i++) {
      　var　num = i+1;
        var name = json[i].name;
        var idMembers = json[i].idMembers;
        var membersfullName = [];
        var shortUrl = json[i].shortUrl;
        // メンバー分繰り返し
        for (var j = 0; j < idMembers.length; j++) {
            // メンバー取得
            var json2 = getMembers(idMembers[j], trelloKey, trelloToken);
            membersfullName.push(json2.fullName);
        }
        // カード情報を整形する
        var card = [num, name, idMembers, membersfullName.join(" - "), shortUrl];
        // 配列の末尾に追加する
        cards.push(card);
    }
    // スプレッドシートに書き出し
    setSpreadsheet(cards);
}

/*
 * カード一覧を取得します
 * @param  {文字列} listId リストID
 * @param  {文字列} trelloKey 開発者向けAPIキー
 * @param  {文字列} trelloToken 開発者トークン
 * @return {JSON}  カード一覧APIの戻り値
 */
function getCards(listId, trelloKey, trelloToken) {
    try {
        // 処理を1秒遅延させる(ミリ秒単位)
        Utilities.sleep(1000);
        // URL文字列を整形する
        var url = "https://trello.com/1/lists/" + listId + "/cards?key=" + trelloKey + "&token=" + trelloToken;
        // HTTPリクエストを送る
        var res = UrlFetchApp.fetch(url, { 'method': 'get', 'contentType': 'application/json' });
        // JSONを読み込み、値を返す
        return JSON.parse(res);
    } catch (ex) {
        // ログ出力
        Logger.log("Message:" + ex.message + "\r\nUrl:" + url);
        // アラート出力
        SpreadsheetApp.getUi().alert("カード一覧APIでエラーが発生しました");
    }
}

/*
 * メンバーを取得します
 * @param  {文字列} idMembers メンバーID
 * @param  {文字列} trelloKey 開発者向けAPIキー
 * @param  {文字列} trelloToken 開発者トークン
 * @return {JSON}  メンバー取得APIの戻り値
 */
function getMembers(idMembers, trelloKey, trelloToken) {
    try {
        // 処理を1秒遅延させる(ミリ秒単位)
        Utilities.sleep(1000);
        // URL文字列を整形する
        var url = "https://trello.com/1/members/" + idMembers + "?key=" + trelloKey + "&token=" + trelloToken;
        // HTTPリクエストを送る
        var res = UrlFetchApp.fetch(url, { 'method': 'get', 'contentType': 'application/json' });
        // JSONを読み込み、値を返す
        return JSON.parse(res);
    } catch (ex) {
        // ログ出力
        Logger.log("Message:" + ex.message + "\r\nUrl:" + url);
        // アラート出力
        SpreadsheetApp.getUi().alert("メンバー取得APIでエラーが発生しました");
    }
}

/*
 * スプレッドシートにカード情報を設定する
 * @param  {配列} cards カード情報
 * @return なし
 */
function setSpreadsheet(cards) {
    // アクティブなワークブックを指定する
    var spreadsheet = SpreadsheetApp.getActiveSpreadsheet();
    // シート名を指定してシートを取得する
    var sheet = spreadsheet.getSheetByName('list1'); // ★★★
    // 行番号, 列番号, 行数, 列数を指定し、カード情報を設定
    sheet.getRange(2, 1, cards.length, cards[0].length).setValues(cards);
}

/*
 * スプレッドシートの値をクリアします
 * @param  なし
 * @return なし
 */
function clear() {
    // アクティブなワークブックを指定する
    var spreadsheet = SpreadsheetApp.getActiveSpreadsheet();
    // シート名を指定してシートを取得する
    var sheet = spreadsheet.getSheetByName('list1'); // ★★★
    // 行番号, 列番号, 行数, 列数を指定し、スプレッドシートの値をクリアする
    sheet.getRange(2, 1, 20, 5).clear()
}
