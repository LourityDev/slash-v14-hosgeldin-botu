const Discord = require('discord.js');
const { PermissionsBitField } = require("discord.js")
const louritydb = require("croxydb");
module.exports = {
    name: "hoşgeldin-sistemi",
    description: "Hoşgeldin sistemini ayarlarsınız.",
    type: 1,
    options: [
        {
            name: "kanal",
            description: "Hoşgeldin kanalını ayarlar.",
            type: 7,
            required: true,
            channel_types: [0]
        },

        {
            name: "giris-mesaj",
            description: "Hoşgeldin kanalına atılacak giriş mesajını ayarlarsınız.",
            type: 3,
            required: false
        },

        {
            name: "cikis-mesaj",
            description: "Hoşgeldin kanalına atılacak çıkış mesajını ayarlarsınız.",
            type: 3,
            required: false
        }
    ],
    run: async (client, interaction) => {

        const row = new Discord.ActionRowBuilder()

            .addComponents(
                new Discord.ButtonBuilder()
                    .setEmoji("🗑️")
                    .setLabel("Sistemi Kapat")
                    .setStyle(Discord.ButtonStyle.Danger)
                    .setCustomId("kapat")
            )

        const row1 = new Discord.ActionRowBuilder()

            .addComponents(
                new Discord.ButtonBuilder()
                    .setEmoji("🔽")
                    .setLabel("Mesajı Göster")
                    .setStyle(Discord.ButtonStyle.Primary)
                    .setCustomId("goster")
            )

            .addComponents(
                new Discord.ButtonBuilder()
                    .setEmoji("🗑️")
                    .setLabel("Sistemi Kapat")
                    .setStyle(Discord.ButtonStyle.Danger)
                    .setCustomId("kapat1")
            )

        const embed = new Discord.EmbedBuilder()
            .setTitle("Yetkin Yok!")
            .setDescription("Bu komutu kullanabilmek için `Kanalları Yönet`  yetkisinde olman lazım.")
            .setFooter({ text: "Lourity Tester" })
            .setColor("Red")

        if (!interaction.member.permissions.has(PermissionsBitField.Flags.ManageChannels)) return interaction.reply({ embeds: [embed], ephemeral: true })

        const gMesaj = interaction.options.getString('giris-mesaj')
        const cMesaj = interaction.options.getString('cikis-mesaj')
        const kanal = interaction.options.getChannel('kanal')

        louritydb.set(`hgbb_${interaction.guild.id}`, kanal.id)
        louritydb.set(`hgbbCikisMesaj_${interaction.guild.id}`, cMesaj)
        louritydb.set(`hgbbGirisMesaj_${interaction.guild.id}`, gMesaj)

        const kanalEmbed = new Discord.EmbedBuilder()
            .setTitle("Başarıyla Ayarlandı!")
            .setDescription("Hoşgeldin sistemi başarıyla ayarlandı!")
            .setFooter({ text: "Lourity Tester" })
            .setColor("Green")

        if (gMesaj, cMesaj) return interaction.reply({ embeds: [kanalEmbed], components: [row1] })
        if (!gMesaj, !cMesaj) return interaction.reply({ embeds: [kanalEmbed], components: [row1] })
    }
};
