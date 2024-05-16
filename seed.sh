#!/bin/bash

JSON_FILE="data.json"
URL="http://localhost:3000/transactions/two"

jq -c '.[]' "$JSON_FILE" | while read -r json_object; do
  curl -X POST -H "Content-Type: application/json" -d "$json_object" "$URL"
done

### data.json:
### [
###   {"category":"category1","description":"description1","amount":1,"date":"2024-01-01"},
###   {"category":"category2","description":"description2","amount":2,"date":"2024-01-02"},
###   {"category":"category3","description":"description3","amount":3,"date":"2024-01-03"},
### ]
