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

## Correct behavior (Windows)

Using Windows 10, Node.js v20.12.2

1. Run in powershell:
    ```powershell
    npm install
    npm run package -- --platform=win32
    .\out\asar-integrity-bug-win32-x64\asar-integrity-bug.exe
    ```
2. Observe that the app runs successfully.
