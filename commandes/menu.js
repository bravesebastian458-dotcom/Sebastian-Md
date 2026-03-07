const { zokou } = require("../framework/zokou");
const conf = require("../set");
const fs = require("fs-extra");

// ==================== MENU NDOGO ====================
zokou({ 
  nomCom: "menu", 
  aliases: ["help2", "cmd2", "commands2"],
  reaction: "🎯",
  categorie: "General" 
}, async (dest, zk, commandeOptions) => {
  
  const { repondre, ms, mybotpic, auteurMessage, nomAuteurMessage } = commandeOptions;
  
  // Get current time
  const now = new Date();
  const time = now.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
  const date = now.toLocaleDateString('en-US', { 
    day: 'numeric', 
    month: 'short', 
    year: 'numeric' 
  });
  
  // ========== MENU DESIGN ==========
  const menuText = `
╭━━━━━━━━━━━━━━━╮
┃  🎯 *MENU RAPIDE*  🎯
╰━━━━━━━━━━━━━━━╯

┏━━━━━━━━━━━━━━━━━━━━┓
┃  ⏰ ${time} ┃ ${date}
┃  👤 *User:* ${nomAuteurMessage || 'User'}
┃  🤖 *Bot:* ${conf.BOT_NAME || 'Bot'}
┗━━━━━━━━━━━━━━━━━━━━┛

╭━─━─━─━─━─━─━─━─━─━╮
┃  ✦ *COMMANDES RAPIDES* ✦
┃  
┃  📱 **GROUP**
┃  ├─ .tagall - Tag tous
┃  ├─ .hidetag - Tag caché
┃  ├─ .link - Lien du groupe
┃  ├─ .info - Infos groupe
┃  ├─ .group open/close
┃  └─ .gname / .gdesc
┃  
┃  🛡️ **SECURITÉ**
┃  ├─ .antilink on/off
┃  ├─ .antibot on/off
┃  ├─ .nsfw on/off
┃  └─ .fkick [code]
┃  
┃  👑 **ADMIN**
┃  ├─ .promote / .demote
┃  ├─ .remove / .del
┃  ├─ .gpp (photo)
┃  └─ .automute / .autounmute
┃  
┃  📥 **DOWNLOAD**
┃  └─ .apk [nom]
┃  
╰━─━─━─━─━─━─━─━─━─━╯

╔══════════════════╗
║  💫 *${conf.BOT_NAME}*  💫
║  ⚡ Tape .menu pour +
╚══════════════════╝

> _© ${conf.OWNER_NAME || 'Bot'}_
`;

  // Try to send with image if available
  try {
    const pic = mybotpic();
    if (pic && pic.match(/\.(jpeg|png|jpg|gif|mp4)$/i)) {
      
      if (pic.match(/\.(mp4|gif)$/i)) {
        await zk.sendMessage(dest, { 
          video: { url: pic }, 
          caption: menuText,
          gifPlayback: true,
          mentions: [auteurMessage]
        }, { quoted: ms });
      } 
      else {
        await zk.sendMessage(dest, { 
          image: { url: pic }, 
          caption: menuText,
          mentions: [auteurMessage]
        }, { quoted: ms });
      }
    } 
    else {
      await repondre(menuText);
    }
  } catch (e) {
    await repondre(menuText);
  }
});

// ==================== MENU YA AI NDOGO ====================
zokou({ 
  nomCom: "aimenu2", 
  reaction: "🤖",
  categorie: "AI" 
}, async (dest, zk, commandeOptions) => {
  
  const { repondre, ms, mybotpic } = commandeOptions;
  
  const aiMenu = `
╭━━━━━━━━━━━━━━━╮
┃  🤖 *MENU AI*  🤖
╰━━━━━━━━━━━━━━━╯

┏━━━━━━━━━━━━━━━━━━━━┓
┃  🎨 **GÉNÉRATION**
┃  ├─ .imagine [prompt]
┃  ├─ .draw [description]
┃  └─ .remix (reply)
┃  
┃  ⚙️ **CONFIG**
┃  ├─ .aistatus
┃  └─ .aimodel [model]
┃  
┃  🖼️ **EXEMPLES**
┃  ├─ .imagine sunset
┃  └─ .draw cute cat
┗━━━━━━━━━━━━━━━━━━━━┛

⚡ _Plus de commandes: .menu_
`;

  try {
    const pic = mybotpic();
    if (pic && pic.match(/\.(jpeg|png|jpg)$/i)) {
      await zk.sendMessage(dest, { 
        image: { url: pic }, 
        caption: aiMenu
      }, { quoted: ms });
    } else {
      await repondre(aiMenu);
    }
  } catch {
    await repondre(aiMenu);
  }
});

