const { SlashCommandBuilder } = require('@discordjs/builders');
const { add } = require('../utilities/musicInteractions.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('blink')
		.setDescription('Half an Orange - Blink 182 [Monstercat Release]'),
	async execute(interaction) {
		if (!interaction.inGuild()) return;

		await interaction.reply('Working on it...');
		await add(interaction, 'https://www.youtube.com/watch?v=cRL1P9eu7kw');
	},
};