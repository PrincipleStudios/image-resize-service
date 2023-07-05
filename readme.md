# Image Conversion Service

A simple Azure Function to upload source images to Azure Blob Storage and provide easy
resize capabilities. See the [api specification](./api.yaml) for usage details.

## Setup

1. Create an Azure Storage Account service with the following initial setup:

   - 3 tables:
     - `GroupImages`
     - `SourceImages`
     - `UsedImages`
   - 2 containers:
     - `sourceimages` - "Public access level" should be set to "Private"
     - `generatedimages` - "Public access level" should be set to "Blob"

2. Set up a storage account and function app for the functions.

   ```pwsh
   $funcStorage = 'storageaccountname'
   $resourceGroup = 'resourcegroup'
   $funcAppName = 'funcappname'
   $region = 'southcentralus'

   az storage account create --name $funcStorage --location $region --resource-group $resourceGroup --sku Standard_LRS --allow-blob-public-access false
   az functionapp create --resource-group $resourceGroup --consumption-plan-location $region --runtime node --runtime-version 18 --name $funcAppName --storage-account psmarketingfuncs --functions-version 4
   az functionapp config appsettings set --name $funcAppName --resource-group $resourceGroup --settings AzureWebJobsFeatureFlags=EnableWorkerIndexing
   ```

3. Make the following adjustments via the portal:
   - Set the AZURE_STORAGE_ACCOUNT_NAME and AZURE_STORAGE_ACCOUNT_KEY variables in "Settings -> Configuration -> Application Settings"
   - Set the "Platform" to "64 Bit" in "Settings -> Configuration -> General Settings"

## Development

Create a `.env` file in the root with the following values:

```
AZURE_STORAGE_ACCOUNT_NAME=
AZURE_STORAGE_ACCOUNT_KEY=
```

Then run:

```sh
npm install
npm run dev
```

A few sample powershell scripts:

```pwsh
$file = '/path/to/file.jpg' # If this is not a jpg, adjust the content type below
$hash = $(Get-FileHash $file -Algorithm SHA1).Hash.ToLower()

# Upload the given file
Invoke-RestMethod -Uri "http://localhost:7071/api/upload?sha=$hash&format=jpg" -Method Put -InFile $file -ContentType image/jpg -Headers @{ "X-API-Key" = $secretKey }

# Resize it to 400x400 and get the actual URL
Invoke-RestMethod -Uri "http://localhost:7071/api/generate?groupId=local&width=400&height=400&sha=$hash&format=webp" -Method Get -Headers @{ "X-API-Key" = $secretKey }

# Remove resizes associated with "local"
Invoke-RestMethod -Uri http://localhost:7071/api/purge?groupId=local -Method Post -Headers @{ "X-API-Key" = $secretKey }


# For remote testing
$secretKey = 'secret-key' # Azure functions key

# Upload the given file
Invoke-RestMethod -Uri "https://ps-image-resize-service.azurewebsites.net/api/upload?sha=$hash&format=jpg" -Method Put -InFile $file -ContentType image/jpg -Headers @{ "X-Functions-Key" = $secretKey }

# Resize it to 400x400 and get the actual URL
Invoke-RestMethod -Uri "https://ps-image-resize-service.azurewebsites.net/api/generate?groupId=local&width=400&height=400&sha=$hash&format=webp" -Method Get -Headers @{ "X-Functions-Key" = $secretKey }

# Remove resizes associated with "local"
Invoke-RestMethod -Uri https://ps-image-resize-service.azurewebsites.net/api/purge?groupId=local -Method Post -Headers @{ "X-Functions-Key" = $secretKey }

```

## Build

Set the `.env` file as defined above in the Development section and run either of the following:

```sh
npm install
npm start
```

## Deploy

The Azure Functions server is configured to run on a Windows x64 server. As such, `sharp`, which is used and requires a native build, must be installed for a Windows x64 machine.

The `./deployment/deploy.ps1` script has only been tested on a Windows x64 machine, but includes the command to install the appropriate architecture.
