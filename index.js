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

    // const msge = gMesaj
    //     .replace("-etiketsiz-", member.user.tag)
    //     .replace("-etiketli-", member)
    //     .replace("-üyesayısı-", member.guild.memberCount)

    let embed = new Discord.EmbedBuilder()
        .setTitle("Sunucuya Katıldı!")
        .setDescription(gMesaj || `${member} sunucuya katıldı! Sunucumuz **${member.guild.memberCount}** kişi oldu.`)
        .setThumbnail(member.user.displayAvatarURL())
        .setFooter({text: "Lourity Tester"})
        .setColor("Green")

    member.guild.channels.cache.get(kanal).send({ embeds: [embed] })
});

client.on("guildMemberRemove", member => {

    let cMesaj = louritydb.get(`hgbbCikisMesaj_${member.guild.id}`);
    const kanal = louritydb.get(`hgbb_${member.guild.id}`)
    if (!kanal) return;

    // const msge = cMesaj
    //     .replace("-etiketsiz-", member.user.tag)
    //     .replace("-etiketli-", member)
    //     .replace("-üyesayısı-", member.guild.memberCount)

    let embed = new Discord.EmbedBuilder()
        .setTitle("Sunucudan Ayrıldı!")
        .setDescription(cMesaj || `${member} sunucudan ayrıldı! Sunucumuz **${member.guild.memberCount}** kişi oldu.`)
        .setThumbnail(member.user.displayAvatarURL())
        .setFooter({text: "Lourity Tester"})
        .setColor("Red")

    member.guild.channels.cache.get(kanal).send({ embeds: [embed] })
});