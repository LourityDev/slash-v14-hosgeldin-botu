const { PermissionsBitField, EmbedBuilder } = require("discord.js");
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

        const embed = new EmbedBuilder()
        .setTitle("Yetkin Yok!")
        .setDescription("Bu komutu kullanabilmek için `Kanalları Yönet`  yetkisinde olman lazım.")
        .setFooter({ text: "Lourity Tester" })
        .setColor("Red")

        if (!interaction.member.permissions.has(PermissionsBitField.Flags.ManageChannels)) return interaction.reply({ embeds: [embed], ephemeral: true })
        
        const gMesaj = interaction.options.getString('giris-mesaj')
        const cMesaj = interaction.options.getString('cikis-mesaj')
        const kanal = interaction.options.getChannel('kanal')

        louritydb.set(`hgbb_${interaction.guild.id}`, kanal.id)
        louritydb.set(`hgbbGirisMesaj_${interaction.guild.id}`, gMesaj)
        louritydb.set(`hgbbCikisMesaj_${interaction.guild.id}`, cMesaj)
        
        const embed1 = new EmbedBuilder()
            .setTitle("Başarıyla Ayarlandı!")
            .setDescription("Hoşgeldin sistemi başarıyla ayarlandı!")
            .setFooter({ text: "Lourity Tester" })
            .setColor("Green")

        

        interaction.reply({ embeds: [embed1] })
    }
};