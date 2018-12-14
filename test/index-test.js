import Client from '../src/index';
const assert = require('assert');

const marketTest = "ETH*QB3WOAL55IVT6E7BVUNRW6TUVCAOPH5RJYPUUL643YMKMJSZFZGWDJU3/BTC*QB3WOAL55IVT6E7BVUNRW6TUVCAOPH5RJYPUUL643YMKMJSZFZGWDJU3";

describe('quanta_client', function () {
	beforeEach(function () {
	});
	it('has some markets', function () {
		const c = new Client({ orderbookUrl: Client.OrderBookUrlDefault, secretKey: "ZBYUCOMTT7UPXG6JSKIQREYF6FLMUFAE42I24VJNX6NOFP7I6BUQWEKV"})
		return c.showMarkets().then((e) => {
			//console.log(e);
			if (e.length > 0) {
				return c.orderBookDepth(e[0].Name)
					.then((e) => {
						assert.ok(e != null, "result exist!")
						//console.log("market ", e);
					})
			}
		})
	});

	it("has some orders", function() {
		const c = new Client({ orderbookUrl: Client.OrderBookUrlDefault, secretKey: "ZCCMVSFFQJHDBQLTTKW74UPGXZQ3UZNJQVEGFW3AWHQQJW6PYK3DGI7T" })
		return c.openOrders()
		.then((e) => e.json()).then((e) => {
			console.log("msg ", e);
			//assert.ok(e.CurrentOrders > 0, "Should have open orders")
		}).catch((e) => {
			console.log(e);
		})
	})

	it("has make some order", function () {
		const c = new Client({ orderbookUrl: Client.OrderBookUrlDefault, secretKey: "ZCPG75J3GDSTTQ7GF4LNMUPTX4QM2SVDJZDHZ64G3IQLBKVXDAV7424O" })
		return c.submitOrder(1, marketTest, "2.0", "0.00001")
			.then((e) => {
				if (e.status == 200) {
					return e.json()					
				} else {
					return e.text()
				}
			}).then((e) => {
				console.log("ordered ", e.Id);
				//assert.ok(e.CurrentOrders > 0, "Should have open orders")
				return c.cancelOrder(e.Id).then((e) => {
					if (e.status == 200) {
						return e.json()
					} else {
						console.log("expected to be 200", e.status);
						assert.equal(e.status, 200, "expected 200")
						return e.text()
					}
				})
				.then((e) => {
					console.log("cancelled ", e);
				})
			}).catch((e) => {
				console.log(e);
			})
	})	
});