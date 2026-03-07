const { zokou } = require("../framework/zokou");
const { getAllSudoNumbers, isSudoTableNotEmpty } = require("../bdd/sudo");
const conf = require("../set");

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

zokou({ nomCom: "owner", categorie: "General", reaction: "🥷" }, async (dest, zk, commandeOptions) => {
    const { ms, mybotpic } = commandeOptions;
    
    const thsudo = await isSudoTableNotEmpty();

    if (thsudo) {
        let msg = `*My Super-User*\n
        *Owner Number*\n :
    - 🌟 @${conf.NUMERO_OWNER}
    
    ------ *other sudos* -----\n`;
        
        let sudos = await getAllSudoNumbers();
        
        // Delay before processing sudo users
        await delay(1000); // 1 second delay

        for (const sudo of sudos) {
            if (sudo) { // Strict check to eliminate empty or undefined values
                let sudonumero = sudo.replace(/[^0-9]/g, '');
                msg += `- 💼 @${sudonumero}\n`;
            } else {
                return;
            }
        }

        const ownerjid = conf.NUMERO_OWNER.replace(/[^0-9]/g) + "@s.whatsapp.net";
        const mentionedJid = sudos.concat([ownerjid]);
        
        console.log(sudos);
        console.log(mentionedJid);

        // Delay before sending the message
        await delay(2000); // 2 seconds delay

        zk.sendMessage(
            dest,
            {
                image: { url: mybotpic() },
                caption: msg,
                mentions: mentionedJid,
            }
        );
    } else {
        const vcard =
            'BEGIN:VCARD\n' + // metadata of the contact card
            'VERSION:3.0\n' +
            'FN:' + conf.OWNER_NAME + '\n' + // full name
            'ORG:undefined;\n' + // the organization of the contact
            'TEL;type=CELL;type=VOICE;waid=' + conf.NUMERO_OWNER + ':+' + conf.NUMERO_OWNER + '\n' + // WhatsApp ID + phone number
            'END:VCARD';
        
        await delay(1000); // 1 second delay before sending contact card

        zk.sendMessage(dest, {
            contacts: {
                displayName: conf.OWNER_NAME,
                contacts: [{ vcard }],
            },
        }, { quoted: ms });
    }
});

zokou({ nomCom: "dev", categorie: "General", reaction: "🎣" }, async (dest, zk, commandeOptions) => {
    const { ms, mybotpic } = commandeOptions;

    const devs = [
        { nom: "༺𝐕𝐀𝐑 𝐊𝐈𝐓𝐀𝐀༻", numero: "255792372250" },
        { nom: "༺𝐕𝐀𝐑 𝐊𝐈𝐓𝐀𝐀༻", numero: "255792372250" },
        { nom: "༺𝐕𝐀𝐑 𝐊𝐈𝐓𝐀𝐀༻", numero: "255683372250" },
        // Add other developers here
    ];

    let message = "WELCOME 𝐦𝐰𝐚𝐧𝐚𝐤𝐢𝐭𝐚𝐚 ༺𝐕𝐀𝐑 𝐊𝐈𝐓𝐀𝐀༻ tupo pamoja:\n\n";
    
    // Delay before processing the developer list
    await delay(1000); // 1 second delay

    for (const dev of devs) {
        message += `----------------\n• ${dev.nom} : https://wa.me/${dev.numero}\n`;
    }

    var lien = mybotpic();

    if (lien.match(/\.(mp4|gif)$/i)) {
        try {
            // Delay before sending media
            await delay(2000); // 2 seconds delay
            zk.sendMessage(dest, { video: { url: lien }, caption: message }, { quoted: ms });
        } catch (e) {
            console.log("🥵🥵 Menu erreur " + e);
            repondre("🥵🥵 Menu erreur " + e);
        }
    } else if (lien.match(/\.(jpeg|png|jpg)$/i)) {
        try {
            // Delay before sending media
            await delay(2000); // 2 seconds delay
            zk.sendMessage(dest, { image: { url: lien }, caption: message }, { quoted: ms });
        } catch (e) {
            console.log("🥵🥵 Menu erreur " + e);
            repondre("🥵🥵 Menu erreur " + e);
        }
    } else {
        repondre(lien);
        repondre("link error");
    }
});

zokou({ nomCom: "support", categorie: "General" }, async (dest, zk, commandeOptions) => {
    const { ms, repondre, auteurMessage } = commandeOptions;

    // Delay before sending the support message
    await delay(1500); // 1.5 second delay

    repondre("THANK 𝐘𝐨𝐮 𝐦𝐰𝐚𝐧𝐤𝐢𝐭𝐚𝐚 𝐰𝐞 𝐚𝐫𝐞 𝐛𝐢𝐠 𝐟𝐚𝐦𝐢𝐥𝐲 \n\n ❝ CHANNEL LINK  ❞ \n\n https://whatsapp.com/channel/0029VasLXWp4tRs0xU9MDc47");
    
    // Delay before sending another support message
    await delay(1000); // 1 second delay

    await zk.sendMessage(auteurMessage, { text: `THANK YOU FOR CHOOSING ༺𝐕𝐀𝐑 𝐊𝐈𝐓𝐀𝐀༻, MAKE SURE YOU FOLLOW THESE CHANNELS.\n\n https://whatsapp.com/channel/0029VasLXWp4tRs0xU9MDc47` }, { quoted: ms });
});
