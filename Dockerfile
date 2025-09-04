# Stage 1: Build backend JAR
FROM maven:3.9-eclipse-temurin-21 AS build
WORKDIR /app

# Copy Maven wrapper and config from backend
COPY backend/mvnw .
COPY backend/.mvn .mvn

# Copy pom.xml first for caching
COPY backend/pom.xml .

# Download dependencies offline
RUN ./mvnw dependency:go-offline

# Copy backend source code
COPY backend/src ./src

# Build Spring Boot JAR (skip tests)
RUN ./mvnw clean package -DskipTests

# Stage 2: Run JAR
FROM eclipse-temurin:21-jdk
WORKDIR /app

# Copy built JAR from build stage
COPY --from=build /app/target/*.jar app.jar

# Expose port (Render will use PORT env variable)
EXPOSE 5000

# Start backend
ENTRYPOINT ["java", "-jar", "app.jar"]
