@echo off
pushd "%~dp0.." & rem Change working directory to the parent folder
echo Current directory: %CD%
rem Your script's commands go here
popd & rem Restore the original working directory

git pull

start "" startup.bat