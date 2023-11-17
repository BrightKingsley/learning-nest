import { Injectable } from "@nestjs/common";
import { readFile, writeFile } from "fs/promises";

const messagesFile = "messages.json";

@Injectable()
export class MessagesRepository {
  async findOne(id: string) {
    const contents = await readFile(messagesFile, "utf-8");
    const messages = JSON.parse(contents);

    return messages[id];
  }

  async findAll() {
    const contents = await readFile(messagesFile, "utf-8");
    const messages = JSON.parse(contents);

    return messages;
  }

  async create(content: string) {
    const contents = await readFile(messagesFile, "utf-8");
    const messages = JSON.parse(contents);

    const id = Math.floor(Math.random() * 999);

    messages[id] = {
      id,
      content,
    };
    await writeFile(messagesFile, JSON.stringify(messages));
  }
}
