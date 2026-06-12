import json
import boto3
import uuid

dynamodb = boto3.resource('dynamodb')
table = dynamodb.Table('StudyTrackTasks')

def lambda_handler(event, context):

    method = event.get("requestContext", {}).get("http", {}).get("method")

    if method == "GET":
        response = table.scan()

        return {
            "statusCode": 200,
            "body": json.dumps(response.get("Items", []))
        }

    elif method == "POST":
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

        return {
            "statusCode": 200,
            "body": json.dumps(task)
        }

    elif method == "PUT":
        body = json.loads(event["body"])

        table.put_item(Item=body)

        return {
            "statusCode": 200,
            "body": json.dumps({"message": "Task updated"})
        }

    elif method == "DELETE":
        task_id = event["pathParameters"]["id"]

        table.delete_item(
            Key={
                "id": task_id
            }
        )

        return {
            "statusCode": 200,
            "body": json.dumps({"message": "Task deleted"})
        }

    return {
        "statusCode": 400,
        "body": json.dumps({"message": "Unsupported method"})
    }