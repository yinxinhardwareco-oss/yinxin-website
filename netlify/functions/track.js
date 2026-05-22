exports.handler = async (event, context) => {
  // 1. 取得網址列上的參數 (例如我們等一下會設定 ?row=2&lang=TW)
  const row = event.queryStringParameters.row;
  const lang = event.queryStringParameters.lang;

  // 2. 判斷要跳轉的中英文官網
  const targetUrl = lang === 'EN' 
    ? 'https://www.yinxincompany.com/en/index.html' 
    : 'https://www.yinxincompany.com/';

  // 3. 在背景偷偷告訴 Google Apps Script：「有人點擊了！」
  if (row) {
    // 這是你目前的 Apps Script API 網址
    const scriptUrl = "https://script.google.com/macros/s/AKfycbzH0LYRuKcK9V4oCQpjJje4cz4SrCIqzj3k3Nbp8HZRD6H04AZW0WHJJugoptcyOGh57w/exec";
    const pingUrl = `${scriptUrl}?clickRow=${row}&target=${encodeURIComponent(targetUrl)}`;

    try {
      // 伺服器對伺服器的隱形呼叫，客戶完全看不見
      await fetch(pingUrl);
    } catch (error) {
      console.error("Tracking API Error:", error);
    }
  }

  // 4. 立刻執行 HTTP 302 轉址，將客戶完美導向你的官網
  return {
    statusCode: 302,
    headers: {
      Location: targetUrl,
    }
  };
};