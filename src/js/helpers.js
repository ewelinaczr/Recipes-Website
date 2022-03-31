import { TIMEOUT_SEC } from './config.js';
import { uploadRecipe } from './model.js';

// Reusable functions

// Reject promise after some time
const timeout = function (s) {
  return new Promise(function (_, reject) {
    setTimeout(function () {
      reject(new Error(`Request took too long! Timeout after ${s} second`));
    }, s * 1000);
  });
};

// Api data fetch or reject after timeout
export const getJSON = async function (url) {
  try {
    const res = await Promise.race([fetch(url), timeout(TIMEOUT_SEC)]);
    const data = await res.json();

    // Error message from API (message/status)
    if (!res.ok) throw new Error(`${data.message} (${res.status})`);
    return data;
  } catch (err) {
    throw err;
  }
};

// Api data sent
export const sendJSON = async function (url, uploadData) {
  try {
    const fetchPro = fetch(url, {
      // type of request
      method: 'POST',
      // info about content/data format
      headers: {
        'Content-Type': 'application/json',
      },
      // data to send
      body: JSON.stringify(uploadData),
    });
    const res = await Promise.race([fetchPro, timeout(TIMEOUT_SEC)]);
    const data = await res.json();

    // Error message from API (message/status)
    if (!res.ok) throw new Error(`${data.message} (${res.status})`);
    return data;
  } catch (err) {
    throw err;
  }
};
