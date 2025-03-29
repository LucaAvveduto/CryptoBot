const CryptoJS = require("crypto-js");
module.exports = () => {
    return {
        encrypt: (word, key) => {
            return CryptoJS.AES.encrypt(word, key);
        },
        decrypt: (ciphertext, key) => {
            const bytes = CryptoJS.AES.decrypt(ciphertext.toString(), key);
            return bytes.toString(CryptoJS.enc.Utf8) || null;
        }
    }
}