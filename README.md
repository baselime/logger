# logger
A TypeScript logger

## Usage

```ts
logger.error({
  message: "An example error message",
  data: {
    key1: "value1",
    key2: "value2"
  },
  correlationId: "long-random-string",
  error: "Any error message",
});
```
