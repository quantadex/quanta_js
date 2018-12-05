import signAuth from '../src/auth';
const assert = require('assert');
import qbase from '@quantadex/quanta-base';

describe('auth', function () {
	it('will sign', function () {
		var kp = qbase.Keypair.fromSecret("ZBYUCOMTT7UPXG6JSKIQREYF6FLMUFAE42I24VJNX6NOFP7I6BUQWEKV");
		var auth = signAuth(kp, "/testurl", "body")
		console.log(auth);
	})
})