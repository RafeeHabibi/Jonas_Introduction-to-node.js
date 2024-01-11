const fs = require('fs');
const http = require('http');
const url  = require('url');

/// Server

const replaceTemplate = (temp, product) =>{
    let output = temp.replace(/{%PRODUCTNAME%}/g, product.productName);
    output = output.replace(/{%IMAGE%}/g, product.image); 
    output = output.replace(/{%PRICE%}/g, product.price); 
    output = output.replace(/{%NUTRIENTS%}/g, product.nutrients); 
    output = output.replace(/{%QUANTITY%}/g, product.quantity); 
    output = output.replace(/{%DESCRIPTION%}/g, product.description); 
    output = output.replace(/{%ID%}/g, product.id); 

    if(!product.organic) output = output.replace(/{%NOT_ORGANIC%}/g, 'not-organic');
    return output;
}

const tempOverview = fs.readFileSync('../templates/template-overview.html', 'utf-8');
const tempPorduct  = fs.readFileSync('../templates/template-product.html', 'utf-8');
const tempCard     = fs.readFileSync('../templates/template-card.html', 'utf-8');

const data = fs.readFileSync('../dev-data/data.json', 'utf-8');
const dataObj = JSON.parse(data);

const server = http.createServer((req, res) => {
const { query, pathname } = url.parse(req.url, true);

    console.log('Requested Path:', pathname); // Add this line for debugging

    if (pathname === '/' || pathname === '/overview') {
        console.log('Overview Page Requested'); // Add this line for debugging

        res.writeHead(200, { 'Content-type': 'text/html' });
        const cardsHtml = dataObj.map(el => replaceTemplate(tempCard, el)).join('');
        const output = tempOverview.replace('{%PRODUCT_CARDS%}', cardsHtml);
        res.end(output);
    } else if (pathname === '/product') {
        console.log('Product Page Requested'); // Add this line for debugging

        res.writeHead(200, { 'Content-type': 'text/html' });
        const product = dataObj[query.id];
        const output = replaceTemplate(tempPorduct, product);
        res.end(output);
    } else if (pathname === '/api') {
        console.log('API Page Requested'); // Add this line for debugging

        res.writeHead(200, { 'Content-type': 'application/json' });
        res.end(data);
    } else {
        console.log('Page Not Found'); // Add this line for debugging

        res.writeHead(404, { 'Content-type': 'text/html' });
        res.end("This page can't be found!");
    }
});

server.listen(8000, '127.0.0.1', ()=>{
    console.log("Listen to Request on Port 8000");
});

