const { zokou } = require("../framework/zokou");
const { Sticker, StickerTypes } = require('wa-sticker-formatter');
const { ajouterOuMettreAJourJid, mettreAJourAction, verifierEtatJid } = require("../bdd/antilien");
const { atbajouterOuMettreAJourJid, atbverifierEtatJid, atbmettreAJourAction } = require("../bdd/antibot");
const { search, download } = require("aptoide-scraper");
const fs = require("fs-extra");
const conf = require("../set");
const { default: axios } = require('axios');
const { exec } = require("child_process");

// ==================== TAGALL ====================
zokou({ nomCom: "tagall", categorie: 'Group', reaction: "📣" }, async (dest, zk, commandeOptions) => {
  const { ms, repondre, arg, verifGroupe, nomGroupe, infosGroupe, nomAuteurMessage, verifAdmin, superUser } = commandeOptions;

  if (!verifGroupe) { 
    repondre("✋🏿 This command is reserved for groups ❌"); 
    return; 
  }
  
  const mess = (!arg || arg.length === 0) ? 'No message' : arg.join(' ');
  
  let membresGroupe = verifGroupe ? await infosGroupe.participants : [];
  let tag = `╭─────────────━┈⊷\n│🌟 𝐓𝐀𝐆𝐀𝐋𝐋\n╰─────────────━┈⊷\n│👥 *Group:* ${nomGroupe}\n│👤 *By:* ${nomAuteurMessage}\n│📜 *Message:* ${mess}\n╰─────────────━┈⊷\n\n`;

  const emoji = ['🦴', '👀', '😮‍💨', '❌', '✔️', '😇', '⚙️', '🔧', '🎊', '😡', '🙏🏿', '⛔️', '$','😟','🥵','🐅'];
  const random = Math.floor(Math.random() * emoji.length);

  for (const membre of membresGroupe) {
    tag += `${emoji[random]} @${membre.id.split("@")[0]}\n`;
  }

  if (verifAdmin || superUser) {
    await zk.sendMessage(dest, { text: tag, mentions: membresGroupe.map(i => i.id) }, { quoted: ms });
  } else {
    repondre('Command reserved for admins');
  }
});

// ==================== LINK ====================
zokou({ nomCom: "link", categorie: 'Group', reaction: "🙋" }, async (dest, zk, commandeOptions) => {
  const { repondre, nomGroupe, nomAuteurMessage, verifGroupe } = commandeOptions;
  
  if (!verifGroupe) { 
    repondre("This command is for groups only"); 
    return; 
  }

  const link = await zk.groupInviteCode(dest);
  const lien = `https://chat.whatsapp.com/${link}`;
  const mess = `Hello ${nomAuteurMessage},\n\nHere is the group link for *${nomGroupe}*:\n${lien}\n\n© ${conf.BOT_NAME || 'Bot'}`;
  
  repondre(mess);
});

// ==================== PROMOTE ====================
zokou({ nomCom: "promote", categorie: 'Group', reaction: "👨🏿‍💼" }, async (dest, zk, commandeOptions) => {
  let { repondre, msgRepondu, infosGroupe, auteurMsgRepondu, verifGroupe, auteurMessage, superUser, idBot } = commandeOptions;
  
  if (!verifGroupe) return repondre("For groups only");

  let membresGroupe = await infosGroupe.participants;
  
  const memberAdmin = (membres) => membres.filter(m => m.admin !== null).map(m => m.id);
  const admins = memberAdmin(membresGroupe);
  const isMember = membresGroupe.some(m => m.id === auteurMsgRepondu);
  const isTargetAdmin = admins.includes(auteurMsgRepondu);
  const isSenderAdmin = admins.includes(auteurMessage) || superUser;
  const isBotAdmin = admins.includes(idBot);

  if (!msgRepondu) return repondre("Please tag the member to promote");
  if (!isSenderAdmin) return repondre("You are not an administrator");
  if (!isBotAdmin) return repondre("I need admin rights");
  if (!isMember) return repondre("User not in group");
  if (isTargetAdmin) return repondre("Already an admin");

  try {
    await zk.groupParticipantsUpdate(dest, [auteurMsgRepondu], "promote");
    const txt = `🎊 @${auteurMsgRepondu.split("@")[0]} has been promoted to admin.`;
    await zk.sendMessage(dest, { text: txt, mentions: [auteurMsgRepondu] });
  } catch (e) {
    repondre("Error: " + e.message);
  }
});

