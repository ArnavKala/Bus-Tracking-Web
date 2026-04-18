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

# Create a non-root user for security
RUN addgroup --system javauser && adduser --system --ingroup javauser javauser
USER javauser

# Copy the build artifact from the local target folder (or build stage if using multi-stage)
# For simple Render setups, we can expect the build to happen in the container
COPY --from=build /app/target/*.jar app.jar

EXPOSE 8080

ENTRYPOINT ["java", "-jar", "app.jar"]