'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _quantaBase = require('@quantadex/quanta-base');

var _quantaBase2 = _interopRequireDefault(_quantaBase);

var _auth = require('./auth.js');

var _auth2 = _interopRequireDefault(_auth);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var fetch = require('node-fetch');

var OrderBookUrlDefault = "http://testnet-01.quantachain.io:7200";
var PRECISION = 10000000;

var QuantaClient = function () {
	function QuantaClient(params) {
		_classCallCheck(this, QuantaClient);

		this.params = params;
		if (this.params.orderbookUrl == null) {
			params.orderbookUrl = OrderBookUrlDefault;
		}
		if (this.params.secretKey == null) {
			throw "no private key";
		}

		this.orderbookUrl = params.orderbookUrl;
		this.key = _quantaBase2.default.Keypair.fromSecret(params.secretKey);
		console.log("Loaded client with " + this.orderbookUrl, " publicKey: " + this.key.publicKey());
	}

	/**
  * submit order.
  * @param {string} market in base**issuer/counter**issuer
  * @param {string} amount in decimal places
  * @param {string} price in decimal places
  */


	_createClass(QuantaClient, [{
		key: 'submitOrder',
		value: function submitOrder(side, market, price, amount) {

			var priceInt = Math.trunc(parseFloat(price) * PRECISION);
			var amountInt = Math.trunc(parseFloat(amount) * PRECISION);
			var body = {
				Market: market,
				Side: side,
				Price: priceInt,
				Size: amountInt
			};
			var jsonBody = JSON.stringify(body);
			console.log("submit body", jsonBody);
			var sig = (0, _auth2.default)(this.key, "/submitorder", jsonBody);

			return fetch(this.orderbookUrl + "/submitorder", {
				method: "POST",
				headers: {
					"Authorization": sig
				},
				body: jsonBody
			});
		}
	}, {
		key: 'cancelOrder',
		value: function cancelOrder(orderId) {}
		/**
   * List open orders
   */

	}, {
		key: 'openOrders',
		value: function openOrders() {
			var sig = (0, _auth2.default)(this.key, "/account", "");
			console.log(sig);
			return fetch(this.orderbookUrl + "/account", {
				headers: {
					"Authorization": sig
				}
			});
		}

		/**
   * Get bids/asks
   * @param {string} market in base**issuer/counter**issuer
   */

	}, {
		key: 'orderBookDepth',
		value: function orderBookDepth(market) {
			return fetch(this.orderbookUrl + "/depth/" + market).then(function (e) {
				return e.json();
			});
		}

		/**
   * Show markets
   */

	}, {
		key: 'showMarkets',
		value: function showMarkets() {
			return fetch(this.orderbookUrl + "/market/list").then(function (e) {
				return e.json();
			});
		}

		/**
   * 
   */

	}]);

	return QuantaClient;
}();

;

exports.default = QuantaClient;