// ==================== DEMOTE ====================
zokou({ nomCom: "demote", categorie: 'Group', reaction: "👨🏿‍💼" }, async (dest, zk, commandeOptions) => {
  let { repondre, msgRepondu, infosGroupe, auteurMsgRepondu, verifGroupe, auteurMessage, superUser, idBot } = commandeOptions;
  
  if (!verifGroupe) return repondre("For groups only");

  let membresGroupe = await infosGroupe.participants;
  
  const memberAdmin = (membres) => membres.filter(m => m.admin !== null).map(m => m.id);
  const admins = memberAdmin(membresGroupe);
  const isMember = membresGroupe.some(m => m.id === auteurMsgRepondu);
  const isTargetAdmin = admins.includes(auteurMsgRepondu);
  const isSenderAdmin = admins.includes(auteurMessage) || superUser;
  const isBotAdmin = admins.includes(idBot);

  if (!msgRepondu) return repondre("Please tag the member to demote");
  if (!isSenderAdmin) return repondre("You are not an administrator");
  if (!isBotAdmin) return repondre("I need admin rights");
  if (!isMember) return repondre("User not in group");
  if (!isTargetAdmin) return repondre("User is not an admin");

  try {
    await zk.groupParticipantsUpdate(dest, [auteurMsgRepondu], "demote");
    const txt = `@${auteurMsgRepondu.split("@")[0]} has been demoted.`;
    await zk.sendMessage(dest, { text: txt, mentions: [auteurMsgRepondu] });
  } catch (e) {
    repondre("Error: " + e.message);
  }
});

// ==================== REMOVE ====================
zokou({ nomCom: "remove", categorie: 'Group', reaction: "👨🏿‍💼" }, async (dest, zk, commandeOptions) => {
  let { repondre, msgRepondu, infosGroupe, auteurMsgRepondu, verifGroupe, auteurMessage, superUser, idBot } = commandeOptions;
  
  if (!verifGroupe) return repondre("For groups only");

  let membresGroupe = await infosGroupe.participants;
  
  const memberAdmin = (membres) => membres.filter(m => m.admin !== null).map(m => m.id);
  const admins = memberAdmin(membresGroupe);
  const isMember = membresGroupe.some(m => m.id === auteurMsgRepondu);
  const isTargetAdmin = admins.includes(auteurMsgRepondu);
  const isSenderAdmin = admins.includes(auteurMessage) || superUser;
  const isBotAdmin = admins.includes(idBot);

  if (!msgRepondu) return repondre("Please tag the member to remove");
  if (!isSenderAdmin) return repondre("You are not an administrator");
  if (!isBotAdmin) return repondre("I need admin rights");
  if (!isMember) return repondre("User not in group");
  if (isTargetAdmin) return repondre("Cannot remove an admin");

  try {
    await zk.groupParticipantsUpdate(dest, [auteurMsgRepondu], "remove");
    const txt = `@${auteurMsgRepondu.split("@")[0]} was removed from the group.`;
    await zk.sendMessage(dest, { text: txt, mentions: [auteurMsgRepondu] });
  } catch (e) {
    repondre("Error: " + e.message);
  }
});

// ==================== DELETE MESSAGE ====================
zokou({ nomCom: "del", categorie: 'Group', reaction: "🧹" }, async (dest, zk, commandeOptions) => {
  const { ms, repondre, verifGroupe, msgRepondu, verifAdmin, superUser } = commandeOptions;
  
  if (!msgRepondu) {
    repondre("Please reply to the message to delete.");
    return;
  }

  try {
    const key = {
      remoteJid: dest,
      fromMe: msgRepondu.key?.fromMe || false,
      id: msgRepondu.key?.id || ms.message?.extendedTextMessage?.contextInfo?.stanzaId,
      participant: msgRepondu.key?.participant
    };

    if (superUser || verifAdmin) {
      await zk.sendMessage(dest, { delete: key });
    } else {
      repondre("You don't have permission to delete messages.");
    }
  } catch (e) {
    repondre("Error: " + e.message);
  }
});

