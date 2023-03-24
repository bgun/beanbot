import React from 'react';
import './App.css';
import Dictaphone from './Dictaphone';
import MessageFeed from './MessageFeed'
import Speech from 'speak-tts'
import OpenAI from 'openai-api'



class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      messages: []
    };

    const OPENAI_API_KEY = process.env.REACT_APP_OPENAI_API_KEY;
    this.openai = new OpenAI(OPENAI_API_KEY);
    console.log("KEY", OPENAI_API_KEY);
  }

  componentDidMount() {
      (async () => {
        const gptResponse = await this.openai.complete({
            engine: 'davinci',
            prompt: 'What is the capital of Korea?',
            maxTokens: 5,
            temperature: 0.9,
            topP: 1,
            presencePenalty: 0,
            frequencyPenalty: 0,
            bestOf: 1,
            n: 1,
            stream: false,
            stop: ['\n', "testing"]
        });
        console.log("Sending GPT request");
        console.log(gptResponse.data.choices[0].text);
    })();

    this.speech = new Speech()
    this.speech.init({
      'volume': 1,
        'lang': 'en-GB',
        'rate': 1,
        'pitch': 1,
        'voice':'Google UK English Male',
        'splitSentences': true,
        'listeners': {
            'onvoiceschanged': (voices) => {
                //console.log("Event voiceschanged", voices)
            }
        }
    }).then((data) => {
      // The "data" object contains the list of available voices and the voice synthesis params
      //console.log("Speech is ready, voices are available", data)
    }).catch(e => {
      console.error("An error occured while initializing : ", e)
    })
  }

  readLatest = (message) => {
    this.speech.speak({
      text: message,
      queue: false, // current speech will be interrupted,
      listeners: {
          onstart: () => {
              console.log("Start utterance")
          },
          onend: () => {
              console.log("End utterance")
          },
          onresume: () => {
              console.log("Resume utterance")
          },
          onboundary: (event) => {
              console.log(event.name + ' boundary reached after ' + event.elapsedTime + ' milliseconds.')
          }
        }
      }).then(() => {
          console.log("Success!");
      }).catch(e => {
          console.error("An error occurred :", e);
      })
  }

  updateMessages = (newMessage) => {
    this.setState({ messages: [...this.state.messages, {
      message_type: "query",
      text: newMessage
    }] })

    const responseMessage = "This is my response."

    setTimeout(() => {
      this.readLatest(responseMessage);
      this.setState({ messages: [...this.state.messages, {
        message_type: "response",
        text: responseMessage
      }] })
    }, 1000);
  }
  
  render() {
    return (
      <div className="App">
        <header><h1>beanbot 1.0</h1></header>
        <MessageFeed messages={ this.state.messages } />
        <Dictaphone updateMessages={ this.updateMessages } />
      </div>
    );
  }
}

export default App;
