import React from 'react';
import SpeechRecognition, { useSpeechRecognition } from 'react-speech-recognition';

const Dictaphone = (props) => {
  
  const {
    transcript,
    listening,
    resetTranscript,
    browserSupportsSpeechRecognition
  } = useSpeechRecognition();

  if (!browserSupportsSpeechRecognition) {
    return <span>Browser doesn't support speech recognition.</span>;
  }

  function handleRelease() {
    setTimeout(() => {
      SpeechRecognition.stopListening();
      console.log(transcript);
      props.updateMessages(transcript);
      resetTranscript();
    },1000);
  }

  return (
    <div className="dictaphone">
      <div id="mic-light" className={ listening ? "on" : "off" }></div>
      <button
        onMouseDown={() => SpeechRecognition.startListening({ continuous: true })}
        onTouchStart={() => SpeechRecognition.startListening({ continuous: true })}
        onMouseUp={handleRelease}
        onTouchEnd={handleRelease}
      >Push to Talk</button>
    </div>
  );
};
export default Dictaphone;