// ==================== GROUP INFO ====================
zokou({ nomCom: "info", categorie: 'Group' }, async (dest, zk, commandeOptions) => {
  const { ms, repondre, verifGroupe } = commandeOptions;
  
  if (!verifGroupe) { 
    repondre("This command is for groups only"); 
    return; 
  }

  try {
    let ppgroup;
    try {
      ppgroup = await zk.profilePictureUrl(dest, 'image');
    } catch {
      ppgroup = conf.URL || 'https://files.catbox.moe/ety154.jpg';
    }

    const info = await zk.groupMetadata(dest);
    const creationDate = new Date(info.creation * 1000).toLocaleDateString();
    const participantCount = info.participants.length;
    const adminCount = info.participants.filter(p => p.admin).length;

    const mess = {
      image: { url: ppgroup },
      caption: `*━━━━『GROUP INFO』━━━━*\n\n` +
               `*📛 Name:* ${info.subject}\n` +
               `*🆔 ID:* ${dest}\n` +
               `*👥 Members:* ${participantCount}\n` +
               `*👑 Admins:* ${adminCount}\n` +
               `*📅 Created:* ${creationDate}\n` +
               `*📝 Description:*\n${info.desc || 'No description'}`
    };

    await zk.sendMessage(dest, mess, { quoted: ms });
  } catch (e) {
    repondre("Error getting group info: " + e.message);
  }
});

// ==================== ANTILINK ====================
zokou({ nomCom: "antilink", categorie: 'Group', reaction: "🔗" }, async (dest, zk, commandeOptions) => {
  var { repondre, arg, verifGroupe, superUser, verifAdmin } = commandeOptions;
  
  if (!verifGroupe) {
    return repondre("*For groups only*");
  }
  
  if (!superUser && !verifAdmin) {
    return repondre("You are not authorized to use this command");
  }

  try {
    const isActive = await verifierEtatJid(dest);
    
    if (!arg || arg.length === 0) {
      return repondre(`*ANTILINK MENU*\n\n` +
        `Current status: ${isActive ? '✅ Active' : '❌ Inactive'}\n\n` +
        `*Usage:*\n` +
        `▸ .antilink on - Activate\n` +
        `▸ .antilink off - Deactivate\n` +
        `▸ .antilink action/remove - Remove sender\n` +
        `▸ .antilink action/delete - Delete only\n` +
        `▸ .antilink action/warn - Give warning`);
    }

    if (arg[0] === 'on') {
      if (isActive) {
        repondre("Antilink is already activated");
      } else {
        await ajouterOuMettreAJourJid(dest, "oui");
        repondre("✅ Antilink activated successfully");
      }
    } 
    else if (arg[0] === 'off') {
      if (!isActive) {
        repondre("Antilink is not activated");
      } else {
        await ajouterOuMettreAJourJid(dest, "non");
        repondre("✅ Antilink deactivated successfully");
      }
    } 
    else if (arg[0] === 'action') {
      const action = arg[1] ? arg[1].toLowerCase() : null;
      
      if (action && ['remove', 'warn', 'delete'].includes(action)) {
        await mettreAJourAction(dest, action);
        repondre(`✅ Antilink action updated to: ${action}`);
      } else {
        repondre("Invalid action. Use: remove, warn, or delete");
      }
    } 
    else {
      repondre("Invalid option. Use: on, off, or action/remove");
    }
  } catch (error) {
    repondre("Error: " + error.message);
  }
});

