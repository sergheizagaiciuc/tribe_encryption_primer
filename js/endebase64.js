function encodeBase64(input) {
    const encoder = new TextEncoder();
    const uint8Array = encoder.encode(input);
    const base64String = btoa(String.fromCharCode(...uint8Array));
    return base64String;
}

// Base64 decoding function
function decodeBase64(base64String) {
    const binaryString = atob(base64String);
    const uint8Array = new Uint8Array([...binaryString].map(char => char.charCodeAt(0)));
    const decoder = new TextDecoder();
    return decoder.decode(uint8Array);
}

function startDecode(e)
{
    try{
        e.preventDefault();

        const input = document.getElementById("input").value;

        const result = decodeBase64(input);

        document.getElementById("result").value = result;
    }
    catch(e)
    {
        alert(e);
    }
}

function startEncode(e)
{
    try{
        e.preventDefault();

        const input = document.getElementById("input").value;

        const result = encodeBase64(input);

        document.getElementById("result").value = result;
    }
    catch(e)
    {
        alert(e);
    }
}

function wireEventHandlers()
{
    document.getElementById("decode-base64").addEventListener("click", startDecode);
    document.getElementById("encode-base64").addEventListener("click", startEncode);
}

wireEventHandlers();
