import json
import boto3
import uuid

dynamodb = boto3.resource("dynamodb")
table = dynamodb.Table("StudyTrackTasks")

headers = {
    "Content-Type": "application/json",
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "GET,POST,PUT,DELETE,OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type"
}

def make_response(status_code, body):
    return {
        "statusCode": status_code,
        "headers": headers,
        "body": json.dumps(body)
    }

def lambda_handler(event, context):
    method = event.get("requestContext", {}).get("http", {}).get("method")

    if method == "OPTIONS":
        return make_response(200, {"message": "OK"})

    if method == "GET":
        response = table.scan()
        return make_response(200, response.get("Items", []))

    if method == "POST":
        body = json.loads(event["body"])

        task = {
            "id": str(uuid.uuid4()),
            "title": body["title"],
            "course": body["course"],
            "priority": body["priority"],
            "dueDate": body["dueDate"],
            "done": False
        }

        table.put_item(Item=task)
        return make_response(200, task)

    if method == "PUT":
        body = json.loads(event["body"])
        table.put_item(Item=body)
        return make_response(200, {"message": "Task updated"})

    if method == "DELETE":
        task_id = event["pathParameters"]["id"]
        table.delete_item(Key={"id": task_id})
        return make_response(200, {"message": "Task deleted"})

    return make_response(400, {"message": "Unsupported method"})