// ==================== MENU YA GROUP NDOGO ====================
zokou({ 
  nomCom: "groupmenu", 
  aliases: ["gmenu", "groupcmd"],
  reaction: "👥",
  categorie: "Group" 
}, async (dest, zk, commandeOptions) => {
  
  const { repondre, ms, verifGroupe } = commandeOptions;
  
  if (!verifGroupe) {
    return repondre("❌ Cette commande est pour les groupes uniquement");
  }
  
  const groupMenu = `
╭━━━━━━━━━━━━━━━╮
┃  👥 *MENU GROUPE*  👥
╰━━━━━━━━━━━━━━━╯

┏━━━━━━━━━━━━━━━━━━━━┓
┃  📢 **COMMUNICATION**
┃  ├─ .tagall [msg]
┃  ├─ .hidetag [msg]
┃  ├─ .link
┃  └─ .info
┃  
┃  👑 **GESTION**
┃  ├─ .promote (reply)
┃  ├─ .demote (reply)
┃  ├─ .remove (reply)
┃  ├─ .del (reply)
┃  ├─ .gname [nom]
┃  ├─ .gdesc [desc]
┃  └─ .gpp (image)
┃  
┃  🔒 **SÉCURITÉ**
┃  ├─ .antilink on/off
┃  ├─ .antibot on/off
┃  ├─ .nsfw on/off
┃  ├─ .group open/close
┃  └─ .fkick [code]
┃  
┃  ⏰ **AUTOMATION**
┃  ├─ .automute [time]
┃  └─ .autounmute [time]
┗━━━━━━━━━━━━━━━━━━━━┛

📌 *Tape .help [commande] pour details*
`;

  await repondre(groupMenu);
});

// ==================== MENU YA DOWNLOAD NDOGO ====================
zokou({ 
  nomCom: "downloadmenu", 
  aliases: ["dlmenu", "apkmenu"],
  reaction: "📥",
  categorie: "Download" 
}, async (dest, zk, commandeOptions) => {
  
  const { repondre, ms } = commandeOptions;
  
  const dlMenu = `
╭━━━━━━━━━━━━━━━╮
┃  📥 *MENU DOWNLOAD*  📥
╰━━━━━━━━━━━━━━━╯

┏━━━━━━━━━━━━━━━━━━━━┓
┃  📱 **APPLICATIONS**
┃  ├─ .apk [nom]
┃  ├─ .apk whatsapp
┃  └─ .apk instagram
┃  
┃  🎵 **MÉDIAS**
┃  ├─ .yt [url]
┃  ├─ .ytmp3 [url]
┃  ├─ .tiktok [url]
┃  ├─ .instagram [url]
┃  └─ .facebook [url]
┃  
┃  💡 **EXEMPLES**
┃  ├─ .apk spotify
┃  └─ .yt https://youtu.be/...
┗━━━━━━━━━━━━━━━━━━━━┛

✨ _Plus de commandes: .menu_
`;

  await repondre(dlMenu);
});

// ==================== MENU YA ADMIN NDOGO ====================
zokou({ 
  nomCom: "adminmenu", 
  aliases: ["admcmd", "modmenu"],
  reaction: "👑",
  categorie: "Admin" 
}, async (dest, zk, commandeOptions) => {
  
  const { repondre, ms, verifAdmin, superUser } = commandeOptions;
  
  if (!verifAdmin && !superUser) {
    return repondre("❌ Cette commande est pour les admins uniquement");
  }
  
  const adminMenu = `
╭━━━━━━━━━━━━━━━╮
┃  👑 *MENU ADMIN*  👑
╰━━━━━━━━━━━━━━━╯

┏━━━━━━━━━━━━━━━━━━━━┓
┃  ⚔️ **MODÉRATION**
┃  ├─ .promote (reply)
┃  ├─ .demote (reply)
┃  ├─ .remove (reply)
┃  ├─ .del (reply)
┃  ├─ .group open/close
┃  └─ .fkick [code]
┃  
┃  🎨 **PERSONNALISATION**
┃  ├─ .gname [nom]
┃  ├─ .gdesc [desc]
┃  └─ .gpp (image)
┃  
┃  🛡️ **PROTECTION**
┃  ├─ .antilink on/off
┃  ├─ .antibot on/off
┃  ├─ .nsfw on/off
┃  └─ .automute [time]
┃  
┃  ⚡ **AUTRES**
┃  └─ .left (quitter)
┗━━━━━━━━━━━━━━━━━━━━┛

⚠️ _Ces commandes sont réservées aux admins_
`;

  await repondre(adminMenu);
});

