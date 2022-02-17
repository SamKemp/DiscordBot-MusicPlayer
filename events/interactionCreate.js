const { MessageEmbed } = require('discord.js');
const { searchAdd } = require('../utilities/musicInteractions.js');

module.exports = {
	name: 'interactionCreate',
	once: false,
	async execute(interaction) {
		// Ignore non commands
		if (interaction.isCommand()) {
			const command = interaction.client.commands.get(interaction.commandName);

			if (!command) return;

			try {
				await command.execute(interaction);
			}
			catch (error) {
				console.error(error);
				try {
					await interaction.reply({ content: 'There was an error while executing this command!', ephemeral: true });
				}
				catch (newError) {
					await interaction.editReply({ content: 'There was an error while executing this command!', ephemeral: true });
				}
			}
		}
		else if (interaction.isSelectMenu()) {
			if (interaction.customId === 'songSelector') {

				const embed = new MessageEmbed()
				.setColor('#0099ff')
				.setTitle('Song selected');

				await interaction.update({ ephemeral: true, embeds: [embed], components: [] });
				await searchAdd(interaction, interaction.values[0]);
			}
		}
		else {
			return;
		}
	},
};