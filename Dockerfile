# =========================
# Stage 1: Build the Spring Boot JAR using Maven
# =========================
FROM maven:3.9.3-eclipse-temurin-21 AS build

# Set working directory
WORKDIR /app

# Copy Maven wrapper and config from backend folder
COPY backend/mvnw .
COPY backend/.mvn .mvn

# Copy pom.xml first (for dependency caching)
COPY backend/pom.xml .

# Download dependencies
RUN ./mvnw dependency:go-offline

# Copy backend source code
COPY backend/src ./src

# Build the Spring Boot JAR (skip tests for faster build)
RUN ./mvnw clean package -DskipTests

# =========================
# Stage 2: Run the JAR with Java 21
# =========================
FROM eclipse-temurin:21-jdk

WORKDIR /app

# Copy the built JAR from the previous stage
COPY --from=build /app/target/*.jar app.jar

# Expose the port (Render provides PORT environment variable)
EXPOSE 5000

# Start the Spring Boot application
ENTRYPOINT ["java", "-jar", "app.jar"]
