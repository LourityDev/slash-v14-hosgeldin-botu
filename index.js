const { Client, GatewayIntentBits, Partials } = require("discord.js");
const INTENTS = Object.values(GatewayIntentBits);
const PARTIALS = Object.values(Partials);
const Discord = require("discord.js")
const louritydb = require("croxydb")
const client = new Client({
    intents: INTENTS,
    allowedMentions: {
        parse: ["users"]
    },
    partials: PARTIALS,
    retryLimit: 3
});

global.client = client;
client.commands = (global.commands = []);

const { readdirSync } = require("fs")
const { TOKEN } = require("./config.json");
readdirSync('./commands').forEach(f => {
    if (!f.endsWith(".js")) return;

    const props = require(`./commands/${f}`);

    client.commands.push({
        name: props.name.toLowerCase(),
        description: props.description,
        options: props.options,
        dm_permission: props.dm_permission,
        type: 1
    });

    console.log(`[COMMAND] ${props.name} komutu yüklendi.`)

});
readdirSync('./events').forEach(e => {

    const eve = require(`./events/${e}`);
    const name = e.split(".")[0];

    client.on(name, (...args) => {
        eve(client, ...args)
    });
    console.log(`[EVENT] ${name} eventi yüklendi.`)
});


client.login(TOKEN)


// Hoşgeldin Sistemi 
client.on("guildMemberAdd", member => {
    let gMesaj = louritydb.get(`hgbbGirisMesaj_${member.guild.id}`);
    const kanal = louritydb.get(`hgbb_${member.guild.id}`)
    if (!kanal) return;
    let kontrol = client.channels.cache.get(kanal)
    if (!kontrol) return;

    // const msge = gMesaj
    //     .replace("-etiketsiz-", member.user.tag)
    //     .replace("-etiketli-", member)
    //     .replace("-üyesayısı-", member.guild.memberCount)

    let embed = new Discord.EmbedBuilder()
        .setTitle("Sunucuya Katıldı!")
        .setDescription(gMesaj || `${member} sunucuya katıldı! Sunucumuz **${member.guild.memberCount}** kişi oldu.`)
        .setThumbnail(member.user.displayAvatarURL())
        .setFooter({ text: "Lourity Tester" })
        .setColor("Green")

    member.guild.channels.cache.get(kanal).send({ embeds: [embed] }).catch(l => { })
});

client.on("guildMemberRemove", member => {

    let cMesaj = louritydb.get(`hgbbCikisMesaj_${member.guild.id}`);
    const kanal = louritydb.get(`hgbb_${member.guild.id}`)
    if (!kanal) return;
    let kontrol = client.channels.cache.get(kanal)
    if (!kontrol) return;

    // const msge = cMesaj
    //     .replace("-etiketsiz-", member.user.tag)
    //     .replace("-etiketli-", member)
    //     .replace("-üyesayısı-", member.guild.memberCount)

    let embed = new Discord.EmbedBuilder()
        .setTitle("Sunucudan Ayrıldı!")
        .setDescription(cMesaj || `${member} sunucudan ayrıldı! Sunucumuz **${member.guild.memberCount}** kişi oldu.`)
        .setThumbnail(member.user.displayAvatarURL())
        .setFooter({ text: "Lourity Tester" })
        .setColor("Red")

    member.guild.channels.cache.get(kanal).send({ embeds: [embed] }).catch(l => { })
});

