# buscador-sync-api-producer
This is an implementation of producer app. It exposes an rest endpoint with koa, receive a request and then put on a AWS sqs queue. The sencod component (buscador-sync-lambdaConsumer repo) is responsible to get a message queue and read mongodb and finally bulk data to elasticsearch
