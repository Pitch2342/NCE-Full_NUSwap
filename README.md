# NCE-Full_NUSwap

## Requirements
- Python3
- Docker
- Node (v14 preferably)
- PostgreSQL

## Setup Before Running
### Step 1 - Docker Setup
1. Ensure Docker is running 
2. Open Command Prompt orTerminal
3. Run the following command
```
docker run --rm -it --name mq -d -p 5672:5672 -p 15672:15672 -dit rabbitmq
```
### Step 2 - Create PostgreSQL Database
1. Create a Database in PostgreSQL and a user with admin privileges.

### Step 3 - Python and Matching Engine Setup
1. Setup python using the requirements.txt in maching engine folder
2. Open DBHelper.py and set your own PostgreSQL credentials

### Step 4 - Frontend
1. Go to Frontend folder
2. Run
```
npm install
```

### Step 5 - Backend
1. Go to Backend folder
2. Run
```
npm install
```
3. Open PostgreServer and set your own PostgreSQL credentials
# Live Run
## Step 1 - Open 4 terminals

## Step 2 - Terminal number 1





