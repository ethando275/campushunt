import React, { useState } from 'react';
import EmojiPicker from 'emoji-picker-react';

function EmojiSelector() {
  const [chosenEmoji, setChosenEmoji] = useState(null);

  const onEmojiClick = (event, emojiObject) => {
    setChosenEmoji(emojiObject);
  };

  return (
    <div>
      {chosenEmoji && <span>{chosenEmoji.emoji}</span>}
      <EmojiPicker onEmojiClick={onEmojiClick} />
    </div>
  );
}

export default EmojiSelector;