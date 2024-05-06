# Use the official PostgreSQL image
FROM postgres:latest
ENV POSTGRES_DB todos
ENV POSTGRES_USER admin
ENV POSTGRES_PASSWORD password
EXPOSE 5432
