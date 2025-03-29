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
            `<b>💎Welcome to Cryptobot!💎</b>

Here you can encrypt and decrypt messages with <b>AES</b> algorithm just giving the passkey 🔐! 

Use /encrypt to encrypt messages giving the key 🔑.
    <b>📝 Type --></b> /encrypt <b>&lt;message&gt; &lt;key&gt;</b>

Use /decrypt to decrypt text <b>encrypted in AES</b> giving the correct key🔑.
    <b>📝 Type --></b> /decrypt <b>&lt;message&gt; &lt;key&gt;</b>

<b>🔥Enjoy using me!🔥</b>

For any question just text me @LukeInCode or visit my personal 
<a href="https://www.aboutluke.com/">website</a> 💬`,
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
            "<b>Insert the correct params ❌! Type /start to see the instructions</b>",
            { parse_mode: "HTML" }
        );
      if (!key) return await bot.sendMessage(chatId, "<b>Insert a valid key</b>",{ parse_mode: "HTML" });
      await bot.sendMessage(chatId, `Encrypting word: <b>${word}</b> using key: <b>${key}</b> ↻`,{ parse_mode: "HTML" });
      const ciphertext = CryptoJS.AES.encrypt(word, key);
      return await bot.sendMessage(
        chatId,
        `Done! Here the word encrypted: <b>${ciphertext}</b> there's the key <b>${key}</b> 🔐🔐`,
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
          "<b>Insert the correct params ❌! Type /start to see the instructions</b>",
          { parse_mode: "HTML" }
        );
      if (!key) return await bot.sendMessage(chatId, "<b>Insert a valid key</b>",{ parse_mode: "HTML" });
      await bot.sendMessage(chatId, `Decrypting: <b>${ciphertext}</b> using key: <b>${key}</b> ↻`,{ parse_mode: "HTML" });
      const bytes = CryptoJS.AES.decrypt(ciphertext.toString(), key);
      const plaintext = bytes.toString(CryptoJS.enc.Utf8);
      if (plaintext) return await bot.sendMessage(
        chatId,
        `Done! the encrypted word is <b>${plaintext}</b> 🔓`,
        { parse_mode: "HTML" }
      );
      else return await bot.sendMessage(chatId,"<b>The gived text is not encrypted in AES</b> ⁴⁰⁴",{ parse_mode: "HTML" })
    }
  });
}

main();