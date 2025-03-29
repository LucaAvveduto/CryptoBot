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
            `<b>Welcome to Cryptobot</b>, here you can encrypt and decrypt messages just giving the passkey! 
Use /encrypt to encrypt messages giving the key - /encrypt &lt;message&gt; &lt;key&gt; 
Use /decrypt to decrypt messages giving the correct key - /decrypt &lt;message&gt; &lt;key&gt; 
Enjoy using me!`,
            { parse_mode: "HTML" }
          );                 
    };          

    if (text.startsWith("/encrypt")) {
      if (!text) return await bot.sendMessage("<b>Internal error</b>",{ parse_mode: "HTML" });
      const params = text.split(" ");
      const key = params[2];
      const word = params[1];
      if (params.length !== 3)
        return await bot.sendMessage(
          chatId,
          "Insert the correct params! Type /start to see the instructions"
        );
      if (!key) return await bot.sendMessage(chatId, "<b>Insert a valid key</b>",{ parse_mode: "HTML" });
      await bot.sendMessage(chatId, `Encrypting word: <b>${word}</b> using key: <b>${key}</b>`,{ parse_mode: "HTML" });
      const ciphertext = CryptoJS.AES.encrypt(word, key);
      return await bot.sendMessage(
        chatId,
        `Done! Here the word encrypted: <b>${ciphertext}</b> there's the key <b>${key}</b>`,
        { parse_mode: "HTML" }
      );
    }

    if (text.startsWith("/decrypt")) {
      if (!text) return await bot.sendMessage("<b>Internal error</b>",{ parse_mode: "HTML" });
      const params = text.split(" ");
      const key = params[2];
      const ciphertext = params[1];
      if (params.length !== 3)
        return await bot.sendMessage(
          chatId,
          "<b>Insert the correct params! Type /start to see the instructions</b>",
          { parse_mode: "HTML" }
        );
      if (!key) return await bot.sendMessage(chatId, "<b>Insert a valid key</b>",{ parse_mode: "HTML" });
      await bot.sendMessage(chatId, `Decrypting: <b>${ciphertext}</b> using key: <b>${key}</b>`,{ parse_mode: "HTML" });
      const bytes = CryptoJS.AES.decrypt(ciphertext.toString(), key);
      const plaintext = bytes.toString(CryptoJS.enc.Utf8);
      return await bot.sendMessage(
        chatId,
        `Done! the encrypted word is <b>${plaintext}</b>`,
        { parse_mode: "HTML" }
      );
    }
  });
}

main();