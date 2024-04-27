// Encryption algorithm in Node.js (MODE 1 - encrypt with RSA private key)

// Import necessary modules
const crypto = require('crypto');

function encryptSecret(secret, privateKey) {
    const encryptedData = crypto.privateEncrypt({
        key: privateKey,
        padding: crypto.constants.RSA_PKCS1_PADDING
    }, Buffer.from(secret));

    return encryptedData.toString('base64');
}

function encryptContent(content, secret) {
    const iv = crypto.randomBytes(8).toString('hex');
    const cipher = crypto.createCipheriv('aes-256-cbc', secret, iv);

    let encryptedData = cipher.update(content, 'utf8', 'base64');
    encryptedData += cipher.final('base64');

    return iv + encryptedData;
}

function randomString(length) {
	const chars = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
	
    let result = '';
    
	for (var i = length; i > 0; --i) result += chars[Math.floor(Math.random() * chars.length)];
	
    return result;
}

function clearResults()
{
	document.getElementById("x-sign").value = "";
	document.getElementById("body").value = "";
}

function setResults(sign, encryptedContent)
{
	document.getElementById("x-sign").value = sign;
	document.getElementById("body").value = encryptedContent;
}

function useExampleKey(e)
{
	try{
		e.preventDefault();
		
		const exampleKey = "-----BEGIN RSA PRIVATE KEY-----\n" +
                                             "MIIBOgIBAAJBAKj34GkxFhD90vcNLYLInFEX6Ppy1tPf9Cnzj4p4WGeKLs1Pt8Qu\n" +
                                             "KUpRKfFLfRYC9AIKjbJTWit+CqvjWYzvQwECAwEAAQJAIJLixBy2qpFoS4DSmoEm\n" +
                                             "o3qGy0t6z09AIJtH+5OeRV1be+N4cDYJKffGzDa88vQENZiRm0GRq6a+HPGQMd2k\n" +
                                             "TQIhAKMSvzIBnni7ot/OSie2TmJLY4SwTQAevXysE2RbFDYdAiEBCUEaRQnMnbp7\n" +
                                             "9mxDXDf6AU0cN/RPBjb9qSHDcWZHGzUCIG2Es59z8ugGrDY+pxLQnwfotadxd+Uy\n" +
                                             "v/Ow5T0q5gIJAiEAyS4RaI9YG8EWx/2w0T67ZUVAw8eOMB6BIUg0Xcu+3okCIBOs\n" +
                                             "/5OiPgoTdSy7bcF9IGpSE8ZgGKzgYQVZeN97YE00\n" +
                                             "-----END RSA PRIVATE KEY-----";
		
		document.getElementById("key").value = exampleKey;
	}
	catch(e){
		console.error(e);
	}
}

function useExampleRequest(e)
{
	try{
		e.preventDefault();
		
		const exampleRequest = '{"access_level":0,"action":"getPin","card_id":123456}';
		
		document.getElementById("request").value = exampleRequest;
	}
	catch(e){
		console.error(e);
	}
}

function copyXSignToClipboard(e)
{
	e.preventDefault();
		
	const str = document.getElementById("x-sign").value;
	navigator.clipboard.writeText(str); 
}

function copyBodyToClipboard(e)
{
	e.preventDefault();
	
	const str = document.getElementById("body").value;
	navigator.clipboard.writeText(str); 
}

function startEncrypt(e)
{
	try{
		e.preventDefault();
		
		clearResults();
		
		const key = document.getElementById("key").value;
		const request = document.getElementById("request").value;

		const secret = randomString(32) // 'RandomString32CharactersLength12'; // 32 characters; must be randomly generated in every request
		const sign = encryptSecret(secret, key); // add to the request header as 'x-sign'
		const encryptedContent = encryptContent(request, secret); // set this to be the request body

		setResults(sign, encryptedContent);
	}
	catch(e){
		console.error(e);
	}
}

document.getElementById("go").addEventListener("click", startEncrypt);

document.getElementById("useExampleKey").addEventListener("click", useExampleKey);
document.getElementById("useExampleRequest").addEventListener("click", useExampleRequest);

document.getElementById("copyxsign").addEventListener("click", copyXSignToClipboard);
document.getElementById("copybody").addEventListener("click", copyBodyToClipboard);
