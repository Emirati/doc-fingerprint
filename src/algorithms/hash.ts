import * as fs from 'fs';
import {MD5, SHA1, SHA256} from 'crypto-js';
import Fingerprint from './fingerprint'; // eslint-disable-line no-unused-vars

/**
 * HashFingerprint
 */
class HashFingerprint implements Fingerprint {
    private text: string = '';
    private opts: any = {
        algorithm: HashAlgorithm.SHA256,
    }

    /**
     * HashFingerprint Constructor
     * @param {any} opts Optional configurations
     */
    constructor(opts: any = {algorithm: HashAlgorithm.SHA256}) {
        this.validateConf(opts);
        this.opts = opts;
    }

    /**
     * Load text from file
     * @param {string} filePath The file path
     * @return {Fingerprint} WinnowFingerpint
     */
    fromFile(filePath: string): Fingerprint {
        this.text = fs.readFileSync(filePath).toString();

        return this;
    }

    /**
     * Load text from string
     * @param {string} text String
     * @return {Fingerprint} WinnowFingerprint
     */
    fromText(text: string): Fingerprint {
        this.text = text;

        return this;
    }

    /**
     * Generates a unique hash
     * @param {any} opts optional configurations
     * @return {string} Hashed value
     */
    generate(opts: any = this.opts): string {
        let hashValue: string = '';
        this.validateConf(opts);

        if (!this.text || this.text == '') {
            throw new Error('Document content must be set. Use fromText() or fromFile() to set document content');
        }

        switch (opts.algorithm) {
        case HashAlgorithm.MD5:
            hashValue = MD5(this.text).toString(); // eslint-disable-line new-cap
            break;

        case HashAlgorithm.SHA1:
            hashValue = SHA1(this.text).toString(); // eslint-disable-line new-cap
            break;

        case HashAlgorithm.SHA256:
            hashValue = SHA256(this.text).toString(); // eslint-disable-line new-cap
            break;
        default:
            break;
        }

        return hashValue;
    }

    /**
     * Verify hash against given text
     * @param {string} hash hash value
     * @param {string} opts option to set algorithm
     * @return {boolean} The comparison results
     */
    verfiy(hash: string, opts: any = this.opts): boolean {
        this.validateConf(opts);

        if (!this.text || this.text == '') {
            throw new Error('Document content must be set. Use fromText() or fromFile() to set document content');
        }

        const comparableHash = this.generate(opts);

        return hash == comparableHash;
    }

    /**
     * validate configuration
     * @param {any} opts Custom Configruations
     */
    private validateConf(opts: any) {
        if (!opts || !opts.hasOwnProperty('algorithm')) {
            throw new Error('Hashing Algorithm must be specified');
        }

        if (!Object.values(HashAlgorithm).includes(opts.algorithm)) {
            throw new Error('Unsupported Hashing Algorithm.');
        }
    }
}

export enum HashAlgorithm {
    /* eslint-disable no-unused-vars */
    MD5,
    SHA1,
    SHA256,
}

export default HashFingerprint;
