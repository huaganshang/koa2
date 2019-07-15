var path = require('path');
var puppeteerResolver = require("puppeteer-chromium-resolver"); 

const STATIC = path.join(__dirname, '../', '../static');

function autoScroll(page) {
    return page.evaluate(() => {
        return new Promise((resolve, reject) => {
            var totalHeight = 0;
            var distance = 100;
            var timer = setInterval(() => {
                var scrollHeight = document.body.scrollHeight;
                window.scrollBy(0, distance);
                totalHeight += distance;
                if (totalHeight >= scrollHeight) {
                    clearInterval(timer);
                    resolve();
                }
            }, 1000);
        })
    });
}

module.exports = {
    getList: async (ctx, next) => {
        var revisionInfo = await puppeteerResolver({ 
            revision: "", 
            detectionPath: "", 
            folderName: '.chromium-browser-snapshots', 
            hosts: ["https://storage.googleapis.comstorage.googleapis.com", "https://npm.taobao.org/mirrorsnpm.taobao.org/mirrors"], 
            retry: 3 
        }); 
        var browser = await revisionInfo.puppeteer.launch({ 
            headless: true, 
            args: ['--no-sandbox'], 
            executablePath: revisionInfo.executablePath 
        }).catch(function (error) { 
            // console.log(error); 
        }); 
        
        const page = await browser.newPage();
    
        await page.goto('https://ec.diwork.com/html/index/team.html');
    
        await autoScroll(page);
    
        await page.pdf({
            path: path.join(STATIC, '1.pdf'),
            fullPage: true,
            format: 'A4',
            printBackground: true,
            margin: {
                top: '2cm',
                left: '2cm',
                right: '2cm',
                bottom: '2cm',
            }
        });
    
        ctx.body = 'ok';
    
        await browser.close();
    }
}
