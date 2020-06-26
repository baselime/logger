# logger

A TypeScript logger with all the resources to manage correlation Ids.

## Environment variables

`LOG_LEVEL` sets the logging level to use (default `info`). This can be one of `debug`, `info`, `warn` or `error`. The setting will log anything at the chosen level and above.

## Usage

### With an express server

Use the `bindExpressMiddleware` function to get a single correlation id per request. This will look for an `x-correlation-id` header on the incoming request and use it, or else it will create a new one.

```ts
import express from "express";
import logger from "@boristane/logger"

const app = express();

app.use(logger.bindExpressMiddleware);
app.get('/', homePage);

function homePage(req, res) {
  const message = "Typing something";
    logger.info("Got the message for the user", {message});
    res.send(message);
}

app.listen(3000);
```

## With a process

```ts
import logger from "@boristane/logger";

export function doSomething(input: any) {
  return logger.bingFunction(doSomethingFunction)(input);
}

function doSomethingFunction(input: any) {
  try {
    logger.info("I got the input", {input});
  } catch(err) {
    logger.error("Houston we have a problem", {error: err, input});
  }
}
```

## Debug Logs

By default this logger does not log debug logs. These can be activated using the environment variable at application. For a more granular control of which debug logs to activate, the following pattern can be used.

```ts
import logger from "@boristane/logger";

logger.debug("This debug log will not be logged");

logger.enableDebug();

logger.debug("This debug log will be logged");

logger.disableDebug();

logger.debug("This debug log will not be logged);
```
