const fs = require("fs");
const CryptoJS = require("crypto-js");
const TelegramBot = require("node-telegram-bot-api");

async function main() {
  const token = await JSON.parse(fs.readFileSync("conf.json")).tgKey;
  const bot = new TelegramBot(token, { polling: true });

  await bot.setMyCommands([
    { command: "/encrypt", description: "Crypt a message giving password" },
    { command: "/decrypt", description: "Decrypt a message giving password" },
  ]);

  bot.on("message", async(msg) => {
    const chatId = msg.chat.id;
    const text = msg.text;

    if (text === "/start") {
      return await bot.sendMessage(
        chatId,
        `Welcome to Cryptobot, here can encrypt and decrypt messages!
             Use /encrypt to encypt messages giving the key - /encrypt <message> <key>
             Use /decrypt to decrypt messages giving the correct key - decrypt <message> <key>
             Enjoy using me!`
      );
    }

    if (text.startsWith("/encrypt")) {
      if (!text) return await bot.sendMessage("Internal error");
      const params = text.split(" ");
      const key = params[2];
      const word = params[1];
      if (params.length !== 3)
        return await bot.sendMessage(
          chatId,
          "Insert the correct params! Type /start to see the instructions"
        );
      if (!key) return await bot.sendMessage(chatId, "Insert a valid key");
      await bot.sendMessage(chatId, `Encrypting word: ${word} using key: ${key}`);
      const ciphertext = CryptoJS.AES.encrypt(word, key);
      return await bot.sendMessage(
        chatId,
        `Done! Here the word encrypted: ${ciphertext} there's the key ${key}`
      );
    }

    if (text.startsWith("/decrypt")) {
      if (!text) return await bot.sendMessage("Internal error");
      const params = text.split(" ");
      const key = params[2];
      const ciphertext = params[1];
      if (params.length !== 3)
        return await bot.sendMessage(
          chatId,
          "Insert the correct params! Type /start to see the instructions"
        );
      if (!key) return await bot.sendMessage(chatId, "Insert a valid key");
      await bot.sendMessage(chatId, `Decrypting: ${ciphertext} using key: ${key}`);
      const bytes = CryptoJS.AES.decrypt(ciphertext.toString(), key);
      const plaintext = bytes.toString(CryptoJS.enc.Utf8);
      return await bot.sendMessage(
        chatId,
        `Done! the encrypted word is ${plaintext}`
      );
    }
  });
}

main();