// ==================== ANTIBOT ====================
zokou({ nomCom: "antibot", categorie: 'Group', reaction: "😬" }, async (dest, zk, commandeOptions) => {
  var { repondre, arg, verifGroupe, superUser, verifAdmin } = commandeOptions;
  
  if (!verifGroupe) {
    return repondre("*For groups only*");
  }
  
  if (!superUser && !verifAdmin) {
    return repondre("You are not authorized to use this command");
  }

  try {
    const isActive = await atbverifierEtatJid(dest);
    
    if (!arg || arg.length === 0) {
      return repondre(`*ANTIBOT MENU*\n\n` +
        `Current status: ${isActive ? '✅ Active' : '❌ Inactive'}\n\n` +
        `*Usage:*\n` +
        `▸ .antibot on - Activate\n` +
        `▸ .antibot off - Deactivate\n` +
        `▸ .antibot action/remove - Remove bot\n` +
        `▸ .antibot action/delete - Delete message\n` +
        `▸ .antibot action/warn - Give warning`);
    }

    if (arg[0] === 'on') {
      if (isActive) {
        repondre("Antibot is already activated");
      } else {
        await atbajouterOuMettreAJourJid(dest, "oui");
        repondre("✅ Antibot activated successfully");
      }
    } 
    else if (arg[0] === 'off') {
      if (!isActive) {
        repondre("Antibot is not activated");
      } else {
        await atbajouterOuMettreAJourJid(dest, "non");
        repondre("✅ Antibot deactivated successfully");
      }
    } 
    else if (arg[0] === 'action') {
      const action = arg[1] ? arg[1].toLowerCase() : null;
      
      if (action && ['remove', 'warn', 'delete'].includes(action)) {
        await atbmettreAJourAction(dest, action);
        repondre(`✅ Antibot action updated to: ${action}`);
      } else {
        repondre("Invalid action. Use: remove, warn, or delete");
      }
    } 
    else {
      repondre("Invalid option. Use: on, off, or action/remove");
    }
  } catch (error) {
    repondre("Error: " + error.message);
  }
});

// ==================== GROUP OPEN/CLOSE ====================
zokou({ nomCom: "group", categorie: 'Group' }, async (dest, zk, commandeOptions) => {
  const { repondre, verifGroupe, verifAdmin, superUser, arg } = commandeOptions;

  if (!verifGroupe) { 
    repondre("This command is for groups only"); 
    return; 
  }
  
  if (!verifAdmin && !superUser) {
    repondre("Only admins can use this command");
    return;
  }

  if (!arg[0]) {
    repondre('*Usage:*\n.group open - Open group\n.group close - Close group');
    return;
  }

  const option = arg[0].toLowerCase();
  
  try {
    if (option === "open") {
      await zk.groupSettingUpdate(dest, 'not_announcement');
      repondre('✅ Group opened successfully');
    } else if (option === "close") {
      await zk.groupSettingUpdate(dest, 'announcement');
      repondre('✅ Group closed successfully');
    } else {
      repondre("Invalid option. Use 'open' or 'close'");
    }
  } catch (e) {
    repondre("Error: " + e.message);
  }
});

// ==================== LEAVE GROUP ====================
zokou({ nomCom: "left", categorie: "Mods" }, async (dest, zk, commandeOptions) => {
  const { repondre, verifGroupe, superUser } = commandeOptions;
  
  if (!verifGroupe) { 
    repondre("This command is for groups only"); 
    return; 
  }
  
  if (!superUser) {
    repondre("Only bot owner can use this command");
    return;
  }

  await repondre('👋 Goodbye!');
  await zk.groupLeave(dest);
});

// ==================== GROUP NAME ====================
zokou({ nomCom: "gname", categorie: 'Group' }, async (dest, zk, commandeOptions) => {
  const { arg, repondre, verifAdmin } = commandeOptions;

  if (!verifAdmin) {
    repondre("Only admins can change group name");
    return;
  }
  
  if (!arg || arg.length === 0) {
    repondre("Please enter the new group name");
    return;
  }
  
  const nom = arg.join(' ');
  
  try {
    await zk.groupUpdateSubject(dest, nom);
    repondre(`✅ Group name changed to: *${nom}*`);
  } catch (e) {
    repondre("Error: " + e.message);
  }
});

