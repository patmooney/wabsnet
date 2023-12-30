# WABSNET

### Run server

    yarn start

### Commands

    yarn cmd [cmd-name] [sub-command | args]

 - news
 - chat search --name="<full-name>"
 - chat chat --username=<username>
 - netstat scan
 - netstat trace --remoteIp=<ip>
 - file list --remoteIp=<ip> --token=<token>
 - file copy --remoteIp=<ip> --token=<token> --fileName=<file-name>

Token can be gained by solving coding challenges outputted by `trace`, or just use `test` as the token.

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