// ==================== MENU YA UTILITAIRE NDOGO ====================
zokou({ 
  nomCom: "utilmenu", 
  aliases: ["toolsmenu", "utils"],
  reaction: "🛠️",
  categorie: "Utility" 
}, async (dest, zk, commandeOptions) => {
  
  const { repondre, ms } = commandeOptions;
  
  const utilMenu = `
╭━━━━━━━━━━━━━━━╮
┃  🛠️ *MENU UTILS*  🛠️
╰━━━━━━━━━━━━━━━╯

┏━━━━━━━━━━━━━━━━━━━━┓
┃  🎨 **STICKERS**
┃  ├─ .sticker (image)
┃  ├─ .toimage (sticker)
┃  └─ .smaker [text]
┃  
┃  🔍 **RECHERCHE**
┃  ├─ .google [query]
┃  ├─ .weather [ville]
┃  └─ .ytsearch [song]
┃  
┃  🔗 **LIENS**
┃  ├─ .shorten [url]
┃  ├─ .qr [text]
┃  └─ .lyrics [song]
┃  
┃  💬 **AUTRES**
┃  ├─ .translate [lang]
┃  ├─ .define [word]
┃  └─ .calc [expression]
┗━━━━━━━━━━━━━━━━━━━━┛

📱 _Tape .menu pour tout voir_
`;

  await repondre(utilMenu);
});

// ==================== MENU YA BOT (RÉSUMÉ) ====================
zokou({ 
  nomCom: "quickmenu", 
  aliases: ["qmenu", "fast"],
  reaction: "⚡",
  categorie: "General" 
}, async (dest, zk, commandeOptions) => {
  
  const { repondre, ms, mybotpic } = commandeOptions;
  
  const quickMenu = `
╭━━━━━━━━━━━━━━━╮
┃  ⚡ *QUICK MENU*  ⚡
╰━━━━━━━━━━━━━━━╯

┏━━━━━━━━━━━━━━━━━━━━┓
┃  🎯 .menu2 - Menu rapide
┃  👥 .groupmenu - Group
┃  🤖 .aimenu2 - AI
┃  📥 .dlmenu - Download
┃  👑 .adminmenu - Admin
┃  🛠️ .utilmenu - Utils
┃  💚 .autoreact - Auto react
┃  📊 .status - Bot status
┗━━━━━━━━━━━━━━━━━━━━┛

✨ ${conf.BOT_NAME} - Premium Bot
`;

  try {
    const pic = mybotpic();
    if (pic && pic.match(/\.(jpeg|png|jpg)$/i)) {
      await zk.sendMessage(dest, { 
        image: { url: pic }, 
        caption: quickMenu
      }, { quoted: ms });
    } else {
      await repondre(quickMenu);
    }
  } catch {
    await repondre(quickMenu);
  }
});

// ==================== MENU YA AUTO REACT ====================
zokou({ 
  nomCom: "autoreactmenu", 
  aliases: ["armenu", "reactmenu"],
  reaction: "💚",
  categorie: "General" 
}, async (dest, zk, commandeOptions) => {
  
  const { repondre, ms } = commandeOptions;
  
  const arMenu = `
╭━━━━━━━━━━━━━━━╮
┃  💚 *AUTO REACT*  💚
╰━━━━━━━━━━━━━━━╯

┏━━━━━━━━━━━━━━━━━━━━┓
┃  📱 **STATUS**
┃  ├─ Bot réagit aux
┃  ├─ status avec 💚
┃  ├─ automatiquement
┃  └─ 
┃  
┃  ⚙️ **CONFIG**
┃  ├─ .autoreact on
┃  ├─ .autoreact off
┃  ├─ .autoreact emoji [x]
┃  └─ .autoreact status
┃  
┃  💡 **EXEMPLE**
┃  └─ .autoreact emoji ❤️
┗━━━━━━━━━━━━━━━━━━━━┛

📌 _Actuel: ${conf.AUTO_REACT_STATUS === 'yes' ? '✅ Activé' : '❌ Désactivé'}_
`;

  await repondre(arMenu);
});

// ==================== STATUT DU BOT (PETIT) ====================
zokou({ 
  nomCom: "status2", 
  aliases: ["botstat", "stats2"],
  reaction: "📊",
  categorie: "General" 
}, async (dest, zk, commandeOptions) => {
  
  const { repondre, ms, verifGroupe } = commandeOptions;
  
  const uptime = process.uptime();
  const hours = Math.floor(uptime / 3600);
  const minutes = Math.floor((uptime % 3600) / 60);
  const seconds = Math.floor(uptime % 60);
  
  const status = `
╭━━━━━━━━━━━━━━━╮
┃  📊 *BOT STATUS*  📊
╰━━━━━━━━━━━━━━━╯

┏━━━━━━━━━━━━━━━━━━━━┓
┃  🤖 *Bot:* ${conf.BOT_NAME}
┃  ⏰ *Uptime:* ${hours}h ${minutes}m ${seconds}s
┃  👤 *Owner:* ${conf.OWNER_NAME || 'N/A'}
┃  📱 *Mode:* ${conf.PUBLIC_MODE === 'yes' ? 'Public' : 'Private'}
┃  💚 *Auto React:* ${conf.AUTO_REACT_STATUS === 'yes' ? '✅' : '❌'}
┃  🔗 *Anti Link:* ${conf.ANTI_LINK || 'N/A'}
┃  🤖 *Anti Bot:* ${conf.ANTI_BOT || 'N/A'}
┗━━━━━━━━━━━━━━━━━━━━┛

⚡ _Tape .menu pour les commandes_
`;

  await repondre(status);
});
