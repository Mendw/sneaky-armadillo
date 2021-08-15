import { scryptSync, createDecipheriv } from 'crypto'
import { google } from 'googleapis';

const encrypted = 'BMaQhCBSP/nF2yemHXByVQ==.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'
const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/';
const lookup = typeof Uint8Array === 'undefined' ? [] : new Uint8Array(256);
for (let i = 0; i < chars.length; i++) {
    lookup[chars.charCodeAt(i)] = i;
}

export const decode = (base64) => {
    let bufferLength = base64.length * 0.75,
        len = base64.length,
        i,
        p = 0,
        encoded1,
        encoded2,
        encoded3,
        encoded4;

    if (base64[base64.length - 1] === '=') {
        bufferLength--;
        if (base64[base64.length - 2] === '=') {
            bufferLength--;
        }
    }

    const arraybuffer = new ArrayBuffer(bufferLength),
        bytes = new Uint8Array(arraybuffer);

    for (i = 0; i < len; i += 4) {
        encoded1 = lookup[base64.charCodeAt(i)];
        encoded2 = lookup[base64.charCodeAt(i + 1)];
        encoded3 = lookup[base64.charCodeAt(i + 2)];
        encoded4 = lookup[base64.charCodeAt(i + 3)];

        bytes[p++] = (encoded1 << 2) | (encoded2 >> 4);
        bytes[p++] = ((encoded2 & 15) << 4) | (encoded3 >> 2);
        bytes[p++] = ((encoded3 & 3) << 6) | (encoded4 & 63);
    }

    return arraybuffer;
};

async function decrypt() {
    return new Promise((resolve, reject) => {
        try {
            const algorithm = 'aes-192-cbc'
            
            const [iv, cipher] = encrypted.split('.')
            const [password, salt] = process.env.GOOGLE_ACCESS_SECRET.split('.')

            const key = scryptSync(password, salt, 24)
            let decipher = createDecipheriv(algorithm, key, decode(iv))
            
            let decrypted = ''
            
            let chunk
            decipher.on('readable', () => {
                while (null !== (chunk = decipher.read())) {
                    decrypted += chunk.toString('utf8');
                }
            });
            
            decipher.on('end', () => {
                resolve(decrypted)
            });
            
            decipher.write(cipher, 'base64')
            decipher.end()
        } catch(err) {
            reject(err)
        }
    })
}
let credentials
let sheets

async function getSheetsInstance() {
    credentials = credentials || await decrypt().then(res => JSON.parse(res)).catch(err => console.log(err))

    return sheets || google.sheets({
        version: 'v4',
        auth: new google.auth.GoogleAuth({
            credentials,
            scopes: ['https://www.googleapis.com/auth/spreadsheets.readonly']
        })
    })
}

export async function getRange() {
    let spreadsheetId = '14kRMgQ0_0CBibstQWhejE2hBW6sEsTawbmem01XGB0U'
    const sheets = await getSheetsInstance()
    
    /*sheets.spreadsheets.values.get({
        spreadsheetId,
        range: 'tests!A1:B2'
    }, (err, result) => {
        if(err) console.log(err)
        else {
            console.log(result.data.values)
        }
    })*/
}