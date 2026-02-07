@echo off
echo Running npm install...
call npm install
if %errorlevel% neq 0 exit /b %errorlevel%

echo Running prisma generate...
call npx prisma generate
if %errorlevel% neq 0 exit /b %errorlevel%

echo Running prisma migrate reset...
call npx prisma migrate reset --force
if %errorlevel% neq 0 exit /b %errorlevel%

echo Running seed...
call npx tsx prisma/seed.ts
if %errorlevel% neq 0 exit /b %errorlevel%

echo ALL DONE
