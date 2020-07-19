"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
// Comentar lo de abajo si es en produccion en heroku por ejemplo.
const dotenv_1 = require("dotenv");
dotenv_1.config();
// Comentar lo de arriba si es en produccion en heroku por ejemplo.
const discord_js_1 = require("discord.js");
// Config Prefix
const config_json_1 = require("./config.json");
// New Client
const client = new discord_js_1.Client();
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
    warnThreshold: 4,
    kickThreshold: 7,
    banThreshold: 7,
    maxInterval: 2000,
    warnMessage: "{@user} para un poquito con los mensajes!",
    kickMessage: "**{user_tag}** expulsado por pesado!",
    banMessage: "**{user_tag}** baneado por spamear, nos vemos en disney!",
    maxDuplicatesWarning: 3,
    maxDuplicatesKick: 6,
    maxDuplicatesBan: 6,
    excepttPermissions: ["ADMINISTRATOR"],
    ignoreBots: true,
    verbose: true,
    ignoredUsers: [],
    ignoredRoles: [],
});
// Estado del Bot
const presense = () => {
    var _a;
    (_a = client.user) === null || _a === void 0 ? void 0 : _a.setPresence({
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
client.on("guildMemberAdd", (member) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    // Busqueda de canales
    const channel = member.guild.channels.cache.find((channel) => channel.name === "👋bienvenidas");
    const rules = member.guild.channels.cache.find((channel) => channel.name === "👉🏼reglas");
    // Comprobar si existe el canal
    if (!channel)
        return;
    // Buscar un Rol
    const role = member.guild.roles.cache.find((role) => role.name === "Player");
    // Agregar el Rol buscado al nuevo miembro.
    yield member.roles.add(role);
    // Mensaje de bievenida
    const welcomeEmbed = new discord_js_1.MessageEmbed()
        .setTitle("Bienvenid@")
        .setDescription(`${member} espero que te diviertas! Cuando puedas pasate a leer las <#${rules === null || rules === void 0 ? void 0 : rules.id}>`)
        .setThumbnail(`${(_a = member.user) === null || _a === void 0 ? void 0 : _a.defaultAvatarURL}`)
        .setFooter("Servidor de Discord de la Comunidad ASDASD")
        .setTimestamp();
    // Mensaje enviado al canal especifico.
    channel.send(welcomeEmbed);
}));
// Adm messages
client.on("message", (message) => __awaiter(void 0, void 0, void 0, function* () {
    var _b, _c, _d, _e;
    // Mensajes enviados en el servidor
    console.log(message.content);
    // Text random cuando alguien dice "hola"
    const random = Math.floor(Math.random() * msgRandom.length);
    if (message.content.startsWith("hola")) {
        message.channel.send(msgRandom[random]);
    }
    if (message.content.startsWith(`${config_json_1.prefix}`)) {
        // Test Ping
        if (message.content.startsWith(`${config_json_1.prefix}ping`)) {
            // message.channel.send('🚀 pong');
            message.reply("pong");
        }
        // Funcion para Expulsar a un miembro !!kick @user
        if (message.content.startsWith(`${config_json_1.prefix}kick`)) {
            try {
                // Revisar si el usuario tiene los permisos para expulsar
                if ((_b = message.member) === null || _b === void 0 ? void 0 : _b.hasPermission(["KICK_MEMBERS"])) {
                    const member = (_c = message.mentions.members) === null || _c === void 0 ? void 0 : _c.first();
                    if (member) {
                        const kickedMember = yield member.kick();
                        return message.channel.send(`${kickedMember.user.username} expulsado por xxx!`);
                    }
                }
                return message.reply("No tenes los previlegios de sacar a nadie de aca!");
            }
            catch (err) {
                return message.reply("Hubo un error en mi sistema!");
            }
        }
        // Funcion para banear a un miembro !!ban @user
        if (message.content.startsWith(`${config_json_1.prefix}ban`)) {
            try {
                //Revisar si el miembro tiene los permisos para banear.
                if ((_d = message.member) === null || _d === void 0 ? void 0 : _d.hasPermission(["BAN_MEMBERS"])) {
                    const msg = message.content.split(" ", 4);
                    const info = message.content.split('"');
                    const member = (_e = message.mentions.members) === null || _e === void 0 ? void 0 : _e.first();
                    const days = Number(msg[2]);
                    const rea = info[1];
                    if (days && rea) {
                        const banMember = yield (member === null || member === void 0 ? void 0 : member.ban({ days: days, reason: rea }));
                        return message.channel.send(`${banMember === null || banMember === void 0 ? void 0 : banMember.user.username} baneado por xxx!`);
                    }
                    else {
                        return message.reply('Ese formato esta mal, te dejo un ejemplo => !!ban @User 2 "razones"');
                    }
                }
                return message.reply("No tenes los previlegios de banear!");
            }
            catch (err) {
                return message.reply("Hubo un error en mi sistema!");
            }
        }
    }
}));
client.login(process.env.DISCORD_TOKEN);
