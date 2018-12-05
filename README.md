# quanta_js

Quanta_JS library is a javascript module to interface with the quanta blockchain orderbook api.

## How to install

```
npm i @quantadex/quanta_js --save
```

## Using it

```
import QuantaClient from "quanta_js"

// creating a client
const c = new QuantaClient({ orderbookUrl: QuantaClient.OrderBookUrlDefault, secretKey: "Z...." })

```