const { SlashCommandBuilder } = require('@discordjs/builders');
const { add } = require('../utilities/musicInteractions.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('play')
		.setDescription('Adds a linked youtube video to the queue or starts playing if queue is empty!')
		.addStringOption(option =>
			option.setName('url')
			.setDescription('YouTube video to play')
			.setRequired(true)),
	async execute(interaction) {
		if (!interaction.inGuild()) return;

		await interaction.reply('Working on it...');
		await add(interaction, interaction.options.getString('url', true));
	},
};