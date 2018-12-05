import qbase from '@quantadex/quanta-base';
import signAuth from "./auth.js";
const fetch = require('node-fetch');

const OrderBookUrlDefault = "http://testnet-01.quantachain.io:7200"
const PRECISION = 10000000

class QuantaClient {
	constructor(params) {
		this.params = params;
		if (this.params.orderbookUrl == null) {
			params.orderbookUrl = OrderBookUrlDefault;
		}
		if (this.params.secretKey == null) {
			throw "no private key";
		}

		this.orderbookUrl = params.orderbookUrl;
		this.key = qbase.Keypair.fromSecret(params.secretKey);
		console.log("Loaded client with " + this.orderbookUrl, " publicKey: " + this.key.publicKey());
	}

	/**
	 * submit order.
	 * @param {string} market in base**issuer/counter**issuer
	 * @param {string} amount in decimal places
	 * @param {string} price in decimal places
	 */
	submitOrder(side, market, price, amount) {
		
		var priceInt = Math.trunc(parseFloat(price) * PRECISION);
		var amountInt = Math.trunc(parseFloat(amount) * PRECISION);
		var body = {
			Market: market,
			Side: side,
			Price: priceInt,
			Size: amountInt
		}
		const jsonBody = JSON.stringify(body)
		console.log("submit body", jsonBody);
		var sig = signAuth(this.key, "/submitorder", jsonBody);

		return fetch(this.orderbookUrl + "/submitorder", {
			method: "POST",
			headers: {
				"Authorization": sig
			},
			body: jsonBody
		})
	}


	cancelOrder(orderId) {

	}
	/**
	 * List open orders
	 */
	openOrders() {
		var sig = signAuth(this.key, "/account", "");
		console.log(sig);
		return fetch(this.orderbookUrl + "/account", {
			headers: {
				"Authorization": sig
			}
		})
	}

	/**
	 * Get bids/asks
	 * @param {string} market in base**issuer/counter**issuer
	 */
	orderBookDepth(market) {
		return fetch(this.orderbookUrl + "/depth/" + market)
			.then((e) => e.json())
	}

	/**
	 * Show markets
	 */
	showMarkets() {
		return fetch(this.orderbookUrl + "/market/list")
						.then((e) => e.json())
	}

	/**
	 * 
	 */
};

export default QuantaClient;