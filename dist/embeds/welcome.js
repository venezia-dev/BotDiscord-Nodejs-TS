"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const discord_js_1 = require("discord.js");
class default_1 extends discord_js_1.MessageEmbed {
    constructor(serverName, userAvatar, userMention, username, offTopicChannel) {
        super();
        const colors = [
            0xF44336,
            0xE91E63,
            0x9C27B0,
            0x3F51B5,
            0x2196F3,
            0x03A9F4,
            0x00BCD4,
            0x009688,
            0x4CAF50,
            0x8BC34A,
            0xCDDC39,
            0xFFEB3B,
            0xFFC107,
            0xFF9800,
            0x795548,
            0x9E9E9E
        ];
        const rand = Math.floor(Math.random() * (colors.length - 1));
        this.color = colors[rand];
        this.title = `Bienvenid@ a ${serverName}`;
        this.setThumbnail(userAvatar);
        this.description = `${userMention} (${username}), siéntete libre de hacer preguntas y conocer a otros desarrolladores con tus mismos intereses. Empieza en ${offTopicChannel}.`;
        this.timestamp = Date.now();
    }
}
exports.default = default_1;
