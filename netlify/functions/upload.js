const multiparty = require('multiparty');
const fs = require('fs');
const path = require('path');

exports.handler = async (event) => {
    if (event.httpMethod !== 'POST') {
        return {
            statusCode: 405,
            body: 'Метод не разрешен'
        };
    }

    const form = new multiparty.Form();
    return new Promise((resolve, reject) => {
        form.parse(event, (err, fields, files) => {
            if (err) {
                reject({
                    statusCode: 500,
                    body: JSON.stringify({ error: 'Ошибка обработки файла' })
                });
                return;
            }

            const file = files.file[0];
            const filePath = path.join('/tmp', file.originalFilename);

            fs.copyFile(file.path, filePath, (err) => {
                if (err) {
                    reject({
                        statusCode: 500,
                        body: JSON.stringify({ error: 'Ошибка сохранения файла' })
                    });
                    return;
                }

                resolve({
                    statusCode: 200,
                    body: `https://YOUR_NETLIFY_URL/.netlify/functions/files/${file.originalFilename}`
                });
            });
        });
    });
}