// ==================== GROUP DESCRIPTION ====================
zokou({ nomCom: "gdesc", categorie: 'Group' }, async (dest, zk, commandeOptions) => {
  const { arg, repondre, verifAdmin } = commandeOptions;

  if (!verifAdmin) {
    repondre("Only admins can change group description");
    return;
  }
  
  if (!arg || arg.length === 0) {
    repondre("Please enter the new group description");
    return;
  }
  
  const desc = arg.join(' ');
  
  try {
    await zk.groupUpdateDescription(dest, desc);
    repondre("✅ Group description updated successfully");
  } catch (e) {
    repondre("Error: " + e.message);
  }
});

// ==================== GROUP PROFILE PICTURE ====================
zokou({ nomCom: "gpp", categorie: 'Group' }, async (dest, zk, commandeOptions) => {
  const { repondre, msgRepondu, verifAdmin } = commandeOptions;

  if (!verifAdmin) {
    repondre("Only admins can change group picture");
    return;
  }
  
  if (!msgRepondu || !msgRepondu.imageMessage) {
    repondre("Please reply to an image to set as group picture");
    return;
  }

  try {
    const pp = await zk.downloadAndSaveMediaMessage(msgRepondu.imageMessage);
    await zk.updateProfilePicture(dest, { url: pp });
    await zk.sendMessage(dest, { text: "✅ Group picture updated successfully" });
    fs.unlinkSync(pp);
  } catch (e) {
    repondre("Error: " + e.message);
  }
});

// ==================== HIDETAG ====================
zokou({ nomCom: "hidetag", categorie: 'Group', reaction: "🎤" }, async (dest, zk, commandeOptions) => {
  const { repondre, msgRepondu, verifGroupe, arg, verifAdmin, superUser } = commandeOptions;

  if (!verifGroupe) { 
    repondre("This command is for groups only"); 
    return; 
  }
  
  if (!verifAdmin && !superUser) { 
    repondre("Only admins can use this command"); 
    return; 
  }

  try {
    const metadata = await zk.groupMetadata(dest);
    const participants = metadata.participants.map(p => p.id);

    if (msgRepondu) {
      let msg = { mentions: participants };

      if (msgRepondu.imageMessage) {
        const media = await zk.downloadAndSaveMediaMessage(msgRepondu.imageMessage);
        msg.image = { url: media };
        msg.caption = msgRepondu.imageMessage.caption || '';
      } 
      else if (msgRepondu.videoMessage) {
        const media = await zk.downloadAndSaveMediaMessage(msgRepondu.videoMessage);
        msg.video = { url: media };
        msg.caption = msgRepondu.videoMessage.caption || '';
      } 
      else if (msgRepondu.audioMessage) {
        const media = await zk.downloadAndSaveMediaMessage(msgRepondu.audioMessage);
        msg.audio = { url: media };
        msg.mimetype = 'audio/mp4';
      } 
      else if (msgRepondu.stickerMessage) {
        const media = await zk.downloadAndSaveMediaMessage(msgRepondu.stickerMessage);
        const sticker = new Sticker(media, {
          pack: conf.BOT_NAME || 'Bot',
          type: StickerTypes.FULL,
          quality: 70
        });
        msg.sticker = await sticker.toBuffer();
      } 
      else {
        msg.text = msgRepondu.conversation || ' ';
      }

      await zk.sendMessage(dest, msg);
      
      // Clean up downloaded files
      if (msg.image || msg.video || msg.audio) {
        fs.unlinkSync(media);
      }
    } 
    else {
      if (!arg || arg.length === 0) {
        return repondre("Enter text to announce or reply to a message");
      }
      
      await zk.sendMessage(dest, {
        text: arg.join(' '),
        mentions: participants
      });
    }
  } catch (e) {
    repondre("Error: " + e.message);
  }
});

