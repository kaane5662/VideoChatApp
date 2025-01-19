# Use the official .NET SDK image for building the app (Ensure SDK version is correct)
FROM mcr.microsoft.com/dotnet/sdk:8.0 AS build
WORKDIR /app

# Copy the project file and restore any dependencies (via restore)
COPY *.csproj ./
RUN dotnet restore

# Copy the rest of the code and publish the app to the 'out' directory
COPY . ./
RUN dotnet publish -c Release -o /out

# Use the runtime image for running the app
FROM mcr.microsoft.com/dotnet/aspnet:8.0 AS runtime
WORKDIR /app

# Copy the build output from the build stage to the runtime image
COPY --from=build /out ./

# Expose the port your app runs on (replace with the actual port if needed)
EXPOSE 80

# Set the entry point to your app's DLL
ENTRYPOINT ["dotnet", "videochat-app.dll"]