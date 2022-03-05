# node-elasticsearch-sync-api-sqs-producer
This is an implementation of AWS SQS producer app. It exposes an rest endpoint with koa (Nodejs). It receives a request and then put on a AWS sqs queue. The sencond component (https://github.com/jriverox/node-elasticsearch-sync-lambda-sqs-consumer) is responsible to get a message queue and read mongodb database and finally bulk data to elasticsearch.