// ==================== APK DOWNLOAD ====================
zokou({ nomCom: "apk", reaction: "✨", categorie: "Recherche" }, async (dest, zk, commandeOptions) => {
  const { repondre, arg, ms } = commandeOptions;

  try {
    const appName = arg.join(' ');
    if (!appName) {
      return repondre("*Enter the name of the application to search for*");
    }

    const searchResults = await search(appName);
    if (searchResults.length === 0) {
      return repondre("*No application found. Try another name*");
    }

    const appData = await download(searchResults[0].id);
    
    // Parse file size correctly
    const sizeMatch = appData.size.match(/\d+/);
    const fileSize = sizeMatch ? parseInt(sizeMatch[0]) : 0;

    if (fileSize > 300) {
      return repondre("The file exceeds 300 MB, unable to download.");
    }

    const captionText = `『 *APK DOWNLOADER* 』\n\n` +
      `*Name:* ${appData.name}\n` +
      `*Package:* ${appData.package || 'N/A'}\n` +
      `*Last Update:* ${appData.lastup || 'N/A'}\n` +
      `*Size:* ${appData.size}\n` +
      `*Downloads:* ${appData.downloads || 'N/A'}\n\n` +
      `_Sending APK file..._`;

    const apkFileName = (appData.name || "App") + ".apk";
    const filePath = `./${apkFileName}`;

    // Download APK
    const response = await axios({
      method: 'GET',
      url: appData.dllink,
      responseType: 'stream'
    });

    const writer = fs.createWriteStream(filePath);
    response.data.pipe(writer);

    await new Promise((resolve, reject) => {
      writer.on('finish', resolve);
      writer.on('error', reject);
    });

    // Send app info with icon
    if (appData.icon) {
      await zk.sendMessage(dest, { 
        image: { url: appData.icon }, 
        caption: captionText 
      }, { quoted: ms });
    }

    // Send APK file
    await zk.sendMessage(dest, { 
      document: fs.readFileSync(filePath),
      mimetype: 'application/vnd.android.package-archive',
      fileName: apkFileName
    }, { quoted: ms });

    // Clean up
    fs.unlinkSync(filePath);

  } catch (error) {
    console.error('APK Error:', error);
    repondre("*Error downloading APK*");
  }
});

// ==================== AUTOMUTE ====================
const cron = require('../bdd/cron');

zokou({ nomCom: 'automute', categorie: 'Group' }, async (dest, zk, commandeOptions) => {
  const { arg, repondre, verifAdmin } = commandeOptions;

  if (!verifAdmin) { 
    repondre('Only admins can use this command'); 
    return; 
  }

  try {
    const groupCron = await cron.getCronById(dest);

    if (!arg || arg.length === 0) {
      let state = "No time set for automatic mute";
      if (groupCron && groupCron.mute_at) {
        const [hour, minute] = groupCron.mute_at.split(':');
        state = `Group will be muted at ${hour}:${minute}`;
      }

      return repondre(`*AUTOMUTE*\n\n` +
        `Status: ${state}\n\n` +
        `*Usage:*\n` +
        `▸ .automute 9:30 - Set mute time\n` +
        `▸ .automute del - Remove automute`);
    }

    const texte = arg.join(' ');

    if (texte.toLowerCase() === 'del') {
      if (!groupCron) {
        repondre('No automute configured');
      } else {
        await cron.delCron(dest);
        repondre('✅ Automute removed. Restarting bot...');
        setTimeout(() => exec("pm2 restart all"), 2000);
      }
    } 
    else if (texte.includes(':')) {
      await cron.addCron(dest, "mute_at", texte);
      repondre(`✅ Automute set for ${texte}. Restarting bot...`);
      setTimeout(() => exec("pm2 restart all"), 2000);
    } 
    else {
      repondre('Please enter a valid time (e.g., 9:30)');
    }
  } catch (e) {
    repondre("Error: " + e.message);
  }
});

