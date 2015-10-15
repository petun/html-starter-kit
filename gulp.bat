@echo off

rem -------------------------------------------------------------
rem  command line script for Windows.
rem -------------------------------------------------------------

@setlocal

node "..\node_modules\gulp\bin\gulp.js" %*

@endlocal
