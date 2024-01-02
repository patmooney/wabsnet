# WABSNET

### Run server

    yarn start

### Run frontend + server

    yarn start-electron

### Build binaries

```
    yarn app:dist
```

Will create artifacts under `./build/`. More binary targets can be added, find them in `electron-builder-targets.txt` add them as necessary to package.json#build

### Commands

    yarn cmd [cmd-name] [sub-command | args]

 - news
 - chat search --name="[the full name]"
 - chat chat --username=[username]
 - netstat scan
 - netstat trace --remoteIp=[ip]
 - file list --remoteIp=[ip] --token=[token]
 - file copy --remoteIp=[ip] --token=[token] --fileName=[file-name]

Token can be gained by solving coding challenges outputted by `trace`, or just use `test` as the token.

### Help

All command should have help provided. Try using `yarn cmd help` to get started.

### Add a new application

- Create a new app

```
    // ./src/core/apps/example.ts
    import { networkManager } from "../../core";
    import { CommandManager } from "../../managers/commands";
    import { pause } from "../../utils/pause";

    // Sync function
    const helloWorld = () => "Hello, World!";

    // IData is always passed to functions, it contains whatever the user has passed as args
    const helloName = ({ name }: IData) => `Hello, ${name}!`;

    // Generator functions to send back a stream of data
    function* randomNumberGenerator ({ randomNumberCount }: IData) {
        try {
            for (let i = 0; i < randomNumberCount; i++) {
                yield Math.floor(Math.random() * 100);
            }
        } finally {
            // user has ended request, cleanup here optional
        }
    }

    // functions can be called too!
    const asyncFile = async () => {
        // ./src/core/content/apps/example/file.txt
        const fileContent = await catFile("example/file.txt");
        return fileContent;
    }

    const commands = new CommandManager();
    commands.registerCommand("helloWorld", helloWorld);
    commands.registerCommand("helloName", helloName);
    commands.registerCommand("random", randomNumberGenerator);
    commands.registerCommand("file", asyncFile);

    export const app: IApp = {
        name: "example",
        label: "The Example Application",
        description: "For demonstrating the creation of a new app",
        // should it appear in the app store?
        isIndexed: true,
        commands
    };

```

- Add it to `./src/core.ts`
- Call it `yarn cmd example helloName --name="Johnny Big Bollocks"`
- TODO: apps-store should allow users to choose the apps they have installed.

### Core Mechanics

- Carry out programming tasks to automate a complex hacking tool which generates wealth.
- The hacking tool will grow in complexity as more ciphers and attack _vectors_ are made available/discovered.
- Attack targets can have assets in $money or in $crypto.
- $crypto value will fluctuate creating more avenues for wealth generation/automation.
- Targets will vary greatly in their difficulty + value.
- Difficulty is given as their elusiveness: i.e. how can you find/execute attacks. And the complexity of ciphers requiered to decode their `token`
- **Businesses** are a means to attack customers, by compromising a business you can track remote traffic via their system.
- Business IPs can be gained from purchasing on the _darkwebz_ (perhaps with an additional key to stop people just scanning IPs)
- Game is completed 100% by gaining 100% efficiency, having all buinesses compromised and having all customers of those businesses automatically attacked.

### TODO

- Once you have gained temporary access to a user's computer you need to:
    - ~~list files~~
    - ~~download all/files of interest~~
    - some files may be too large to download in the time window requiring further key decrypting
    - this all leads to the user having to write fully automated code (and perhaps interface?)
- Applications should be installed manually, should start with only apps and help?
- Files on the user's computer may be a huge quantity of people's information which will need to be looked up online to identify a target
- Should be other ways in order to access IP address for other users.
- Maybe an online resource like a audio streaming site can be compromised and you can port-tunner through it to track user data packets
- Generate an obscene amount of contacts and find a nice way to compress the data
- Maybe some clues can be expressed in terms of points (x, y), the player will then have to render them to see the output visually
- Need a mechanism where numbers go up to show achievement. Could be the % of the main story completed?
    - Network speed, speeds up rate at which data is returned
    - Threat level, some mechanism where your system is under threat from bad actors
    - Money? Buy shit on the dark webz? I.e. key for a backdoor to a streaming service which gives better access to users.
    - Limit on number of active queries to the backendz?
