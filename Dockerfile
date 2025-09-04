# Use Java runtime
FROM openjdk:17-jdk-slim

WORKDIR /app

# Copy only backend files (optional: exclude frontend)
COPY . .

# Build the backend
RUN ./mvnw clean package -DskipTests   # or use mvn clean package

# Expose port
EXPOSE 5000

# Start the app
ENTRYPOINT ["java", "-jar", "target/your-app-name.jar"]
