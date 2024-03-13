
const crypto = require('crypto');
  
// Generate Digest
function generateDigest(jsonBody) {
    let jsonStringHash256 = crypto.createHash('sha256').update(JSON.stringify(jsonBody),"utf-8").digest();
    
    let bufferFromJsonStringHash256 = Buffer.from(jsonStringHash256);
    return bufferFromJsonStringHash256.toString('base64'); 
}
 

function generateSignature(clientId, requestId, requestTimestamp, requestTarget, digest, secret) {
    // Prepare Signature Component
    console.log("----- Component Signature -----")
    let componentSignature = "Client-Id:" + clientId;
    componentSignature += "\n";
    componentSignature += "Request-Id:" + requestId;
    componentSignature += "\n";
    componentSignature += "Request-Timestamp:" + requestTimestamp;
    componentSignature += "\n";
    componentSignature += "Request-Target:" + requestTarget;
    // If body not send when access API with HTTP method GET/DELETE
    if (digest) {
        componentSignature += "\n";
        componentSignature += "Digest:" + digest;
    }
 
    console.log(componentSignature.toString());
    console.log();

    // Calculate HMAC-SHA256 base64 from all the components above
    let hmac256Value = crypto.createHmac('sha256', secret)
                   .update(componentSignature.toString())
                   .digest();  
      
    let bufferFromHmac256Value = Buffer.from(hmac256Value);
    let signature = bufferFromHmac256Value.toString('base64');
    // Prepend encoded result with algorithm info HMACSHA256=
    return "HMACSHA256="+signature 
}
 
console.log("----- Digest -----");
let jsonBody = {
    "order": {
        "amount": 20000,
        "invoice_number": "INV-20210231-0001"
    },
    "payment": {
        "payment_due_date": 60
    }
};
let digest = generateDigest(jsonBody);
console.log(digest);
console.log();
  
// Generate Header Signature
let headerSignature = generateSignature(
        "BRN-0225-1710312601640",
        "fdb69f47-96da-499d",
        "2024-03-13T06:54:09Z",
        "/checkout/v1/payment", // For merchant request to Jokul, use Jokul path here. For HTTP Notification, use merchant path here
        "iDUNgGutnjXGk8dcBw0J4EtC2qOuQfvV7iyMwgV+y5Q=", // Set empty string for this argumentes if HTTP Method is GET/DELETE
        "SK-j6EA1ry9aZDW53yU8G9u")
console.log("----- Header Signature -----")
console.log(headerSignature)
