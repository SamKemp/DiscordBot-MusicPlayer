const { SlashCommandBuilder } = require('@discordjs/builders');
const { songQueue } = require('../utilities/musicInteractions.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('queue')
		.setDescription('Displays the current song queue!'),
	async execute(interaction) {
		if (!interaction.inGuild()) return;

		await interaction.reply('Working on it...');
		await songQueue(interaction);
	},
};