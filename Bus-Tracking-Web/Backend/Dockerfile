# Build stage
FROM maven:3.9.14-eclipse-temurin-25 AS build
WORKDIR /app

# Copy the pom.xml and source code
COPY pom.xml .
COPY src ./src

# Build the application
RUN mvn clean package -DskipTests

# Run stage
FROM eclipse-temurin:25-jre
WORKDIR /app

# 3. Create a non-root user for security
RUN addgroup --system javauser && adduser --system --ingroup javauser javauser
USER javauser

# 4. Use a specific name if possible, or ensure only one jar is copied
# If your artifactId is "my-app", the file is usually target/my-app-1.0.0.jar
# COPY --from=build /app/target/*.jar app.jar

EXPOSE 8080

ENTRYPOINT ["java", "-jar", ".\target\Backend-0.0.1-SNAPSHOT.jar"]