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

    const entropyBits = wordCount * 11;
    const entropyBytes = entropyBits / 8;
    const entropy = ethers.utils.randomBytes(entropyBytes);
    const hexEntropy = ethers.utils.hexlify(entropy).replace("0x", "");

    const mnemonic = bip39.entropyToMnemonic(hexEntropy);
    const seed = await bip39.mnemonicToSeed(mnemonic, usePass ? passphrase : "");
    const hdNode = ethers.HDNodeWallet.fromSeed(seed);
    const address = hdNode.address;

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

document.getElementById('usePassphrase').addEventListener('change', (e) => {
  document.getElementById('passphraseInput').disabled = !e.target.checked;
});
