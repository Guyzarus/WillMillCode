Param
(
    [Parameter(Mandatory = $true)] [string] $scriptUser
)

Set-Location Env:

# dev
Set-Content -Path FLASK_BACKEND_ENV                          -Value "DEV"
Set-Content -Path NEWSAPI_KEY                                -Value ""
Set-Content -Path SPOTIFY_APP_0_CLIENT_ID                    -Value "79fe236872c64537a06b2122693a0f78"
Set-Content -Path SPOTIFY_APP_0_CLIENT_SECRET                -Value "9ed230bf6a3b4a5b8e152ebd6d33082b"
Set-Content -Path MORALIS_WEB3_API_KEY                       -Value "VBrQqoq4hAfPl3jkgcnqhdphOu6rBM474jQarK7y4wMmQHmlttUm5w37hwja2W5k"
Set-Content -Path EVENTBRITE_PRIVATE_OAUTH_TOKEN             -Value ""
Set-Content -Path NIBLS_TWILLIO_SENGRID_APIKEY_0             -Value ""
Set-Content -Path NIBLS_WEBAPP_ACCTMGNT_CLIENT_SECRET_0      -Value ""
Set-Content -Path AZURE_AUTH_0_CLIENT_SECRET                 -Value ""
Set-Content -Path AZURE_AUTH_1_CLIENT_SECRET                 -Value ""
Set-Content -Path SQLALCHEMY_PYMSSQL_0_CONN_STRING           -Value "mssql+pyodbc://sa:wX.D}/n(ZNpzVr}@localhost/nibls-mssql-database-0?driver=ODBC+Driver+17+for+SQL+Server"

Set-Content -Path RESTDBIO_SERVER_API_KEY_0                  -Value ""

$ProjectDir =  $HOME + "\My_Notebook\project_template\apps\zero\backend\flask\dev"
$RunScriptDir = $HOME + "\My_Notebook\project_template\ignore\"+$scriptUser
Set-Location $ProjectDir
python app.py
# waitress-serve --listen=*:5000 --threads=100  app:app

Set-Location $RunScriptDir
./run_backend_dev.ps1 $scriptUser
