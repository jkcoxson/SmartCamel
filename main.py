import socket
from chatterbot import ChatBot
from chatterbot.trainers import ListTrainer
from chatterbot.trainers import ChatterBotCorpusTrainer
import json

HOST = '192.168.1.6'  # The server's hostname or IP address
PORT = 7894           # The port used by the server

bot = ChatBot(
    'CamelBot',
    storage_adapter='chatterbot.storage.SQLStorageAdapter',
    database_uri='sqlite:///database.sqlite3',  
    logic_adapters=[
        'chatterbot.logic.BestMatch',
        'chatterbot.logic.TimeLogicAdapter'],
)

listTrainer = ListTrainer(bot)
trainer = ChatterBotCorpusTrainer(bot)

trainer.train("chatterbot.corpus.english")
trainer.train("chatterbot.corpus.english.greetings")
trainer.train("chatterbot.corpus.english.conversations")
trainer.train("chatterbot.corpus.english.ai")
trainer.train("chatterbot.corpus.english.botprofile")
trainer.train("chatterbot.corpus.english.computers")
trainer.train("chatterbot.corpus.english.emotion")
trainer.train("chatterbot.corpus.english.food")
trainer.train("chatterbot.corpus.english.gossip")
trainer.train("chatterbot.corpus.english.health")
trainer.train("chatterbot.corpus.english.history")
trainer.train("chatterbot.corpus.english.humor")
trainer.train("chatterbot.corpus.english.literature")
trainer.train("chatterbot.corpus.english.money")
trainer.train("chatterbot.corpus.english.movies")
trainer.train("chatterbot.corpus.english.politics")
trainer.train("chatterbot.corpus.english.psychology")
trainer.train("chatterbot.corpus.english.science")
trainer.train("chatterbot.corpus.english.sports")
trainer.train("chatterbot.corpus.english.trivia")
listTrainer.train([
    'good bot',
    'I know I am'
])
listTrainer.train([
    'bad bot',
    'I am not smh'
])



with socket.socket(socket.AF_INET, socket.SOCK_STREAM) as s:
    s.connect((HOST, PORT))
    s.sendall(b'Hello, world')
    while True:
        data = s.recv(1024)
        packet = json.loads(str(data.decode("utf-8")))
        if(packet["packet"]=="message"):
            s.sendall(str(json.dumps({
                "packet":"response",
                "response":str(bot.get_response(packet["message"]))
            })+"\n").encode('utf-8'))
        if(packet["packet"]=="train"):
            listTrainer.train(packet["conversation"])
        
        try:
            "your mom"
        except:
            print("JSON parse error")