const ytdl = require('ytdl-core');
const {
	joinVoiceChannel,
	createAudioPlayer,
	NoSubscriberBehavior,
	createAudioResource,
	AudioPlayerStatus,
	StreamType
} = require('@discordjs/voice');
const { MessageEmbed } = require('discord.js');

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

	songQueue(interaction) {
		const serverQueue = queue.get(interaction.guild.id);

		if (!interaction.member.voice.channel) return interaction.editReply('You have to be in a voice channel to see the queue!');
		if (!serverQueue) return interaction.editReply('There is no queue that I could show!');

		const queueEmbed = new MessageEmbed()
		.setColor('#0099ff')
		.setTitle(interaction.guild.name + ' song queue')
		.setAuthor({ name: interaction.client.user.username, iconURL: 'https://cdn.discordapp.com/avatars/937313195255808040/59ea6b5d233d158528bc4a333bf069aa.webp' })
		.setTimestamp()
		.setFooter({ text: interaction.guild.name + ' song queue', iconURL: 'https://cdn.discordapp.com/avatars/937313195255808040/59ea6b5d233d158528bc4a333bf069aa.webp' });

		queueEmbed.addField('Currently playing', serverQueue.songs[0].title, false);
		let songList = '';
		if (serverQueue.songs.length >= 2) songList = serverQueue.songs[1].title;
		if (serverQueue.songs.length >= 3) songList += '\n' + serverQueue.songs[2].title;
		if (serverQueue.songs.length >= 4) songList += '\n' + serverQueue.songs[3].title;
		if (serverQueue.songs.length >= 5) songList += '\n' + serverQueue.songs[4].title;

		queueEmbed.addField('Up next', songList, false);

		return interaction.editReply({ embeds: [queueEmbed] });
	},
};

function play(guild, song) {
	const serverQueue = queue.get(guild.id);
	if (!song) {
		serverQueue.connection.destroy();
		queue.delete(guild.id);
		return;
	}

	const resource = createAudioResource(ytdl(song.url, { filter: 'audioonly' }), { inputType: StreamType.Arbitrary });
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