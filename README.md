# StudyTrack

## Project Description

StudyTrack is a cloud-based study management system that helps students organize tasks, track deadlines, and manage their academic progress efficiently.

## Features

* Add, edit, and delete study tasks.
* Track assignment and exam deadlines.
* Organize tasks by course and priority.
* Responsive web interface.
* Cloud-based deployment on AWS.

## System Architecture

Frontend (HTML/CSS/JavaScript) is hosted on Amazon S3 and delivered through Amazon CloudFront.

Backend API is implemented using AWS Lambda and exposed through Amazon API Gateway.

Monitoring and logging are performed using Amazon CloudWatch.

Domain management is handled through Amazon Route 53, and HTTPS is secured using AWS Certificate Manager (ACM).

## AWS Services Used

* Amazon S3 – Frontend hosting
* Amazon CloudFront – Content delivery and HTTPS
* AWS Lambda – Backend logic
* Amazon API Gateway – REST API
* Amazon Route 53 – DNS management
* AWS Certificate Manager (ACM) – SSL certificate
* Amazon CloudWatch – Monitoring and logs
* IAM – Access management and security

## CI/CD

GitHub is used for source control and version management.

GitHub Actions is used to automate deployment and update processes.

## Repository Structure

* Frontend source files
* Backend Lambda functions
* GitHub Actions workflows
* Documentation

## Application URL

https://studytrack.proj.rotem.click

## Team Members
seham dabor - 212896252
marwa shhade 325555951
osama arfaeh 326836277

## Monitoring

CloudWatch Dashboard, Metrics, and Logs are used to monitor application performance and Lambda executions.

## Security

IAM Roles are used to securely grant permissions between AWS services without exposing access keys.
