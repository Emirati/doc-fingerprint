import * as fs from 'fs';
import Fingerprint from './fingerprint'; // eslint-disable-line no-unused-vars

/**
 * WinnowFingerprint Class
 */
class WinnowFingerprint implements Fingerprint {
    private static readonly MAX_HASH_VALUE: number = 500;

    private opts: any = {
        threshold: 10,
        noiseThreshold: 5,
        windowSize: 10 - 5 + 1,
    }

    private text: string = '';
    private kgrams: Array<string> = [];
    private hashes: Array<number> = [];
    private fingerprints: Array<Array<number>> = [];

    /**
     * Load text from file
     * @param {string} filePath The file path
     * @return {Fingerprint} WinnowFingerpint
     */
    public fromFile(filePath: string): Fingerprint {
        this.reset();
        this.text = this.sanitize(fs.readFileSync(filePath).toString());

        return this;
    }

    /**
     * Load text from string
     * @param {string} text String
     * @return {Fingerprint} WinnowFingerprint
     */
    public fromText(text: string): Fingerprint {
        this.reset();
        this.text = this.sanitize(text);

        return this;
    }

    /**
     * Generates a unique hash
     * @param {any} opts optional configurations
     * @return {string} Hashed value
     */
    public generate(opts: any = this.opts): string {
        opts = {...this.opts, ...opts};

        this.validateConf();
        this.generateKGrams(opts);
        this.generateHashes();
        this.fingerprint(opts);

        return JSON.stringify(this.fingerprints);
    }

    /**
     * Verify hash against given text
     * @param {string} hash hash value
     * @param {any} opts optional configurations
     * @return {boolean} The comparison results
     */
    public verfiy(hash: string, opts: any = this.opts): boolean {
        if (this.text == '') {
            throw new Error('Document content must be set. Use fromText() or fromFile() to set document content');
        }

        if (!hash || hash == '') {
            throw new Error('Fingerprint must be provided');
        }

        const textFingerprint = this.generate(opts);

        return textFingerprint == hash;
    }

    /**
     * Sanitizes string by removing non-alphabetic characters
     * @param {string} text The text to sanitize
     * @return {string} Sanitized text
     */
    private sanitize(text: string): string {
        return text.replace(/[\s\n!"#$%&'()*+, -./:;<=>?@[\]^_`{|}~،؟\\]/g, '').toLowerCase();
    }

    /**
     * Validates given configurations
     */
    private validateConf() {
        const charCount = this.text.length;

        if (!this.opts.hasOwnProperty('threshold')) {
            throw new Error('Missing property: threshold');
        }

        if (!this.opts.hasOwnProperty('noiseThreshold')) {
            throw new Error('Missing property: noiseThreshold');
        }

        if (!this.opts.hasOwnProperty('noiseThreshold')) {
            throw new Error('Missing property: windowSize');
        }

        if (charCount < this.opts.threshold) {
            throw new Error('String length is smaller than the threshold.');
        }

        if (charCount < this.opts.windowSize) {
            throw new Error('String length is smaller than the window size.');
        }

        if (this.opts.threshold < this.opts.noiseThreshold) {
            throw new Error('Noise Threshold cannot be less than the Threshold');
        }
    }

    /**
     * Generates K-Gram values
     * @param {any} opts Optional Configurations
     */
    private generateKGrams(opts: any = this.opts) {
        for (let i = 0; i < (this.text.length - opts.threshold + 1); i++) {
            this.kgrams.push(this.text.substring(i, i + opts.threshold));
        }
    }

    /**
     * Generates Hashes
     */
    private generateHashes() {
        for (let i = 0; i < this.kgrams.length; i++) {
            let hash: number = 0;

            for (let x = 0; x < this.kgrams[i].length; x++) {
                hash += this.kgrams[i].substring(x, x + 1).charCodeAt(0);
            }

            this.hashes.push(hash % WinnowFingerprint.MAX_HASH_VALUE);
        }
    }

    /**
     * Generates a fingerprint
     * @param {any} opts Optional Configurations
     */
    private fingerprint(opts: any = this.opts) {
        const windows: Array<Array<number>> = [];
        let prevFingerprint: any;

        for (let i = 0; i < this.hashes.length - opts.windowSize + 1; i++) {
            windows.push(this.hashes.slice(i, i + opts.windowSize));
        }

        for (let i = 0; i < windows.length; i++) {
            const fingerprint: any = this.getMinHashAndPosition(windows[i]);
            fingerprint.minPosition += i;

            if (prevFingerprint == undefined || prevFingerprint.minPosition != fingerprint.minPosition) {
                this.fingerprints.push([fingerprint.minHash, fingerprint.minPosition]);
                prevFingerprint = fingerprint;
            }
        }
    }

    /**
     * Returns minimum hash in given windows
     * @param {Array} window Array of windows
     * @return {object} minimum hash found
     */
    private getMinHashAndPosition(window: Array<number>): object {
        let minPosition: number = 0;
        const minHash: number = window.reduce((prevHash, currHash, pos) => {
            if (currHash <= prevHash) {
                minPosition = pos;
                return currHash;
            }

            return prevHash;
        });

        return {minHash, minPosition};
    }

    /**
     * Resets all variables
     */
    private reset() {
        this.kgrams = [];
        this.hashes = [];
        this.fingerprints = [];
    }
}

export default WinnowFingerprint;
