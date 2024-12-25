// Import necessary modules
const crypto = require('crypto');

function decryptV3(encryptedData, encryptedSessionKey, privateKey)
{
    const buffer = Buffer.from(encryptedSessionKey, 'hex');
    const decryptedKey = crypto.privateDecrypt(
      {
        key: privateKey,
        padding: crypto.constants.RSA_PKCS1_OAEP_PADDING,
    },
      buffer
    );

    const encryptedBuffer = Buffer.from(encryptedData, 'hex');
    const iv = encryptedBuffer.slice(0, 16);
    const encryptedContent = encryptedBuffer.slice(16);

    const decipher = crypto.createDecipheriv('aes-256-cbc', decryptedKey, iv);
    let decrypted = decipher.update(encryptedContent);
    decrypted = Buffer.concat([decrypted, decipher.final()]);

    return JSON.parse(decrypted.toString('utf8'));
}

function encryptV3(jsonData, encryptedSessionKey, privateKey)
{
    const buffer = Buffer.from(encryptedSessionKey, 'hex');
    const decryptedKey = crypto.privateDecrypt(
      {
        key: privateKey,
        padding: crypto.constants.RSA_PKCS1_OAEP_PADDING,
    },
      buffer
    );

    const sessionKeyBuffer = Buffer.from(decryptedKey);
    const data = JSON.stringify(jsonData);

    const iv = crypto.randomBytes(16); // aes-256-cbc uses 16-byte IV
    const cipher = crypto.createCipheriv('aes-256-cbc', sessionKeyBuffer, iv);
    let encrypted = cipher.update(data, 'utf8', 'hex');
    encrypted += cipher.final('hex');
    const result = iv.toString('hex') + encrypted;
    return result;
}

function startDecrypt(e)
{
    try{
        e.preventDefault();

        const encryptedData = document.getElementById("data").value;
        const encryptedSessionKey = document.getElementById("session_key").value;
        const privateKey = document.getElementById("private_key").value;

        const result = decryptV3(encryptedData, encryptedSessionKey, privateKey);

        document.getElementById("result").value = result;
    }
    catch(e)
    {
        alert(e);
    }
}

function startEncrypt(e)
{
    try{
        e.preventDefault();

        const jsonData = document.getElementById("data").value;
        const encryptedSessionKey = document.getElementById("session_key").value;
        const privateKey = document.getElementById("private_key").value;

        const result = encryptV3(jsonData, encryptedSessionKey, privateKey);

        document.getElementById("result").value = result;
    }
    catch(e)
    {
        alert(e);
    }
}

function wireEventHandlers()
{
    document.getElementById("decrypt-v3").addEventListener("click", startDecrypt);
    document.getElementById("encrypt-v3").addEventListener("click", startEncrypt);
}

wireEventHandlers();