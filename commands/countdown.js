const { SlashCommandBuilder } = require('@discordjs/builders');
const { add } = require('../utilities/musicInteractions.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('countdown')
		.setDescription('The Final Countdown · Europe'),
	async execute(interaction) {
		if (!interaction.inGuild()) return;

		await interaction.reply('Working on it...');
		await add(interaction, 'https://www.youtube.com/watch?v=NNiTxUEnmKI');
	},
};