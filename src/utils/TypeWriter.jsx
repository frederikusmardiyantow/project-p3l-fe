/* eslint-disable react/prop-types */
import { useState, useEffect } from "react";

function Typewriter({ children }) {
  const [text, setText] = useState("");
  const [isTyping, setIsTyping] = useState(true);

  const typewriterText = children; // Gantilah dengan teks yang ingin Anda ketikkan.

  useEffect(() => {
    let currentIndex = 0;
    const speed = 50; // Kecepatan ketikan (ms per karakter)

    const typingInterval = setInterval(() => {
      if (currentIndex === (typewriterText.length - 1)) {
        clearInterval(typingInterval);
        setIsTyping(false);
      } else {
        setText((prevText) => prevText + typewriterText[currentIndex]);
        currentIndex++;
      }
    }, speed);

    return () => {
      clearInterval(typingInterval);
    };
  }, [typewriterText]);

  return (
    <div>
      <span>{text}</span>
      {isTyping && <span>|</span>}{" "}
      {/* Menambahkan cursor (tanda pipa) selama ketikan berlangsung */}
    </div>
  );
}

export default Typewriter;
