const { SlashCommandBuilder } = require('@discordjs/builders');
const { skip } = require('../utilities/musicInteractions.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('skip')
		.setDescription('Skips the current song in queue!'),
	async execute(interaction) {
		if (!interaction.inGuild()) return;

		await interaction.reply('Working on it...');
		await skip(interaction);
	},
};