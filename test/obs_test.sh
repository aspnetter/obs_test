if [ -z "$1" ] 
then
    echo "Starting the Robot API..."
    lsof -ti tcp:3000 | xargs kill 
    yarn api:run
else
    inputFile=$1
    if [ -z "$2" ] 
      then
        echo "Please provide the output file"
      else 
        outputFile=$2
        yarn cli:run --args="$inputFile,$outputFile"
      fi
fi