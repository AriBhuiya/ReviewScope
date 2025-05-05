#!/bin/bash

set -e

echo "🔧 Setting up default configuration files..."

# Helper: create file if it doesn't exist
create_file() {
  local file_path="$1"
  local content="$2"

  mkdir -p "$(dirname "$file_path")"

  if [ -f "$file_path" ]; then
    echo "⚠️  Skipping $file_path (already exists)"
  else
    echo "✅ Creating $file_path"
    cat <<EOF > "$file_path"
$content
EOF
  fi
}

# Environment files
create_file "mongo_config/.env" "MONGO_INITDB_ROOT_USERNAME=devuser
MONGO_INITDB_ROOT_PASSWORD=devpass
MONGO_INITDB_DATABASE=reviewscope"

create_file "backend/.env" "MONGO_URI=mongodb://devuser:devpass@mongo:27017/?authSource=admin
MONGO_DB_NAME=reviewscope
# [For native depl] The following are overridden in the dockercompose file
# QUEUE_URI=http://localhost:8000/
# FRONTEND_ORIGIN=http://localhost:5173"

create_file "frontend/.env" "# [For native depl] The following is overridden in docker compose file.
# VITE_API_URL=http://localhost:5173"

create_file "jobqueue/.env" "MONGO_URI=mongodb://devuser:devpass@mongo:27017/?authSource=admin
MONGO_DB_NAME=reviewscope"

create_file "nlpengine/.env" "MONGO_URI=mongodb://devuser:devpass@mongo:27017/?authSource=admin
MONGO_DB_NAME=reviewscope
MODEL=VADER # VADER OR HUGGINGFACE
# [For native depl] Overridden in docker-compose
# QUEUE_URI=http://localhost:8000
# CRON=10"

create_file "scraper/.env" "MONGO_URI=mongodb://devuser:devpass@mongo:27017/?authSource=admin
MONGO_DB_NAME=reviewscope
# [For native depl] Overridden in docker-compose
# QUEUE_URI=http://localhost:8000
# CRON=10"

create_file "scraper/config.yaml" "scraper:
  source: \"google\"       # or \"ios\"
  lang: \"en\"
  country: \"gb\"         # gb, us, in etc.
  review_count: 100000    # number of reviews to scrape
  sort_by: \"newest\"      # newest or most_relevant"

echo "🎉 Done. All config files are ready."