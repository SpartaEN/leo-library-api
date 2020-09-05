# Leo HMAC Singature

## Http headers

```
x-request-id： UUIDv1 for nonce
x-request-date: Current Timestamp
x-hmac-request-key: HMAC-SHA256 Signature
```

## HMAC

### Message

```
seat::<x-request-id>::<x-request-date>::<request method>
```

Sample:
```
seat::807cd4b0-e010-11ea-b4b5-11d182874e0f::1599126887803::GET
```

### Key

```
leos3cr3t
```

## How I found

[Check out my blog(zh_CN)](https://blog.sparta-en.org/leo-lib-app-analyze-2020-09-03/)