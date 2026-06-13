StudyTrack
Project Description
StudyTrack is a cloud-based study management system that helps students organize academic tasks, track deadlines, and manage their study progress efficiently.

Application Links
Website URL: https://studytrack.proj.rotem.click
API URL: https://u24x4b9vd9.execute-api.eu-north-1.amazonaws.com/tasks
GitHub Repository: https://github.com/YVC-CloudDev/studytrack.git
Features
Add new study tasks.
Edit existing tasks.
Delete tasks.
Mark tasks as done.
Organize tasks by course, priority, and due date.
Panic meter that calculates task pressure based on priority and deadlines.
Responsive web interface.
System Architecture
The frontend is built with HTML, CSS, and JavaScript.

The frontend is hosted on Amazon S3 and delivered through Amazon CloudFront.

Users access the application through the custom domain: https://studytrack.proj.rotem.click

Amazon Route 53 manages the DNS records for the domain.

AWS Certificate Manager (ACM) provides the SSL certificate for HTTPS.

The frontend communicates with Amazon API Gateway using JavaScript fetch requests.

API Gateway forwards the requests to AWS Lambda.

AWS Lambda contains the backend logic for adding, reading, updating, and deleting tasks.

Amazon DynamoDB stores the task data.

Amazon CloudWatch is used for monitoring, metrics, dashboard, and logs.

Architecture Diagram
User → Route 53 → CloudFront → S3 Frontend → API Gateway → Lambda StudyTrackAPI → DynamoDB → CloudWatch

AWS Services Used
Amazon S3 – Hosts the frontend files.
Amazon CloudFront – Delivers the website and enables HTTPS.
Amazon Route 53 – Manages the custom domain and DNS records.
AWS Certificate Manager (ACM) – Provides the SSL certificate.
Amazon API Gateway – Exposes the backend API routes.
AWS Lambda – Runs the backend serverless logic.
Amazon DynamoDB – Stores task data.
Amazon CloudWatch – Provides logs, metrics, and dashboard monitoring.
IAM – Manages secure permissions between AWS services.
API Routes
GET /tasks – Get all tasks.
POST /tasks – Add a new task.
PUT /tasks – Update an existing task.
DELETE /tasks/{id} – Delete a task.
CI/CD
GitHub is used for source control and version management.

GitHub Actions is used for deployment automation.

The workflow is named Deploy to AWS.

When changes are pushed or merged into the main branch, the workflow runs automatically and deploys the updated frontend files to AWS.

Repository Structure
frontend/index.html
frontend/style.css
frontend/script.js
backend/lambda_function.py
.github/workflows/
README.md
Monitoring
Amazon CloudWatch is used to monitor the Lambda function.

We created:

CloudWatch Metrics
CloudWatch Dashboard
CloudWatch Logs
The monitoring shows Lambda invocations, errors, duration, and execution logs.

Security
IAM Roles are used to give Lambda permissions to access DynamoDB and CloudWatch without exposing access keys or secrets.

HTTPS is enabled using ACM and CloudFront.

Team Members
Seham Dabor – 212896252
Marwa Shhade – 325555951
Osama Arfaeh – 326836277