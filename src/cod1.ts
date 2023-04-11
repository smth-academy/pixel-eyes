const fs = require('fs');
const jimp = require('jimp');
const PNG = require('pngjs').PNG;
const pixelmatch = require('pixelmatch');




const urlToBuffer = async (url) => {
    return new Promise(async (resolve, reject) => {
        await jimp.read(url, async (err, image) => {
            if (err) {
                console.log(`error reading image in jimp: ${err}`);
                reject(err);
            }
            //image.resize(1155, 650); 
            return image.getBuffer(jimp.MIME_PNG, (err, buffer) => {
                if (err) {
                    console.log(`error converting image url to buffer: ${err}`);
                    reject(err);
                }
                resolve(buffer);
            });
        });
    });
};

const compareImage = async (
    twitterProfilePicURL,
    assetCDNURL
) => {
    try {
        console.log('> Started comparing two images');
        const img1Buffer = await urlToBuffer(twitterProfilePicURL);
        const img2Buffer = await urlToBuffer(assetCDNURL);
        const img1 = PNG.sync.read(img1Buffer);
        const img2 = PNG.sync.read(img2Buffer);
        const { width, height } = img1;
        const diff = new PNG({ width, height });

        const difference = pixelmatch(
            img1.data,
            img2.data,
            diff.data,
            width,
            height,
            {
                threshold: 0.05,
                includeAA: false, // se TRUE disabilita il rilevamento e l'ignoranza dei pixel con anti-alias
                alpha: 0.5,  // Fattore di fusione dei pixel invariati nell'output diff [0,1]
                aaColor: [255, 255, 0], //colore dei pixel AA 
                diffColor: [255, 0, 0], //colore dei pixel differenti 
                diffColorAlt: [255, 0, 255]  //Un colore alternativo da utilizzare per le differenze 
                //tra scuro e chiaro per distinguere tra parti "aggiunte" e "rimosse". 
                //Se non fornito, tutti i pixel diversi utilizzano il colore specificato da diffColor
            }
        );

        // funzione per calcora l' MSE 
        const a = img1.data;
        const b = img2.data;
        function mse(a, b) {
            let error = 0
            for (let i = 0; i < a.length; i++) {
                error += Math.pow((b[i] - a[i]), 2)
            }
            return error / a.length
        }

        // Salva l'immagine con differenze nella cartella
        fs.writeFileSync('immagini/diff.png', PNG.sync.write(diff));

        // Calcola la percentuale di differenza dall'immagine di diff
        const diffImage = PNG.sync.read(fs.readFileSync('immagini/diff.png'));
        const totalPixels = diffImage.width * diffImage.height;
        let numRedPixels = 0;
        for (let i = 0; i < diffImage.data.length; i += 4) {
            if (diffImage.data[i] === 255 && diffImage.data[i + 1] === 0 && diffImage.data[i + 2] === 0) {
                numRedPixels++;
            }
        }

        const diffRatio = numRedPixels / totalPixels * 100;
        const compatibility = 100 - (difference * 100) / (width * height);

        console.log('MSE value (Mean Squared Error):', mse(img1.data, img2.data).toFixed(7));
        console.log('Red pixels in the diffed image:', diffRatio.toFixed(2), '%');
        console.log(`Pixel differences between the two images: ${difference}`);
        //console.log(`Similarity between the two images: ${compatibility.toFixed(4)} %`);
        console.log('< Completed comparing two images');

        return compatibility;
    } catch (error) {
        console.log(`error comparing images: ${error}`);
        throw error;
    }
};



compareImage(
    'https://smth-test-space.fra1.digitaloceanspaces.com/image-matching%2FImmagine%202023-03-20%20151136.png',
    'https://smth-test-space.fra1.digitaloceanspaces.com/image-matching%2FImmagine%202023-03-20%20151158.png'
)




/*

const urlToBuffer = async (url) => {
    return new Promise(async (resolve, reject) => {
        await jimp.read(url, async (err, image) => {
            if (err) {
                console.log(`error reading image in jimp: ${err}`);
                reject(err);
            }
            //image.resize(1155, 650); 
            return image.getBuffer(jimp.MIME_PNG, (err, buffer) => {
                if (err) {
                    console.log(`error converting image url to buffer: ${err}`);
                    reject(err);
                }
                resolve(buffer);
            });
        });
    });
};

const compareImage = async (
    twitterProfilePicURL,
    assetCDNURL
) => {
    try {
        console.log('> Started comparing two images');
        const img1Buffer = await urlToBuffer(twitterProfilePicURL);
        const img2Buffer = await urlToBuffer(assetCDNURL);
        const img1 = PNG.sync.read(img1Buffer);
        const img2 = PNG.sync.read(img2Buffer);
        const { width, height } = img1;
        const diff = new PNG({ width, height });

        const difference = pixelmatch(
            img1.data,
            img2.data,
            diff.data,
            width,
            height,
            {
                threshold: 0.05,
                includeAA: false, // se TRUE disabilita il rilevamento e l'ignoranza dei pixel con anti-alias
                alpha: 0.5,  // Fattore di fusione dei pixel invariati nell'output diff [0,1]
                aaColor: [255, 255, 0], //colore dei pixel AA 
                diffColor: [255, 0, 0], //colore dei pixel differenti 
                diffColorAlt: [255, 0, 255]  //Un colore alternativo da utilizzare per le differenze 
                //tra scuro e chiaro per distinguere tra parti "aggiunte" e "rimosse". 
                //Se non fornito, tutti i pixel diversi utilizzano il colore specificato da diffColor
            }
        );

        // funzione per calcora l' MSE 
        const a = img1.data;
        const b = img2.data;
        function mse(a, b) {
            let error = 0
            for (let i = 0; i < a.length; i++) {
                error += Math.pow((b[i] - a[i]), 2)
            }
            return error / a.length
        }

        // Salva l'immagine con differenze nella cartella
        fs.writeFileSync('immagini/diff.png', PNG.sync.write(diff));

        // Calcola la percentuale di differenza dall'immagine di diff
        const diffImage = PNG.sync.read(fs.readFileSync('immagini/diff.png'));
        const totalPixels = diffImage.width * diffImage.height;
        let numRedPixels = 0;
        for (let i = 0; i < diffImage.data.length; i += 4) {
            if (diffImage.data[i] === 255 && diffImage.data[i + 1] === 0 && diffImage.data[i + 2] === 0) {
                numRedPixels++;
            }
        }

        const diffRatio = numRedPixels / totalPixels * 100;
        const compatibility = 100 - (difference * 100) / (width * height);

        console.log('MSE value (Mean Squared Error):', mse(img1.data, img2.data).toFixed(7));
        console.log('Red pixels in the diffed image:', diffRatio.toFixed(2), '%');
        console.log(`Pixel differences between the two images: ${difference}`);
        //console.log(`Similarity between the two images: ${compatibility.toFixed(4)} %`);
        console.log('< Completed comparing two images');

        return compatibility;
    } catch (error) {
        console.log(`error comparing images: ${error}`);
        throw error;
    }
};



compareImage(
    'https://smth-test-space.fra1.digitaloceanspaces.com/image-matching%2FImmagine%202023-03-20%20151136.png',
    'https://smth-test-space.fra1.digitaloceanspaces.com/image-matching%2FImmagine%202023-03-20%20151158.png'
)


*/