import shajs from "sha.js";

/*
func signAuth(seed string, url string, body []byte) (auth string, err error) {
	kp, err := keypair.Parse(seed)
	if err != nil {
		return
	}
	ms := time.Now().UnixNano() / (int64(time.Millisecond) / int64(time.Nanosecond))
	msStr := strconv.FormatInt(ms, 10)

	sha := sha256.New()
	var buf bytes.Buffer
	buf.WriteString(kp.Address())
	buf.WriteString(msStr)
	buf.WriteString(url)
	buf.Write(body)
	sha.Write(buf.Bytes())
	hash := sha.Sum(nil)

	s, err := kp.Sign(hash)
	if err != nil {
		return
	}
	sig := hex.EncodeToString(s)

	var result bytes.Buffer
	result.WriteString(kp.Address())
	result.WriteString(";")
	result.WriteString(msStr)
	result.WriteString(";")
	result.WriteString(sig)

	auth = result.String()
	return
}
*/

// expect cb2dd4d107c0807f3db82072ca91d028f7f033405157845cf6d8c1d41ce20caae7b862d16ab1f02ce5feb3e081f3d6cc03ac4fa6ef4dd8be9f5ab8d84c8f5a0e

function signAuth(kp, url, body) {
	const d = new Date();
	const ms = d.getTime().toString();
	const hash = shajs("sha256");
	const msg = kp.publicKey() + ms + url + body;
	const result = hash.update(Buffer.from(msg)).digest("hex");
	const resultBytes = Buffer.from(result,"hex")
	// console.log("buffer", msg);
	// console.log("hash",result);
	var sig = kp.sign(resultBytes).toString('hex');
	return kp.publicKey() + ";" + ms + ";" + sig;
}

export default signAuth;