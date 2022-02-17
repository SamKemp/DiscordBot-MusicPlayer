const { SlashCommandBuilder } = require('@discordjs/builders');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('help')
		.setDescription('A help command, obvs!'),
	async execute(interaction) {
		if (!interaction.inGuild()) return;

		let helpText = 'I am a simple music bot!';
		helpText += '\nMy commands are as follows';
		helpText += '\n/help - shows this help command';
		helpText += '\n/play <youtube url> - adds the linked youtube video to the queue or starts playing if queue is empty';
		helpText += '\n/search <query> - searches for a youtube video and then adds to the queue or starts playing if queue is empty';
		helpText += '\n/queue - Displays the current song queue';
		helpText += '\n/skip - skips the current song in queue';
		helpText += '\n/stop - stops me playing all together';

		await interaction.reply(helpText);
	},
};