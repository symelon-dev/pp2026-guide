// 合言葉を入力すると、ハッシュ値が一致していれば次のページへ進む。
// 平文の合言葉はこのファイルにも HTML にも書かない（「ページのソースを見る」で
// すぐ分かってしまうのを避けるため。他グループに聞くのは許容するが、
// 技術的に素通りできるのは避ける）。
function setupGate(expectedHashHex, nextUrl) {
  const form = document.getElementById("gate-form");
  const input = document.getElementById("gate-input");
  const message = document.getElementById("gate-message");

  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    const value = input.value.trim();
    if (!value) return;

    const encoded = new TextEncoder().encode(value);
    const digest = await crypto.subtle.digest("SHA-256", encoded);
    const hex = Array.from(new Uint8Array(digest))
      .map((b) => b.toString(16).padStart(2, "0"))
      .join("");

    if (hex === expectedHashHex) {
      message.textContent = "正解です。次の段階に進みます。";
      message.className = "ok";
      if (typeof celebrate === "function") celebrate();
      setTimeout(() => { window.location.href = nextUrl; }, 1600);
    } else {
      message.textContent = "合言葉が違います。もう一度確かめてください。";
      message.className = "ng";
      input.value = "";
      input.focus();
    }
  });
}