// ==================== AUTOUNMUTE ====================
zokou({ nomCom: 'autounmute', categorie: 'Group' }, async (dest, zk, commandeOptions) => {
  const { arg, repondre, verifAdmin } = commandeOptions;

  if (!verifAdmin) { 
    repondre('Only admins can use this command'); 
    return; 
  }

  try {
    const groupCron = await cron.getCronById(dest);

    if (!arg || arg.length === 0) {
      let state = "No time set for automatic unmute";
      if (groupCron && groupCron.unmute_at) {
        const [hour, minute] = groupCron.unmute_at.split(':');
        state = `Group will be unmuted at ${hour}:${minute}`;
      }

      return repondre(`*AUTOUNMUTE*\n\n` +
        `Status: ${state}\n\n` +
        `*Usage:*\n` +
        `▸ .autounmute 17:30 - Set unmute time\n` +
        `▸ .autounmute del - Remove autounmute`);
    }

    const texte = arg.join(' ');

    if (texte.toLowerCase() === 'del') {
      if (!groupCron) {
        repondre('No autounmute configured');
      } else {
        await cron.delCron(dest);
        repondre('✅ Autounmute removed. Restarting bot...');
        setTimeout(() => exec("pm2 restart all"), 2000);
      }
    } 
    else if (texte.includes(':')) {
      await cron.addCron(dest, "unmute_at", texte);
      repondre(`✅ Autounmute set for ${texte}. Restarting bot...`);
      setTimeout(() => exec("pm2 restart all"), 2000);
    } 
    else {
      repondre('Please enter a valid time (e.g., 17:30)');
    }
  } catch (e) {
    repondre("Error: " + e.message);
  }
});

// ==================== FKICK (Kick by country code) ====================
zokou({ nomCom: 'fkick', categorie: 'Group' }, async (dest, zk, commandeOptions) => {
  const { arg, repondre, verifAdmin, superUser, verifZokouAdmin } = commandeOptions;

  if (!verifAdmin && !superUser) {
    return repondre('Only admins can use this command');
  }

  if (!verifZokouAdmin) {
    return repondre('I need admin rights to perform this command');
  }

  if (!arg || arg.length === 0) {
    return repondre('Please enter the country code (e.g., .fkick 255)');
  }

  try {
    const metadata = await zk.groupMetadata(dest);
    const participants = metadata.participants;
    const countryCode = arg[0];
    let removed = 0;

    for (const participant of participants) {
      if (participant.id.startsWith(countryCode) && participant.admin === null) {
        await zk.groupParticipantsUpdate(dest, [participant.id], "remove");
        removed++;
        await new Promise(resolve => setTimeout(resolve, 1000)); // Delay to avoid rate limiting
      }
    }

    repondre(`✅ Removed ${removed} members with code ${countryCode}`);
  } catch (e) {
    repondre("Error: " + e.message);
  }
});

// ==================== NSFW CONTROL ====================
zokou({ nomCom: 'nsfw', categorie: 'Group' }, async (dest, zk, commandeOptions) => {
  const { arg, repondre, verifAdmin } = commandeOptions;

  if (!verifAdmin) { 
    repondre('Only admins can use this command'); 
    return; 
  }

  try {
    const hbd = require('../bdd/hentai');
    const isActive = await hbd.checkFromHentaiList(dest);

    if (!arg || arg.length === 0) {
      return repondre(`*NSFW CONTROL*\n\n` +
        `Current status: ${isActive ? '✅ Active' : '❌ Inactive'}\n\n` +
        `*Usage:*\n.nsfw on - Enable NSFW\n.nsfw off - Disable NSFW`);
    }

    if (arg[0] === 'on') {
      if (isActive) {
        repondre('NSFW is already active');
      } else {
        await hbd.addToHentaiList(dest);
        repondre('✅ NSFW content is now active');
      }
    } 
    else if (arg[0] === 'off') {
      if (!isActive) {
        repondre('NSFW is already disabled');
      } else {
        await hbd.removeFromHentaiList(dest);
        repondre('✅ NSFW content is now disabled');
      }
    } 
    else {
      repondre('Use: .nsfw on or .nsfw off');
    }
  } catch (e) {
    repondre("Error: " + e.message);
  }
});
