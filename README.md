# Doctor's Appointment App: Modern Deployment with Docker, Kubernetes, and AWS EKS

This repository contains the codebase and deployment scripts for the **Doctor's Appointment App**, a cloud-native application designed to manage doctor appointments efficiently. The project demonstrates modern deployment practices using **Docker**, **Kubernetes**, and **AWS Elastic Kubernetes Service (EKS)**.

# Project Team Members

This project was created by the following members as part of the **ENPM818R - Variable Topics in Engineering: Virtualization and Container Technologies** course:

- **Pranay Bhamidipati**
- **Dhiral Vyas**
- **Subramanian Venkatachalam**
- **Shubham Sinha**
- **Sai Akhilesh Nulu**
- **Arbaaz Jamadar**
- **Hindolo Charlie**



---

## Introduction
The **Doctor's Appointment App** is a full-stack application built with React (frontend) and Node.js/Express (backend), integrated with MongoDB for database operations. This project emphasizes scalable deployment using Docker containers, Kubernetes orchestration, and AWS EKS for production-grade cluster management.

---

## Features
- **Frontend:** User-friendly interface to book, view, and manage doctor appointments.
- **Backend:** RESTful API services for appointment management, built with Node.js and Express.
- **Database:** Secure storage of appointment details using MongoDB.
- **Scalable Deployment:** Dockerized services orchestrated with Kubernetes and deployed on AWS EKS.
- **Elastic Load Balancer (ELB):** High availability and fault tolerance.
- **Secrets Management:** Secure API key storage using AWS Secrets Manager.

---

## Tech Stack
- **Frontend:** React, HTML, CSS
- **Backend:** Node.js, Express.js
- **Database:** MongoDB
- **Containerization:** Docker
- **Orchestration:** Kubernetes
- **Cloud Platform:** AWS EKS
- **Load Balancer:** AWS Elastic Load Balancer (ELB)

---

## Architecture Overview
The app is deployed in a **cloud-native architecture**, as shown below:

1. **Frontend Service** running on Nginx (acts as a reverse proxy).
2. **Backend Service** communicates with MongoDB and DynamoDB using APIs.
3. **AWS EKS Cluster** manages pods for scalability and fault tolerance.
4. **Elastic Load Balancer (ELB)** handles incoming traffic.
5. **AWS Secrets Manager** secures sensitive information like API keys.

## Stucture
ENPM818R/
│
├── backend/
│   ├── Dockerfile
│   ├── package.json
│   ├── server.js
│   └── routes/
├── frontend/
│   ├── Dockerfile
│   ├── package.json
│   ├── src/
│   └── public/
├── k8s/
│   ├── deployments.yaml
│   ├── services.yaml
│   └── ingress.yaml
└── README.md
