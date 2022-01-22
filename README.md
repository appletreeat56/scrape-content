# scrape-content

This is a lambda function written using serverless framework (https://www.serverless.com/). This function will do the following -

* Scrape the following content from a url
  * title of the page
  * any image available on the page 
*  Store this data into an xlsx file and upload to S3
*  Store a JSON representation of sccrapped data along with a signed url of the xlsx file uploaded


This repo uses these packages - 
* cheerio to parse markup of the url (https://www.npmjs.com/package/cheerio)
* exceljs to create an xlsx file (https://www.npmjs.com/package/exceljs)
* serverless-local to run lambda locally (https://www.npmjs.com/package/serverless-local)
* axio to download url content from remote (https://www.npmjs.com/package/axios)


# Install

```javascript
   npm install 
```

# Run
Make sure that you have AWS access and secret key with correct permission set in the environment before you run this. You will also need a bucket in your AWS account and that bucket name should be added in environment variable named - ```AWS_BUCKET_NAME``` in serverless.yml
```javascript
   npm start 
```
Once its running, you can test this function locally from here - ```http://localhost:3000/local/scrapeContent?url=[url-of-a-webpage-you-want-to-scrape]```
# deploy

Make sure that you have AWS access and secret key with correct permission set in the environment before you run this.

```javascript
   sls deploy --stage [dev][prod] --region[any-aws-region-of-you-choice] 
```


