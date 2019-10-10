# DOC-FINGERPRINT

This library provides a way to generate a unique fingerprint for documents based on their content. 


## Installation
~~~bash
npm install doc-fingerprint
~~~

## Supported Algorithms
The library currently supports the following algorithms:
- [x] Winnowing Fingerprint
- [x] Hashing Fingerprint (MD5, SHA1, SHA256) 

## Usage
~~~ts
import { HashFingerprint, HashAlgorithm } from 'doc-fingerprint';

// Using a hash algorithm
const hashFingerprint = new HashFingerprint({algorithm: HashAlgorithm.SHA1});

// Generate fingerprint from text
const fingerprint = winnowingFingerprint.fromText("This is a sample text").generate();
// Verify fingerprint
const isValid = winnowingFingerprint.fromText("This is a sample text").verify(fingerprint, {algorithm: HashAlgorithm.SHA1});
~~~