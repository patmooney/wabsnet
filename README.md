# WABSNET

### Run server

    yarn start

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

### Add a new application

- Create a new app

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

- Add it to `./src/core.ts`
- TODO: apps-store should allow users to choose the apps they have installed.

### TODO

- Once you have gained temporary access to a user's computer you need to:
   - ~~list files~~
   - ~~download all/files of interest~~
   - some files may be too large to download in the time window requiring further key decrypting
   - this all leads to the user having to write fully automated code (and perhaps interface?)

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

- Electron App to give some sort of user-friendly presentable front-end to the goings-on, could display money, threat level, emails, active connections
