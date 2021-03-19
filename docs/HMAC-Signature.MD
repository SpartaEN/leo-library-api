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

[Check out my blog(zh_CN)](https://blog.sparta-en.org/2020/09/03/%E5%88%A9%E6%98%82%E5%9B%BE%E4%B9%A6%E9%A6%86%E9%A2%84%E7%BA%A6App%E5%88%86%E6%9E%90-2020%E5%B9%B49%E6%9C%883%E6%97%A5/)
