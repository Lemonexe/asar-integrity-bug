# ASAR integrity bug reproduction

Cross-platform build from Linux to Windows with `EnableEmbeddedAsarIntegrityValidation` creates corrupted `.exe` binary.

## Reproduction steps (Linux)

Using Ubuntu 24.04.1 LTS, Wine 9.0, Node.js v20.12.2

Note: unknown if it is reproducible on macOS (have not tested).

1. Install Wine 9.0 if not already installed.
2. Run in bash:
    ```bash
    npm install
    npm run package -- --platform=win32
    wine ./out/asar-integrity-bug-win32-x64/asar-integrity-bug.exe
    ```
3. Observe that the app crashes with similar error:
    ```
    [268:1112/144705.795:FATAL:archive_win.cc(152)] Failed to find file integrity info for resources\app.asar
    ```
4. Optionally: you can observe that the particular binary crashes with the same error when ran natively on Windows

## Correct behavior (Windows)

Using Windows 10, Node.js v20.12.2

1. Run in powershell:
    ```powershell
    npm install
    npm run package -- --platform=win32
    .\out\asar-integrity-bug-win32-x64\asar-integrity-bug.exe
    ```
2. Observe that the app runs successfully.

## Details

Using bash, you can compare the binaries that were created on both systems:
```bash
strings ./out/asar-integrity-bug-win32-x64/asar-integrity-bug.exe | grep '"alg":"SHA256"'
```

Expected output for binary built on Linux, excl. padding:
```
[{"file":"resources/app.asar","alg":"SHA256","value":"afe8171d89b2636b3ec0749a2e8321135d5119410ca041540faedeea2a26c8fa"}]
```

Expected output for binary built on Windows, excl. padding:
```
[{"file":"resources\\app.asar","alg":"SHA256","value":"0bf0b3451c21bad47120e43c30a414c1a7c77581845659f6ab86451a3ad0427f"}]
```
As you can see, when building on Linux for Windows, `electron` should use escaped backslashes, but it uses forward slashes.
The binary then cannot find the `app.asar` file when attempting to verify its integrity, and crashes.

### Note 1
By the way, there is no problem with the hash that is stored in `value`.
At first glance, it differs between Windows build and Linux build, but it is always consistent with the corresponding ASAR ✅
You can verify by calculating the ASAR hash:
```bash
node get-asar-hash.js ./out/asar-integrity-bug-win32-x64/resources/app.asar
```
For both apps built on Linux and Windows respectively, the asar hash matches the `strings` extracted from `.exe` binary.

### Note 2
The broken binary built on Linux works correctly after turning off the fuse:
```bash
npx @electron/fuses write --app ./out/asar-integrity-bug-win32-x64/asar-integrity-bug.exe EnableEmbeddedAsarIntegrityValidation=off
```
