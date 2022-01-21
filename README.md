# pdf-text-search
A simple lambda function to extract keywords from pdf. At the moment ut accepts search keywords as querystring like this http://localhost:3000/findKeywordInPDF?keywords=blah

This repo uses these packages - 
* pdf to parse a pdf file (https://www.npmjs.com/package/pdf)
* serverless-local to run lambda locally (https://www.npmjs.com/package/serverless-local)
* axio to download pdf from remote (https://www.npmjs.com/package/axios)
* ts-jest/jest for unit testing (https://www.npmjs.com/package/ts-jest)


# Install

```javascript
   npm install 
```

# Run

```javascript
   npm start 
```

# Test

```javascript
   npm test 
```


