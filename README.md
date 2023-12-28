# Student Details CRUD Demo Project

This is a simple CRUD demo project for managing student details. The project is divided into two repositories: one for the front end and one for the back end.

# Student Details Frontend 
https://github.com/NimnaKs/Student-details-Page-frontend

# Student Details Backend
https://github.com/NimnaKs/Student-details-Page-backend.git

# Getting Started
clone the backend 
git clone https://github.com/NimnaKs/Student-details-Page-backend.git

change database credentials.
create database and create student table.
query for student table 
create table Student
(
    student_id     varchar(10)  not null
        primary key,
    first_name     varchar(50)  null,
    last_name      varchar(50)  null,
    address        varchar(255) null,
    batch_no       int          null,
    contact_number varchar(10)  null,
    email          varchar(255) null,
    program        varchar(50)  null
);

then run the backend server through apache tom cat server.

then visit to 
