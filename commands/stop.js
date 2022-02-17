const { SlashCommandBuilder } = require('@discordjs/builders');
const { stop } = require('../utilities/musicInteractions.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('stop')
		.setDescription('Stops me playing all together!'),
	async execute(interaction) {
		if (!interaction.inGuild()) return;

		await interaction.reply('Working on it...');
		await stop(interaction);
	},
};