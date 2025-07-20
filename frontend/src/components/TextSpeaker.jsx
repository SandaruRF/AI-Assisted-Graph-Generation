let currentUtterance = null;

export const speakText = (text, onStart = () => {}, onEnd = () => {}) => {
  if (!("speechSynthesis" in window)) {
    alert("Sorry, your browser does not support text-to-speech.");
    return;
  }

  const synth = window.speechSynthesis;

  if (synth.speaking && currentUtterance?.text === text) {
    if (synth.paused) {
      synth.resume();
    } else {
      synth.pause();
    }
    return;
  }

  synth.cancel();

  const utterance = new SpeechSynthesisUtterance(text);
  currentUtterance = utterance;

  utterance.onstart = () => onStart();
  utterance.onend = () => onEnd();
  utterance.onerror = () => onEnd();

  utterance.rate = 1;
  utterance.pitch = 1;
  utterance.lang = "en-US";

  synth.speak(utterance);
};
