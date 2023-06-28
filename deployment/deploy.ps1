#!/usr/bin/env pwsh

npm ci
if ($global:LASTEXITCODE -ne 0) { throw '"npm ci" did not succeed' }
npm run build
if ($global:LASTEXITCODE -ne 0) { throw '"npm run build" did not succeed' }
npm ci --omit=dev --platform=win32 --arch=x64
if ($global:LASTEXITCODE -ne 0) { throw '"npm ci --omit=dev" did not succeed' }

#func pack
func azure functionapp publish ps-image-resize-service
if ($global:LASTEXITCODE -ne 0) { throw 'Publish failed' }

npm ci
