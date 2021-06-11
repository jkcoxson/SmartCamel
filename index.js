// Smart Camel
// Testing machine learning in a discord bot
// yolo


console.log("\n"+  
"                                   jkcoxson                                     \n"+
"\n\n"+
"                               ./#%#########%%(,                                \n"+
"                         .*////(#%#########%%%(////,                            \n"+
"                       ,/#%%%%%##########%%&&&&%%%%#(/(/,                       \n"+
"                    .*/#%%##############%%&&%%#######%%%#(*,                    \n"+
"                    *#%%##%%%#####%%#####%%%#######%%%##%%#*                    \n"+
"                    ,(###%&&%##%#(//(########%%%###%&&%###(*                    \n"+
"                    *#%%%%%%%###/*,*(%%%%%%#((//(##%&&%%%%#*                    \n"+
"                    .*(%&&%###(,...,*//////*,. .,/#%%&&&%(*.                    \n"+
"                       *(#((#%%%####((/,,*/(#####%%#((((*                       \n"+
"                    .,*,.  ,#@@&%##%@@%**#@@&##%&@@%*. .,*,.                    \n"+
"                    *(%%#((#&@%.   *%@&##%@&/.  .(@@%(((%%#*                    \n"+
"                    ,(%&&%%&@@&(/(&@@@@@@@@@@&#/(%@@&%%&&&#*                    \n"+
"                    ,//*. .,(%&&&&%%%%#((#%%%%&&&&%(,. .*//,                    \n"+
"                       .***,,,,..,,...*((/,..,,..,,,,***,                       \n"+
"                      .*//*,,,**,**,**(#(/*,,*****,,,*//*.                      \n"+
"                      .,//*,,,,,,,,,/(#((*,,,,,,,,,,,*//*.                      \n"+
"                      .*//*,,,,,,***,,.,,,,,***,,,,,,*//*.                      \n"+
"                      .,//*,,,,,,/((/******/((/*,,,,,*//*.                      \n"+
"                         .*//,,,,,,,/(#((#(/*,,,,,,*/*.                         \n"+
"                   ......,/(((/*****,,,,,,,,*****/(((/,......                   \n"+
"            ..   *#@@@@@@@@@@@@@@@@&(*,,,,*(&@@@@@@@@@@@@@@@@%*.  ..            \n"+
"         .(&@@@@@&%#############%%&&&&&&&&&&&&%%#############%&@@@@@@#,         \n"+
"         .(@@@&&&&%#############%%&&&&&&&&&&&&%%#############%%&&&&@@#,         \n"+
"         ,(@@&&%&%%#############%%%%%%%%%%%%%%%%#############%%&%%&@@#,         \n"+
"    ,#@@@@@@@&&&&%%##########################################%%&&&&@@@@@@@%*    \n"+
"    ./##(///((#####################################################(///(##(,    \n"+
"    ./((/***/((((#%&%%####################################%%&%##(#(/***/((/,    \n"+
"    ./##(/*/((#(##%&&%##%#################################%&&%##(#((/**/(#/,    \n"+
"    ./((*,,,/(####%&&%####################################%%&%##(#(/*,,*((/,    \n"+
"    ./((*,.,*(####%&%%####################################%&&%####(/,..*((/,    \n"+
"    ./((*,.,/(####%&&&%%%#################################%%&%##(#(/,.,*((/,    \n"+
"    ./((*,.,*(####%&&&&%%##%%##########################%%%&&&%####(/,..*((/,    \n")

const Discord = require('discord.js');
const client = new Discord.Client({ partials: ['MESSAGE', 'CHANNEL', 'REACTION'] });
const config = require('./config.json');
const fs = require('fs')
const net = require('net');
const port = config.port
const host = config.address
let chatbot

let countDown = 60
let learnedMessages = []

const server = net.createServer();
server.listen(port, host, () => {
    console.log('TCP Server is running on port ' + port +'.');
});

server.on("connection", (client)=>{
    chatbot=client
});



client.on('message', async message=>{
    if(message.author.bot==false&&message.content.length>1&&message.mentions.members.size<1&&!message.content.includes("@everyone")&&!message.content.includes("@here")){
        if(message.content=="~chat"){
            message.reply("I'll chat with people here now")
            config.chatChannel=message.channel.id
            fs.writeFileSync("./config.json",JSON.stringify(config, null, "\t"))
            return;
        }
        if(message.content=="~learn"){
            message.reply("I'll learn from chat here now")
            config.learnChannel=message.channel.id
            fs.writeFileSync("./config.json",JSON.stringify(config, null, "\t"))
            return;
        }
        if(message.channel.id==config.chatChannel){
            message.channel.startTyping();
            let botResponse = await(getResponse(message.content))
            if(!botResponse.startsWith("The current time is")){
                message.channel.send(botResponse)
            }
            message.channel.stopTyping();
        }else{
            if(message.channel==config.learnChannel){
                countDown=60
                learnedMessages.push(message.content)
            }
            
        }
        
        
    }
})


async function getResponse(message){
    return new Promise(async(resolve,reject)=>{
        chatbot.write(JSON.stringify({
            "packet":"message",
            "message":message
        }))
        let responded = false
        while(!responded){
            await(waitData()).then(response=>{
                resolve(response)
                
            }).catch(()=>{})
        }
    })
}
function waitData(){
    return new Promise((resolve,reject)=>{
        chatbot.once('data', (data)=>{
            try{
                packet = JSON.parse(data)
                if(packet.packet=="response"){
                    chatbot.removeAllListeners()
                    resolve(packet.response)
                }else{
                    reject("bad no")
                }
            }catch{
                console.log("Bad packet: "+data)
                reject();
            }
        })
    })
}



setInterval(()=>{
    countDown--;
    if(countDown==0){
        if(learnedMessages.length>4){
            console.log("Sent new training data")
            chatbot.write(JSON.stringify({
                "packet":"train",
                "conversation":learnedMessages
            }))
        }else{
            console.log("Discarding messages, only had "+learnedMessages.length.toString()+" messages.")
        }
        learnedMessages=[]
        if(learnedMessages.length>0){
            client.channels.cache.get(config.learnChannel).send("The conversation has ended")
        }
        
    }
},1000)








client.login(config.token);

