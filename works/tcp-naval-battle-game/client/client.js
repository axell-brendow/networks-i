const { createMatchMenu } = require("./input");
const { question, readlineInterface } = require("./io");
const { client, serverHost, serverPort } = require("./clientSocket");
const Messages = require("./Messages");
const Observers = require("./Observers");

const { delay } = require("../utils");

const observers = new Observers();
const messages = new Messages(client, observers);

client.connect(serverPort, serverHost, () => {
  // console.log("Connected");
});

client.on("data", msg => {
  const message = JSON.parse(msg.toString());

  // console.log(`Message received (${new Date().toLocaleString()}):`, message);

  observers.runObservers(message, messages);
});

client.on("close", () => {
  console.log("Connection closed");
});

(async () => {
  console.log("---- 🎯 Be welcome to the Naval Battle Game 🎯 ----");
  console.log();
  let operation;

  while (operation !== "S") {
    operation = await question(`Type:
Q to Quit
N to start a new match

: `);
    console.log();
    operation = operation.toUpperCase();

    switch (operation) {
      case "N":
        createMatchMenu(messages);
        break;
    }

    await delay(500);
    console.clear();
  }

  client.destroy();
  readlineInterface.close();
  process.exit(0);
})();
