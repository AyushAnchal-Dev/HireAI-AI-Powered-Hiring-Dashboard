@echo off
echo Running Build...
call npm run build > build.log 2>&1
echo Build finished with exit code %errorlevel%

echo Running Lint...
call npm run lint > lint.log 2>&1
echo Lint finished with exit code %errorlevel%
