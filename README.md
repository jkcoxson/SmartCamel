# SmartCamel
AI discord bot that learns from conversations on Discord and chats with people


## Usage
1. Install Node
2. ```npm install discord.js```
3. Install Python
4. ```pip3 install chatterbot```
5. Create config.json
```{"token":"pastetokenhere","chatChannel:"","learnChannel":""}```
6. Run ```~chat``` and ```~learn``` in their respective channels
The bot will learn from conversations that happen in your learn channel with a 60 second timeout.
## About
This was an interesting one day project to get my feet wet in machine learning and python sockets. 
This will be incorporated into CamelBot eventually
## Issues
There is a memory leak with the bot listening for a response from the python chatbot.
The python program will crash if the Discord bot isn't already running
