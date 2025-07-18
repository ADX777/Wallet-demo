async function createWallet() {
  try {
    const wordCount = parseInt(document.getElementById('wordCount').value);
    const usePass = document.getElementById('usePassphrase').checked;
    const passphrase = document.getElementById('passphraseInput').value;
    const walletName = document.getElementById('walletName').value || "Wallet";

    if (usePass && !passphrase) {
      alert("⚠️ Bạn đã bật passphrase nhưng chưa nhập mật khẩu!");
      return;
    }

    console.log("🔧 Word count:", wordCount);
    console.log("🔐 Passphrase enabled:", usePass);
    console.log("📛 Wallet name:", walletName);

    const entropyBits = wordCount * 11;
    const entropyBytes = entropyBits / 8;
    const entropy = ethers.utils.randomBytes(entropyBytes);

    console.log("🧠 Entropy:", entropy);

    const mnemonic = bip39.entropyToMnemonic(Buffer.from(entropy).toString("hex"));
    console.log("📝 Mnemonic:", mnemonic);

    const seed = await bip39.mnemonicToSeed(mnemonic, usePass ? passphrase : "");
    console.log("🌱 Seed:", seed);

    const hdNode = ethers.HDNodeWallet.fromSeed(seed);
    const address = hdNode.address;

    console.log("✅ ETH Address:", address);

    document.getElementById('output').innerHTML = `
      🏷️ <strong>Wallet Name:</strong> ${walletName}<br><br>
      📬 <strong>Ethereum Address:</strong><br>${address}<br><br>
      🔑 <strong>Recovery Phrase (${wordCount} words):</strong><br>${mnemonic}<br><br>
      ⚠️ <strong>Ghi nhớ:</strong> Nếu mất passphrase (nếu có), bạn sẽ không thể khôi phục ví này.
    `;
  } catch (err) {
    console.error("❌ Lỗi tạo ví:", err);
    alert("Đã xảy ra lỗi trong quá trình tạo ví. Xem console để biết thêm chi tiết.");
  }
}

// Kích hoạt ô nhập passphrase khi bật checkbox
document.getElementById('usePassphrase').addEventListener('change', (e) => {
  document.getElementById('passphraseInput').disabled = !e.target.checked;
});
