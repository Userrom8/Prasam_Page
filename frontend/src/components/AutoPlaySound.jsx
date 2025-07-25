import { useEffect } from "react";

import { Howl } from "howler";

export default function AutoPlaySound() {
  useEffect(() => {
    const sound = new Howl({
      src: ["/sound.mp3"], // Ensure the file is in the "public" folder
      autoplay: true, // Try to play automatically
      volume: 1, // Set volume (0.0 to 1.0)
      loop: false, // Set to true for looping
    });

    return () => sound.stop(); // Cleanup on unmount
  }, []);
}
