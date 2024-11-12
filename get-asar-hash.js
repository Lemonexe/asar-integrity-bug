const asar = require('@electron/asar');
const crypto = require('crypto');

const filePath = process.argv[2];

if (!filePath) {
    console.error('Usage: node get-asar-hash.js <path-to-asar-file>');
    process.exit(1);
}

try {
    const rawHeader = asar.getRawHeader(filePath);
    //console.log(rawHeader)
    const hash = crypto.createHash('sha256')
        .update(rawHeader.headerString)
        .digest('hex');

    console.log('SHA256 Hash of ASAR Header:', hash);
} catch (error) {
    console.error('Error processing ASAR file:', error.message);
}
