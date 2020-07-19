// Comentar lo de abajo si es en produccion en heroku por ejemplo.
import { config } from "dotenv";
config();
// Comentar lo de arriba si es en produccion en heroku por ejemplo.
import {
  Client,
  Message,
  MessageEmbed,
  TextChannel,
  RoleResolvable,
} from "discord.js";
// Config Prefix
import { prefix } from "./config.json";
// New Client
const client: Client = new Client();
// Eventos en cola
client.setMaxListeners(50);

// Mensajes Random
const msgRandom = [
  "Que onda?👹",
  "Dale que hoy es un gran día!😎",
  "Sale algo? 👽",
  "Tengo ganas de expulsar gente!💀",
  "Que olor raro! 😵",
  "Dale que hoy es un dia de fiesta! 🎃🍕",
];

// Anti Spam Desde la libreria "discord-anti-spam"
const AntiSpam = require("discord-anti-spam");
const antiSpam = new AntiSpam({
  warnThreshold: 4, // Cantidad de mensajes enviados en una fila que provocará una advertencia.
  kickThreshold: 7, // Cantidad de mensajes enviados en una fila que provocará una prohibición.
  banThreshold: 7, // Cantidad de mensajes enviados en una fila que provocará una prohibición.
  maxInterval: 2000, // Cantidad de tiempo (en milisegundos) en que los mensajes se consideran spam.
  warnMessage: "{@user} para un poquito con los mensajes!", // Mensaje que se enviará en el chat al advertir a un usuario.
  kickMessage: "**{user_tag}** expulsado por pesado!", // Mensaje que se enviará en el chat al expulsar a un usuario.
  banMessage: "**{user_tag}** baneado por spamear, nos vemos en disney!", // Mensaje que se enviará en el chat al prohibir a un usuario.
  maxDuplicatesWarning: 3, // Cantidad de mensajes duplicados que activan una advertencia.
  maxDuplicatesKick: 6, // Cantidad de mensajes duplicados que activan una advertencia.
  maxDuplicatesBan: 6, // Cantidad de mensajes duplicados que activan una advertencia.
  excepttPermissions: ["ADMINISTRATOR"], // Omitir a los usuarios con cualquiera de estos permisos.
  ignoreBots: true, // Ignora los mensajes de bot.
  verbose: true, // Registros extendidos del módulo.
  ignoredUsers: [], // Matriz de ID de usuario que se ignoran.
  ignoredRoles: [], // Ignorar Roles
});

// Estado del Bot
const presense = () => {
  client.user?.setPresence({
    status: "online",
    activity: {
      name: "Codear!",
      type: "PLAYING",
    },
  });
};

// Empieza el bot
client.on("ready", () => {
  console.log("bot is ready!");
  presense();
});

process.on("warning", (e) => console.warn(e.stack));

// Mensaje automatico en un canal especifico dando las Bienvenidas!
client.on("guildMemberAdd", async (member) => {
  // Busqueda de canales
  const channel = member.guild.channels.cache.find(
    (channel) => channel.name === "👋bienvenidas"
  );
  const rules = member.guild.channels.cache.find(
    (channel) => channel.name === "👉🏼reglas"
  );

  // Comprobar si existe el canal
  if (!channel) return;

  // Buscar un Rol
  const role = member.guild.roles.cache.find((role) => role.name === "Player");
  // Agregar el Rol buscado al nuevo miembro.
  await member.roles.add(role as RoleResolvable);

  // Mensaje de bievenida
  const welcomeEmbed = new MessageEmbed()
    .setTitle("Bienvenid@")
    .setDescription(
      `${member} espero que te diviertas! Cuando puedas pasate a leer las <#${rules?.id}>`
    )
    .setThumbnail(`${member.user?.defaultAvatarURL}`)
    .setFooter("Servidor de Discord de la Comunidad ASDASD")
    .setTimestamp();

  // Mensaje enviado al canal especifico.
  (channel as TextChannel).send(welcomeEmbed);
});

// Adm messages
client.on("message", async (message: Message) => {
  // Mensajes enviados en el servidor
  console.log(message.content);

  // Text random cuando alguien dice "hola"
  const random = Math.floor(Math.random() * msgRandom.length);
  if (message.content.startsWith("hola")) {
    message.channel.send(msgRandom[random]);
  }

  if (message.content.startsWith(`${prefix}`)) {
    // Test Ping
    if (message.content.startsWith(`${prefix}ping`)) {
      // message.channel.send('🚀 pong');
      message.reply("pong");
    }

    // Funcion para Expulsar a un miembro !!kick @user
    if (message.content.startsWith(`${prefix}kick`)) {
      try {
        // Revisar si el usuario tiene los permisos para expulsar
        if (message.member?.hasPermission(["KICK_MEMBERS"])) {
          const member = message.mentions.members?.first();
          if (member) {
            const kickedMember = await member.kick();
            return message.channel.send(
              `${kickedMember.user.username} expulsado por xxx!`
            );
          }
        }
        return message.reply(
          "No tenes los previlegios de sacar a nadie de aca!"
        );
      } catch (err) {
        return message.reply("Hubo un error en mi sistema!");
      }
    }

    // Funcion para banear a un miembro !!ban @user
    if (message.content.startsWith(`${prefix}ban`)) {
      try {
        //Revisar si el miembro tiene los permisos para banear.
        if (message.member?.hasPermission(["BAN_MEMBERS"])) {
          const msg = message.content.split(" ", 4);
          const info = message.content.split('"');
          const member = message.mentions.members?.first();
          const days = Number(msg[2]);
          const rea = info[1];
          if (days && rea) {
            const banMember = await member?.ban({ days: days, reason: rea });
            return message.channel.send(
              `${banMember?.user.username} baneado por xxx!`
            );
          } else {
            return message.reply(
              'Ese formato esta mal, te dejo un ejemplo => !!ban @User 2 "razones"'
            );
          }
        }
        return message.reply(
          "No tenes los previlegios de banear!"
        );
      } catch (err) {
        return message.reply("Hubo un error en mi sistema!");
      }
    }
  }
});

client.login(process.env.DISCORD_TOKEN);
