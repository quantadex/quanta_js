import PrivateKey from "./PrivateKey";
import PublicKey from "./PublicKey";
import Address from "./address";
import Aes from "./aes";
import key from "./KeyUtils";
import {sha256, sha512} from "./hash";
// import dictionary from './dictionary_en';
import secureRandom from "secure-random";

export function encryptWallet(brainkey_plaintext, password_plaintext) {
    let password_aes = Aes.fromSeed(password_plaintext);
    let encryption_buffer = key.get_random_key().toBuffer(); // for new wallet

    // encryption_key is the global encryption key (does not change even if the passsword changes)
    let encryption_key = password_aes.encryptToHex(encryption_buffer);
    let local_aes_private = Aes.fromSeed(encryption_buffer);
    let brain_encryption_key = local_aes_private.encryptToHex(
        brainkey_plaintext
    );
    let password_private = PrivateKey.fromSeed(password_plaintext);
    let password_pubkey = password_private.toPublicKey().toPublicKeyString();

    return {
        encryption_key,
        brain_encryption_key,
        password_pubkey
    };
}

export function decryptWallet(wallet, password_plaintext) {
    try {
        let password_private = PrivateKey.fromSeed(password_plaintext);
        let password_pubkey = password_private
            .toPublicKey()
            .toPublicKeyString();
        if (wallet.password_pubkey !== password_pubkey) return null;

        let password_aes = Aes.fromSeed(password_plaintext);
        let encryption_plainbuffer = password_aes.decryptHexToBuffer(
            wallet.encryption_key
        );
        let aes_private = Aes.fromSeed(encryption_plainbuffer);
        let brainkey_plaintext = aes_private.decryptHexToText(
            wallet.brain_encryption_key
        );
        return {
            brainkey_plaintext,
            key: PrivateKey.fromSeed(key.normalize_brainKey(brainkey_plaintext))
        };
    } catch (e) {
        console.error(e);
        return null;
    }
}

export function changeWalletPassword(wallet, old_password, new_password) {
    const decrypted = decryptWallet(wallet, old_password);
    if (decrypted == null) {
        return null;
    }

    let old_password_aes = Aes.fromSeed(old_password);
    let new_password_aes = Aes.fromSeed(new_password);

    let encryption_plainbuffer = old_password_aes.decryptHexToBuffer(
        wallet.encryption_key
    );
    let new_password_private = PrivateKey.fromSeed(new_password);

    return {
        ...wallet,
        encryption_key: new_password_aes.encryptToHex(encryption_plainbuffer),
        password_pubkey: new_password_private.toPublicKey().toPublicKeyString()
    };
}
