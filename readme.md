












## Minimalistic run setup
The easiest way to run this project is to use `docker-compose` and `docker`
There are plenty of resources available in the internet and the installation is beyond the scope of this repo.

Verify you have docker and docker-compose installed first.
```bash
docker --version
# Docker version 28.0.0, build f9ced58158
docker-compose version
# Docker Compose version 2.33.1
```
Clone the Repo
```bash
git clone https://github.com/AriBhuiya/ReviewScope.git
```
Generate the initial env template
```bash
cd ReviewScope
# on linux and mac
chmod +x env_init.sh
./env_init.sh
```
Start the containers
```bash
docker-compose up
# or for detached mode
docker-compose up -d 
```






