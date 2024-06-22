@echo off
REM start "" "C:\Program Files\Google\Chrome\Application\chrome.exe" --kiosk "https://pulipulichen.github.io/Fullscreen-Quad-Webcam-Viewer/#/"
REM start "" "C:\Program Files\Google\Chrome\Application\chrome.exe" --kiosk "C:\Users\pulip\Downloads\Fullscreen Qual Webcam Viewer.html"

pushd "%~dp0.." & rem Change working directory to the parent folder

start /B "" "windows\x86_64-pc-windows-msvc-simple-http-server.exe"
timeout /t 10 /nobreak > nul
"C:\Program Files\Google\Chrome\Application\chrome.exe" --kiosk "http://localhost:8000/index.html"

exit
