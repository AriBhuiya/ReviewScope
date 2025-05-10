$ErrorActionPreference = "Stop"

Write-Host "🔧 Setting up default configuration files..."

function Create-File {
    param (
        [string]$filePath,
        [string]$content
    )

    $directory = Split-Path $filePath -Parent
    if (!(Test-Path $directory)) {
        New-Item -ItemType Directory -Path $directory -Force | Out-Null
    }

    if (Test-Path $filePath) {
        Write-Host "⚠️  Skipping $filePath (already exists)"
    } else {
        Write-Host "✅ Creating $filePath"
        $content | Out-File -FilePath $filePath -Encoding utf8
    }
}

# Environment files
Create-File "mongo_config\.env" @"
MONGO_INITDB_ROOT_USERNAME=devuser
MONGO_INITDB_ROOT_PASSWORD=devpass
MONGO_INITDB_DATABASE=reviewscope
"@

Create-File "backend\.env" @"
MONGO_URI=mongodb://devuser:devpass@mongo:27017/?authSource=admin
MONGO_DB_NAME=reviewscope
# [For native depl] The following are overridden in the dockercompose file
# QUEUE_URI=http://localhost:8000/
# FRONTEND_ORIGIN=http://localhost:5173
"@

Create-File "frontend\.env" @"
# [For native depl] The following is overridden in docker compose file.
# VITE_API_URL=http://localhost:5173
"@

Create-File "jobqueue\.env" @"
MONGO_URI=mongodb://devuser:devpass@mongo:27017/?authSource=admin
MONGO_DB_NAME=reviewscope
"@

Create-File "nlpengine\.env" @"
MONGO_URI=mongodb://devuser:devpass@mongo:27017/?authSource=admin
MONGO_DB_NAME=reviewscope
MODEL=VADER # VADER OR HUGGINGFACE
# [For native depl] Overridden in docker-compose
# QUEUE_URI=http://localhost:8000
# CRON=10
"@

Create-File "scraper\.env" @"
MONGO_URI=mongodb://devuser:devpass@mongo:27017/?authSource=admin
MONGO_DB_NAME=reviewscope
# [For native depl] Overridden in docker-compose
# QUEUE_URI=http://localhost:8000
# CRON=10
"@

Create-File "scraper\config.yaml" @"
scraper:
  source: "google"       # or "ios"
  lang: "en"
  country: "gb"         # gb, us, in etc.
  review_count: 100000    # number of reviews to scrape
  sort_by: "newest"      # newest or most_relevant
"@

Write-Host "🎉 Done. All config files are ready."