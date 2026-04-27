# Stage 1: compilar el JAR con Maven dentro de Docker
FROM maven:3.9-eclipse-temurin-21 AS build
WORKDIR /build

# Cachea dependencias: copia primero el pom.xml y descarga dependencias
COPY pom.xml .
RUN mvn dependency:go-offline -B

# Copia el codigo fuente y empaqueta
COPY src ./src
RUN mvn clean package -DskipTests -B

# Stage 2: imagen final ligera con solo el JRE y el JAR
FROM eclipse-temurin:21-jre
WORKDIR /app
COPY --from=build /build/target/*.jar app.jar
EXPOSE 8080
ENTRYPOINT ["java", "-jar", "app.jar"]
