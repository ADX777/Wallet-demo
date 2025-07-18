async function createWallet() {
  const wordCount = parseInt(document.getElementById('wordCount').value);
  const usePass = document.getElementById('usePassphrase').checked;
  const passphrase = document.getElementById('passphraseInput').value;
  const walletName = document.getElementById('walletName').value || "Wallet";

  if (usePass && !passphrase) {
    alert("⚠️ Bạn đã bật passphrase nhưng chưa nhập mật khẩu!");
    return;
  }

  // Tính entropy dựa trên số từ
  const entropyBits = wordCount * 11;
  const entropyBytes = entropyBits / 8;
  const entropy = ethers.utils.randomBytes(entropyBytes);

  // Sinh seed phrase chuẩn BIP39
  const mnemonic = bip39.entropyToMnemonic(Buffer.from(entropy).toString("hex"));

  // Chuyển về seed (dùng để sinh private key)
  const seed = await bip39.mnemonicToSeed(mnemonic, usePass ? passphrase : "");

  // Sinh ví theo chuẩn HD Wallet từ seed
  const hdNode = ethers.HDNodeWallet.fromSeed(seed);
  const address = hdNode.address;

  // Hiển thị kết quả
  document.getElementById('output').innerHTML = `
    🏷️ <strong>Wallet Name:</strong> ${walletName}<br><br>
    📬 <strong>Ethereum Address:</strong><br>${address}<br><br>
    🔑 <strong>Recovery Phrase (${wordCount} words):</strong><br>${mnemonic}<br><br>
    ⚠️ <strong>Ghi nhớ:</strong> Nếu mất passphrase (nếu có), bạn sẽ không thể khôi phục ví này.
  `;
}

// Bật/tắt input passphrase
document.getElementById('usePassphrase').addEventListener('change', (e) => {
  document.getElementById('passphraseInput').disabled = !e.target.checked;
});
