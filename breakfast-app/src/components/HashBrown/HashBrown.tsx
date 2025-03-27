import React, { useState } from 'react';
import styles from './HashBrown.module.css';

const HashBrown: React.FC = () => {
  const [hashOutput, setHashOutput] = useState('');

  const calcHash = async (value: string): Promise<string> => {
    try {
        console.log(value);
        const response = await fetch('https://breakfastatjimmys.ashypebble-3d2c7fd1.westus.azurecontainerapps.io/hashbrown', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ data: value }),
      });

      if (!response.ok) {
        throw new Error('Not OK Response');
      }

      const hash: string = await response.text();
      return hash;
    } catch (error) {
      console.error('Error in sending request to Jimmy', error);
      return '';
    }
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const inputElement = document.getElementById('inputData') as HTMLInputElement;
    const inputText: string = inputElement.value;
    const hash = await calcHash(inputText);
    setHashOutput(hash);
    inputElement.value = '';

    // Hide the response box after 1 minute (60000 milliseconds)
    setTimeout(() => {
      setHashOutput('');
    }, 3000);
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(hashOutput).then(() => {
      console.log('Copied to clipboard: ' + hashOutput);
    }).catch((error) => {
      console.error('Error in copying to clipboard', error);
    });
  };

  return (
    <div className={styles.hashbrown}>
      <h1>Breakfast at Jimmy's</h1>
      <form id="postForm" onSubmit={handleSubmit}>
        <label>Order Number:</label>
        <input type="text" id="inputData" name="data" required autoComplete="off" />
        <button type="submit">Submit</button>
      </form>
      {hashOutput && (
        <div id="response" className={styles.response}>
          <h2>Response:</h2>
          <p id="responseData">{hashOutput}</p>
          <button id="copyButton" className={styles.copyButton} onClick={copyToClipboard}>Copy to Clipboard</button>
        </div>
      )}
    </div>
  );
};

export default HashBrown;