// Hoşgeldin Sistemi - Button
client.on('interactionCreate', async interaction => {

    const embed = new Discord.EmbedBuilder()
        .setTitle("Yetersiz Yetki!")
        .setDescription("> Bu komutu kullanabilmek için `Kanalları Yönet` yetkisine ihtiyacın var!")
        .setFooter({ text: "Lourity Bot" })
        .setColor("Red")

    const embed1 = new Discord.EmbedBuilder()
        .setTitle("Başarıyla Sıfırlandı!")
        .setDescription("> Hoşgeldin sistemi başarıyla **sıfırlandı**!")
        .setColor("Green")

    if (!interaction.isButton()) return;
    if (!interaction.member.permissions.has(Discord.PermissionsBitField.Flags.ManageChannels)) return interaction.reply({ embeds: [embed], ephemeral: true });
    if (interaction.customId === "kapat") {
        louritydb.delete(`hgbb_${interaction.guild.id}`)
        louritydb.delete(`hgbbCikisMesaj_${interaction.guild.id}`)
        louritydb.delete(`hgbbGirisMesaj_${interaction.guild.id}`)
        interaction.reply({ embeds: [embed1], ephemeral: true }).catch(l => { })
    }
})

client.on('interactionCreate', async interaction => {

    const embed = new Discord.EmbedBuilder()
        .setTitle("Yetersiz Yetki!")
        .setDescription("> Bu komutu kullanabilmek için `Kanalları Yönet` yetkisine ihtiyacın var!")
        .setFooter({ text: "Lourity Bot" })
        .setColor("Red")

    const embed1 = new Discord.EmbedBuilder()
        .setTitle("Başarıyla Sıfırlandı!")
        .setDescription("> Hoşgeldin sistemi başarıyla **sıfırlandı**!")
        .setColor("Green")

    const embed2 = new Discord.EmbedBuilder()
        .setTitle("Zaten Sıfırlanmış!")
        .setDescription("> Hoşgeldin sistemi zaten sıfırlanmış!")
        .setColor("Red")

    if (!interaction.isButton()) return;
    // const w = louritydb.get(`hgbb_${interaction.guild.id}`)
    // if (!w) return interaction.reply({ embeds: [embed2], ephemeral: true })
    if (!interaction.member.permissions.has(Discord.PermissionsBitField.Flags.ManageChannels)) return interaction.reply({ embeds: [embed], ephemeral: true });
    if (interaction.customId === "kapat1") {
        louritydb.delete(`hgbb_${interaction.guild.id}`)
        louritydb.delete(`hgbbCikisMesaj_${interaction.guild.id}`)
        louritydb.delete(`hgbbGirisMesaj_${interaction.guild.id}`)
        interaction.reply({ embeds: [embed1], ephemeral: true }).catch(l => { })
    }
})

client.on('interactionCreate', async interaction => {

    let msge = louritydb.get(`hgbbCikisMesaj_${interaction.guild.id}`)
    let msge2 = louritydb.get(`hgbbGirisMesaj_${interaction.guild.id}`)

    const mesaj = new Discord.EmbedBuilder()
        .setTitle("Ayarlanan Mesaj")
        .setDescription(`📥 **Giriş Mesajı:** ${msge} \n\n📤 **Çıkış Mesajı:** ${msge2}`)
        .setColor("Yellow")

    const uyari = new Discord.EmbedBuilder()
        .setTitle("Başarısız!")
        .setDescription(`Sistem ayarlı değil veya mesaj ayarlanmamış!`)
        .setColor("Red")

    const embed = new Discord.EmbedBuilder()
        .setTitle("Yetersiz Yetki!")
        .setDescription("> Bu komutu kullanabilmek için `Kanalları Yönet` yetkisine ihtiyacın var!")
        .setFooter({ text: "Lourity Bot" })
        .setColor("Red")

    if (!interaction.isButton()) return;
    if (!interaction.member.permissions.has(Discord.PermissionsBitField.Flags.ManageChannels)) return interaction.reply({ embeds: [embed], ephemeral: true });
    if (interaction.customId === "goster") {
        if (!msge) return interaction.reply({ embeds: [uyari], ephemeral: true })
        if (!msge2) return interaction.reply({ embeds: [uyari], ephemeral: true })
        interaction.reply({ embeds: [mesaj], ephemeral: true }).catch(l => { })
    }
})
