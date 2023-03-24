import React from 'react';
import './App.css';
import Dictaphone from './Dictaphone';
import MessageFeed from './MessageFeed'
import Speech from 'speak-tts'
import { ChatGPTAPI } from 'chatgpt-web'
import debounce from 'lodash.debounce';

const INIT_PHRASE = "You are a quirky personal assistant named Bean. All of your answers should be shorter than 100 words. Do not say that you are an AI. Play along and do your best to give funny, implausible responses to question even you don't know the answer. When you are ready to begin, say 'Hi, I'm Bean.'";

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      messages: []
    };

    // Setup speech object
    console.log("Setting up speech");
    this.speech = new Speech()
    this.speech.init({
      'volume': 0.75,
      'lang': 'en-GB',
      //'splitSentences': true
    }).then((data) => {
      // The "data" object contains the list of available voices and the voice synthesis params
      console.log("Speech is ready, voices are available", data)
      this.speech.setVoice('Daniel');
    }).catch(e => {
      alert("An error occured while initializing speech : " + e)
    })

    console.log("env", process.env);

    // Setup ChatGPT object
    this.chatbot = new ChatGPTAPI({
      apiKey: process.env.REACT_APP_OPENAI_API_KEY
    });

    this.debouncedInitialize = debounce(() => {
      console.log("Initializing Beanbot");
      this.initializeBot();
    }, 1000)
  }

  componentDidMount() {
    this.debouncedInitialize();
  }

  initializeBot() {
    const t = this;
    async function openaiCall() {
      const res = await t.chatbot.sendMessage(INIT_PHRASE)
      console.log(res.text);
      t.receivedBotResponse(res.text);
    }
    openaiCall();
  }

  getBotAnswer(humanQuery) {
    const t = this;
    async function openaiCall() {
      const res = await t.chatbot.sendMessage(humanQuery)
      console.log(res.text);
      t.receivedBotResponse(res.text);
    }
    openaiCall();
  }

  readAloud = (message) => {
    console.log("Speaking: "+message);
    this.speech.speak({
      text: message,
      queue: false // current speech will be interrupted
    }).then((data) => {
        console.log("Success!", data);
    }).catch(e => {
        alert("An error occurred while speaking:" + e);
    })
  }

  receivedBotResponse = (botResponse) => {
    this.addToTranscript("response", botResponse)
    this.readAloud(botResponse);
  }

  receivedDictation = (humanQuery) => {
    this.addToTranscript("query", humanQuery)
    this.getBotAnswer(humanQuery);
  }

  addToTranscript = (cssClass, text) => {
    // display our dictation as a message in the transcript
    this.setState({ messages: [...this.state.messages, {
      cssClass: cssClass,
      text: text
    }] });
  }
  
  render() {
    return (
      <div className="App">
        <header><h1>🫘 beanbot 1.0</h1></header>
        <MessageFeed messages={ this.state.messages } />
        <Dictaphone receivedDictation ={ this.receivedDictation } />
      </div>
    );
  }
}

export default App;
