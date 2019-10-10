interface Fingerprint {
    fromFile(filePath: string): Fingerprint;
    fromText(text: string): Fingerprint;
    generate(opts?: any): string;
    verfiy(hash: string, opts?: any): boolean;
};

export default Fingerprint;
