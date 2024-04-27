// Encryption algorithm in Node.js (MODE 1 - encrypt with RSA private key)

// Import necessary modules
const crypto = require('crypto');

function mode1_encryptSecret(secret, privateKey) {
    const encryptedData = crypto.privateEncrypt({
        key: privateKey,
        padding: crypto.constants.RSA_PKCS1_PADDING
    }, Buffer.from(secret));

    return encryptedData.toString('base64');
}

function mode1_encryptContent(content, secret) {
    const iv = crypto.randomBytes(8).toString('hex');
    const cipher = crypto.createCipheriv('aes-256-cbc', secret, iv);

    let encryptedData = cipher.update(content, 'utf8', 'base64');
    encryptedData += cipher.final('base64');

    return iv + encryptedData;
}

function mode1_decryptSecret(sign, publicKey) {
    const decryptedData = crypto.publicDecrypt({
        key: publicKey,
        padding: crypto.constants.RSA_PKCS1_PADDING
    }, Buffer.from(sign, 'base64'));

    return decryptedData.toString();
}

function mode1_decryptContent(encryptedContent, secret) {
    const iv = encryptedContent.slice(0, 16);
    const encryptedData = Buffer.from(encryptedContent.slice(16), 'base64');

    const decipher = crypto.createDecipheriv('aes-256-cbc', secret, iv);
    decipher.setAutoPadding(false);
    let decryptedData = decipher.update(encryptedData);
    decryptedData = Buffer.concat([decryptedData, decipher.final()]);

    return decryptedData.toString();
}






function randomString(length) {
	const chars = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
	
    let result = '';
    
	for (var i = length; i > 0; --i) result += chars[Math.floor(Math.random() * chars.length)];
	
    return result;
}







// start app code - MODE1 - encrypt 
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

function mode1_encrypt_useExampleKey(e)
{
	try{
		e.preventDefault();
		
		const exampleKey = "-----BEGIN RSA PRIVATE KEY-----\n" + 
			"MIICXQIBAAKBgQClQPjXnFwCbuJq17LXTav9a04Xokg6JopiA0gQcYzMC9sqImeG\n" + 
			"s3o7wtT7N8TcgPCMdEtYJmMTaTSGUSBeW6gdSdWmyTgreyJ6l08Ms6iP9hawPS+K\n" + 
			"beklQ1Pax+zJVg/tT7Bmvd0rZZwdIRrViVm2/5HpcvBX0aCXkJAPRIVXPwIDAQAB\n" + 
			"AoGAOyHrqWN2/RvmgyraAPb3M0Bhek2EoOJHpFjeQZwQMLeRXhtfhjDU7WuDQL2t\n" + 
			"AOZWrTuz9kAONdTwiZugBIOxvO3JIxEyx8i66kEgPhPuVOBYie9d9KevegsNLxbp\n" + 
			"wuPeSRTTIBuYPAJ2aHGwLhHh5OuvC+6pZayyIGS6isDCGqECQQDaKoQFf59JcZ4o\n" + 
			"y0k+bUL7jQOj/1tNy0VtsYjzfaf1wl4Kro28jTroXZiCUEbTao/z2h9bHqoo0HmR\n" + 
			"ZPjeR9fPAkEAwelqVCKk5G2SmpFaKBpbb3r9FfxGxjU9BZkgY3OCjs4I+Z3Piy6x\n" + 
			"Q87/Ub9e7dORqORuQbkzPfzJOMOKVsX1kQJAX27RqYYWK45j3Pxv4brx3g/lU8vU\n" + 
			"KMeOa1mJytlgq4SGlq2cmqo85oBqwjZThQ/MQKNdrAJR9OCdDRjaNIHAyQJBAK4L\n" + 
			"GJpndeRozHrbFzaDYaoPk3TWN5fTVO/fXoiktnwCRV/12sArqoMYGWWABG4lxMj4\n" + 
			"LlXjKjDq4JiIOXRkvWECQQC01Zv06ZLOpdRWBBn5MH6HUrLliAnmTgwb5tReRqkM\n" + 
			"De6l6ciHzyGSEfm+qMLigh6MTodGuDE5Qr2PSpvEojZW\n" + 
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

function mode1_startEncrypt(e)
{
	try{
		e.preventDefault();
		
		clearResults();
		
		const key = document.getElementById("key").value;
		const request = document.getElementById("request").value;

		const secret = randomString(32) // 'RandomString32CharactersLength12'; // 32 characters; must be randomly generated in every request
		const sign = mode1_encryptSecret(secret, key); // add to the request header as 'x-sign'
		const encryptedContent = mode1_encryptContent(request, secret); // set this to be the request body

		setResults(sign, encryptedContent);
	}
	catch(e){
		console.error(e);
	}
}
// end mode1_encrypt 


// mode1_decrypt
function mode1_decrypt_clearResults()
{
	document.getElementById("body").value = "";
}

function mode1_decrypt_setResults(results)
{
	document.getElementById("body").value = results;
}

function mode1_decrypt_useExampleKey(e)
{
	try{
		e.preventDefault();
		
		const exampleKey = "-----BEGIN PUBLIC KEY-----\n" + 
			"MIGfMA0GCSqGSIb3DQEBAQUAA4GNADCBiQKBgQClQPjXnFwCbuJq17LXTav9a04X\n" + 
			"okg6JopiA0gQcYzMC9sqImeGs3o7wtT7N8TcgPCMdEtYJmMTaTSGUSBeW6gdSdWm\n" + 
			"yTgreyJ6l08Ms6iP9hawPS+KbeklQ1Pax+zJVg/tT7Bmvd0rZZwdIRrViVm2/5Hp\n" + 
			"cvBX0aCXkJAPRIVXPwIDAQAB\n" + 
			"-----END PUBLIC KEY-----";
		
		document.getElementById("key").value = exampleKey;
	}
	catch(e){
		console.error(e);
	}
}

function mode1_startDecrypt(e)
{
	try{
		e.preventDefault();

		mode1_decrypt_clearResults();

		const xsign = document.getElementById("x-sign").value;
		const key = document.getElementById("key").value;
		const encryptedContent = document.getElementById("enccontent").value;

		decryptedSecret = mode1_decryptSecret(xsign, key);
		console.log("decrypted secret", decryptedSecret);

		decryptedContent = mode1_decryptContent(encryptedContent, decryptedSecret);

		mode1_decrypt_setResults(decryptedContent);
	}
	catch(e){
		alert(e);
	}
}
// end mode1_decrypt 

// bad code, refactor at some point 
if(document.getElementById("encrypt-mode1"))
{
	document.getElementById("encrypt-mode1").addEventListener("click", mode1_startEncrypt);

	document.getElementById("useExampleKey").addEventListener("click", mode1_encrypt_useExampleKey);
	document.getElementById("useExampleRequest").addEventListener("click", useExampleRequest);

	document.getElementById("copyxsign").addEventListener("click", copyXSignToClipboard);
	document.getElementById("copybody").addEventListener("click", copyBodyToClipboard);
}
else if(document.getElementById("decrypt-mode1")){
	document.getElementById("decrypt-mode1").addEventListener("click", mode1_startDecrypt);

	document.getElementById("useExampleKey").addEventListener("click", mode1_decrypt_useExampleKey);
}
else{
	alert("unknown page, this is an error in program, please talk to tech")
}
