# $PSDefaultParameterValues = @{ '*:Encoding' = 'utf8' }
$envvars = @"
CHROMEDRIVER=C:\\Users\\Restop-8734\\My_Notebook\\Testing\\webdrivers\\chromedriver-v110.0.5481.77-win32\\chromedriver.exe
FIREFOXDRIVER=C:\\Users\\Restop-8734\\My_Notebook\\Testing\\webdrivers\\geckodriver-v0.32.2-win32\\geckodriver.exe
OPERADRIVER=C:\\Users\\Restop-8734\\My_Notebook\\Testing\\webdrivers\\operadriver-v109.0.5414.120_win64\\operadriver.exe
EDGEDRIVER=C:\\Users\\Restop-8734\\My_Notebook\\Testing\\webdrivers\\edgedriver-v110.0.1587.41_win64\\msedgedriver.exe
FIREBASE_AUTH_EMULATOR_HOST=http://127.0.0.1:9098/auth"
GOOGLE_APPLICATION_CREDENTIALS=C:\Users\Restop-8734\My_Notebook\proof-of-vibes\snippets\database_update_scripts\prod-gae.json
"@

$path = $MyInvocation.MyCommand.Path
if (!$path) {$path = $psISE.CurrentFile.Fullpath}
if ($path)  {$path = Split-Path $path -Parent}

$E2EDir = $path + "\..\..\apps\zero\testing\testng"
Set-Location $E2EDir

Set-Content -Path .env -Value $envvars
# mvn clean test -DparamBrowser=CHROME -DparamEnv=DEV
# mvn clean test -DparamBrowser=CHROMEHEADLESS -DparamEnv=DEV
# mvn clean test  -DparamBrowser=FIREFOX -DparamEnv=DEV
# mvn clean test  -DparamBrowser=OPERA -DparamEnv=DEV
# mvn clean test  -DparamBrowser=EDGE -DparamEnv=DEV
# mvn clean test  -DparamBrowser=CHROME -DparamEnv=PREVIEW
# mvn clean test  -DparamBrowser=FIREFOX -DparamEnv=PREVIEW
# mvn clean test  -DparamBrowser=OPERA -DparamEnv=PREVIEW
# mvn clean test  -DparamBrowser=EDGE -DparamEnv=PREVIEW
# mvn clean test  -DparamBrowser=CHROME -DparamEnv=PROD
# mvn clean test  -DparamBrowser=FIREFOX -DparamEnv=PROD
# mvn clean test  -DparamBrowser=OPERA -DparamEnv=PROD
# mvn clean test  -DparamBrowser=EDGE -DparamEnv=PROD

# mvn clean test    -DsuiteFile="src\test\resources\ci-tests.xml" -DparamBrowser=OPERA -DparamEnv=DEV
# mvn clean test  -DsuiteFile="src\test\resources\multiple-browser-tests.xml" -DparamBrowser=CHROMEHEADLESS -DparamEnv=DEV
mvn clean test  -DsuiteFile="src\test\resources\headless-tests.xml"  -DparamEnv=DEVLOCAL
