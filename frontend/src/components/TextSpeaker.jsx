let currentUtterance = null;

export const speakText = (text, onStart = () => {}, onEnd = () => {}, onPause = () => {}, onResume = () => {}) => {
  if (!("speechSynthesis" in window)) {
    alert("Sorry, your browser does not support text-to-speech.");
    return;
  }

  const synth = window.speechSynthesis;

  // Toggle pause/resume if same text is already speaking
  if (synth.speaking && currentUtterance?.text === text) {
    if (synth.paused) {
      synth.resume();
      onResume();
    } else {
      synth.pause();
      onPause();
    }
    return;
  }

  synth.cancel();

  const utterance = new SpeechSynthesisUtterance(text);
  currentUtterance = utterance;

  utterance.onstart = () => onStart();
  utterance.onend = () => onEnd();
  utterance.onpause = () => onPause();
  utterance.onresume = () => onResume();
  utterance.onerror = () => onEnd();

  utterance.rate = 1;
  utterance.pitch = 1;
  utterance.lang = "en-US";

  synth.speak(utterance);
};
