const { SlashCommandBuilder } = require('@discordjs/builders');
const { MessageActionRow, MessageSelectMenu, MessageEmbed } = require('discord.js');
const search = require('youtube-search');
const { youtube_key } = require('../config.json');

const opts = {
	maxResults: 5,
	key: youtube_key,
	type: 'video',
	videoCategoryId: '10',
  };

module.exports = {
	data: new SlashCommandBuilder()
		.setName('search')
		.setDescription('searches for a youtube video and then adds to the queue or starts playing if queue is empty!')
		.addStringOption(option =>
			option.setName('query')
			.setDescription('Term to search for')
			.setRequired(true)),
	async execute(interaction) {
		if (!interaction.inGuild()) return;

		await interaction.reply({ content: 'Working on it...', ephemeral: true });

		search(interaction.options.getString('query', true), opts, async function(err, results) {
			if (err) {
				await interaction.editReply({ content: 'There was an error', ephemeral: true });
				return console.log(err);
			}

			const embed = new MessageEmbed()
			.setColor('#0099ff')
			.setTitle('Select your desired song!')
			.setDescription('If the song you\'re looking for isn\'t in the list you may need to change your search term');

			const menu = new MessageSelectMenu()
			.setCustomId('songSelector')
			.setPlaceholder('Select a song')
			.addOptions([
				{
					label: results[0].title,
					value: results[0].link,
				},
				{
					label: results[1].title,
					value: results[1].link,
				},
				{
					label: results[2].title,
					value: results[2].link,
				},
				{
					label: results[3].title,
					value: results[3].link,
				},
				{
					label: results[4].title,
					value: results[4].link,
				},
			]);
			const row = new MessageActionRow().addComponents(menu);

			await interaction.editReply({ ephemeral: true, embeds: [embed], components: [row] });
		});
	},
};