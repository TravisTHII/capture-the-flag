import "./App.css";
/**
 * BONUS: The script used to capture the flag 🥳
 * 1) navigate to https://tns4lpgmziiypnxxzel5ss5nyu0nftol.lambda-url.us-east-1.on.aws/challenge
 * 2) paste the following in to the console line by line
 *
 * const bTags = document.getElementsByTagName('b')
 * const characters = []
 * for (i of bTags) { if(i.className === 'ramp ref') characters.push(i.getAttribute('value')); }
 * console.log(characters.join(""))
 */
import { useState, useEffect, useRef } from "react";

type Flag = string[];

function TypeWriter({ flag }: { flag: Flag | undefined }) {
  if (!flag) return; // exit early if flag is undefined

  const [characters, setCharacters] = useState<Flag>([]);

  const executed = useRef(false); // ensure the useEffect is only ran once

  const updateCharacters = (c: string) => {
    setCharacters((prev) => [...prev, c]);
  };

  useEffect(() => {
    if (executed.current) return; // exit early if already ran

    executed.current = true;

    // store the index of the flag array
    let pointer = 0;

    const i = setInterval(() => {
      // only run when the pointer is less than length of flag
      if (pointer < flag.length) {
        // update characters with the next flag
        updateCharacters(flag[pointer]);

        // increment the pointer
        pointer++;
      }
    }, 500); // half a second

    // clearInterval on cleanup
    return () => {
      if (pointer === flag.length) clearInterval(i);
    };
  }, []);

  return (
    <ul>
      {characters.map((character, index) => (
        <li key={index}>{character}</li>
      ))}
    </ul>
  );
}

function Flag() {
  const [flag, setFlag] = useState<Flag>([]);
  const [loading, setLoading] = useState(false);

  const fetched = useRef(false); // ensure the useEffect is only ran once

  useEffect(() => {
    if (fetched.current) return;

    fetched.current = true;

    // self invoking async function
    (async () => {
      try {
        // start loading
        setLoading(true);

        const url =
          "https://wgg522pwivhvi5gqsn675gth3q0otdja.lambda-url.us-east-1.on.aws/626c65";

        const response = await fetch(url);

        // decode the response as text
        const result = await response.text();

        // split the flag into an array of 1 character strings
        setFlag(result.split(""));

        // stop loading
        setLoading(false);
      } catch (error) {
        console.error("An error occured:", error);
      }
    })();
  }, []);

  return <>{loading ? "Loading..." : <TypeWriter flag={flag} />}</>;
}

export default function App() {
  return (
    <div className="App">
      <h1>Hello, Ramp Team!</h1>
      <Flag />
    </div>
  );
}
