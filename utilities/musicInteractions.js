const ytdl = require('ytdl-core');
const { joinVoiceChannel, createAudioPlayer, NoSubscriberBehavior, createAudioResource, AudioPlayerStatus } = require('@discordjs/voice');

const queue = new Map();

module.exports = {

	queue: queue,

	async add(interaction, YT_URL) {
		const serverQueue = queue.get(interaction.guild.id);

		const voiceChannel = interaction.member.voice.channel;
		if (!voiceChannel) return interaction.editReply('You need to be in a voice channel to play music!');

		const permissions = voiceChannel.permissionsFor(interaction.client.user);
		if (!permissions.has('CONNECT') || !permissions.has('SPEAK')) {
			return interaction.editReply('I need the permissions to join and speak in your voice channel!');
		}

		const songInfo = await ytdl.getInfo(YT_URL);
		const song = {
			title: songInfo.videoDetails.title,
			url: songInfo.videoDetails.video_url,
		};

		if (!serverQueue) {
			const queueContruct = {
				textChannel: interaction.channel,
				voiceChannel: voiceChannel,
				connection: null,
				player: null,
				songs: [],
				volume: 5,
				playing: true,
			};

			queue.set(interaction.guild.id, queueContruct);

			queueContruct.songs.push(song);

			try {
				const connection = joinVoiceChannel({
						channelId: voiceChannel.id,
						guildId: voiceChannel.guild.id,
						adapterCreator: voiceChannel.guild.voiceAdapterCreator,
					});
				queueContruct.connection = connection;
				const player = createAudioPlayer({
					behaviors: {
						noSubscriber: NoSubscriberBehavior.Pause,
					},
				});
				queueContruct.player = player;
				play(interaction.guild, queueContruct.songs[0]);
			}
			catch (err) {
				console.log(err);
				queue.delete(interaction.guild.id);
				return interaction.editReply(err);
			}
		}
		else {
			serverQueue.songs.push(song);
			return interaction.editReply(song.title + ' has been added to the queue!');
		}
	},

	async searchAdd(interaction, YT_URL) {
		const serverQueue = queue.get(interaction.guild.id);

		const voiceChannel = interaction.member.voice.channel;
		if (!voiceChannel) return interaction.followUp('You need to be in a voice channel to play music!');

		const permissions = voiceChannel.permissionsFor(interaction.client.user);
		if (!permissions.has('CONNECT') || !permissions.has('SPEAK')) {
			return interaction.followUp('I need the permissions to join and speak in your voice channel!');
		}

		const songInfo = await ytdl.getInfo(YT_URL);
		const song = {
			title: songInfo.videoDetails.title,
			url: songInfo.videoDetails.video_url,
		};

		if (!serverQueue) {
			const queueContruct = {
				textChannel: interaction.channel,
				voiceChannel: voiceChannel,
				connection: null,
				player: null,
				songs: [],
				volume: 5,
				playing: true,
			};

			queue.set(interaction.guild.id, queueContruct);

			queueContruct.songs.push(song);

			try {
				const connection = joinVoiceChannel({
						channelId: voiceChannel.id,
						guildId: voiceChannel.guild.id,
						adapterCreator: voiceChannel.guild.voiceAdapterCreator,
					});
				queueContruct.connection = connection;
				const player = createAudioPlayer({
					behaviors: {
						noSubscriber: NoSubscriberBehavior.Pause,
					},
				});
				queueContruct.player = player;
				play(interaction.guild, queueContruct.songs[0]);
			}
			catch (err) {
				console.log(err);
				queue.delete(interaction.guild.id);
				return interaction.followUp(err);
			}
		}
		else {
			serverQueue.songs.push(song);
			return interaction.followUp(song.title + ' has been added to the queue!');
		}
	},

	skip(interaction) {
		const serverQueue = queue.get(interaction.guild.id);

		if (!interaction.member.voice.channel) return interaction.editReply('You have to be in a voice channel to skip songs!');
		if (!serverQueue) return interaction.editReply('There is no song that I could skip!');
		serverQueue.player.stop();
		return interaction.editReply('Song skipped!');
	},

	stop(interaction) {
		const serverQueue = queue.get(interaction.guild.id);

		if (!interaction.member.voice.channel) return interaction.editReply('You have to be in a voice channel to stop the music!');

		if (!serverQueue) return interaction.editReply('There is no song that I could stop!');

		serverQueue.songs = [];
		serverQueue.connection.destroy();
		return interaction.editReply('Music stopped!');
	},
};

function play(guild, song) {
	const serverQueue = queue.get(guild.id);
	if (!song) {
		serverQueue.connection.destroy();
		queue.delete(guild.id);
		return;
	}

	const resource = createAudioResource(ytdl(song.url));
	serverQueue.player.play(resource);
	serverQueue.player.on(AudioPlayerStatus.Idle, () => {
		serverQueue.songs.shift();
		play(guild, serverQueue.songs[0]);
	});
	serverQueue.player.on('error', error => console.error(error));

	serverQueue.connection.subscribe(serverQueue.player);
	// dispatcher.setVolumeLogarithmic(serverQueue.volume / 5);
	serverQueue.textChannel.send(`Started playing: **${song.title}**`);
}