- A way to watch for new connections to a comprimised online service, then to attack to steal bank info, crypto? - Fun part would be making it fully automated
- Have A ficticious comoddity(s) such as crypto which fluctuates in price, write code to track buy/sell.
- Money can be used to buy user dumps + backdoor keys
- Maintain stats on effectiveness of code, i.e. money gained per minute, attacks completed per minute etc.
- User's have a master key which can be calculted by continued attacks, the master key gives instant access to a compromised machine.
- User lists can be sold on the dark-webz, price dictated by size, accuracy and the value of the target.
- Electron App to give some sort of user-friendly presentable front-end to the goings-on, could display money, threat level, emails, active connections
- Main story acts as a tutorial, all other facets should be dynamically generated.
- App should give web addresses to local html files which require scraping, or can just host it on 127.0.0.1, maybe the site can have vulnerabilities built into it?
- User will need to open a bank account, which they will receive a bank-key that resides on their own virtual file storage (in-game). This file is required to access any money
- Users will have to keep their private files secure using "hard to compute, simple to verify" tasks (https://matt-rickard.com/hard-to-compute-simple-to-verify)
- Stop using console._whatever_ to output info, switch to a logger with levels. Silence for tests.

### Contracts

- Contracts from the _darkwebz_ will be an avenure for unlocking more mechanics and wealth generation.
- I.e. A contract will provide a target, the target may have a new/unfamilliar cipher or app requirement.

### Ciphers

- Main progression mechanic
- Programming tasks which need to be added to your hacking tool-kit and optimised.

### Apps

- Apps can be installed from the `apps` tool. Some apps are not indexed so will not show in the `list` command.
- Some apps should be related to the players progression to prevent people from installing them too early.
- An app gives you a way to contact/scrape/connect targets. I.e. `webbot` might be an example which continually makes requests to a website to capture traffic.

### STORY

 - Find news article about hacking activity
 - Contact journalist
 - Compromise journalist computer
 - Get contact list
 - Find details of each contact to identify short-list for potential hackers
 - Search on dark-webz forums for matching usernames
 - Recieve email from anon claiming to help find hacker if you complete a task
 - Task involves compromising a business to get a list of users, requires a programming task
 - Email list to anon
 - Get pointed to a secret dark-webz site
 - locate hacker
 - get given key to access online file storage for users (each requires programming task) (i.e. look at common interview tasks for inspiration). Maybe you need to write code which looks like:
```
    // My task - sort words in string by their character count, complete 10 times within 1s
    const sortWords = (str) => { ... }
    const str = wabsnet.send("task start 2abd442dfcs2");
    await wabsnet.send(`task end 2abd442dfcs2 ${JSON.stringify({ answer: sortWords(str) })}`);

    // Should spend some time finding examples of tasks which are HARD to compute but EASY to verify, that way we can generate and verify faster than an answer can be given
```
 - Get blackmailed for crypto
 - Create wallet (store wallet on virtual machine (i.e. in-game))
 - Introduction to automated money production, watch connected users to compromised business, hack them, look for crypto wallets (random)
 - Ends up with your wallet being stolen by the hacker who blackmails you
 - Get contacted by a security expert that has been watching you
 - Introduction to computer security (hard to compute, easy to verify)
 - Generate more wealth
 - Pay off hacker
 - etc...


### Remote sessions

 - You can execute any commands via a remote machine.
 - You should pass `--ssh=111.111.111.111 --sshToken=abc123xxxxxxxxx` to execute any command on a remote machine
 - Contextually, not all commands would work... probably just the `netstat` commands for now
 - In order to maintain the sshToken you need to continually attack and decode traffic for the target
 - Simultaneously, you need to be carrying out your actions via the remote machine (netstat scan/trace for ex.)
 - Businesses will have a website or similar which allows you to maintain a connection to trace traffic.
 - Create a new tool called webbot which continually creates traffic.
 - Businesses will have varying customer numbers, customer difficulty and customer assets.
 - The challenge comes from automating the maximum of customers you can attack and profit from.

```

            Business                                         Remote Target
        /      |       \                                          |
   [website] [netstat]  [ssh netstat]       ---->     [attack with remote token]
      /        |         \                                        |
  [webbot]   [token]     [remote token]                       [profit?]

```


### Business definition

```
    {
        "name": "Jim's fish shop",
        "keyLength": 10,
        "customersPerSecond": 0.01,
        "customerLifeSeconds": 60,
        "customerAvgDifficulty": 1,
        "customerDeviation": 1,
        "customerValueMultiplier": 0.5
    },
```

 - `keyLength`                  Equates to how many packets will need to be parsed to maintain the remote ssh key
 - `customersPerSecond`         `netstat scan --ssh=111.111.111.111 --sshToken=abc123xxxxxxxxx` will result in an average of `1 / customersPerSecond` customers connected
 - `customerLifeSeconds`        How long the customer remains connected to the business (attack time)
 - `customerAvgDifficult`       Ciphers will be scored on thier complexity, varying difficulties will decide on how their packets are encrypted.
 - `customerDeviation`          The range of difficulties presented by customers to this business.
 - `customerValueMultiplier`    `2 ^ (difficulty * customerValueMultiplier) = value`, i.e. `2 ^ (1 * 0.5) = 1.414`
