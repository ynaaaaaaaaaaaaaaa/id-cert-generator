# Serves this folder at http://localhost:8000/ using only built-in Windows PowerShell.
param([switch]$NoBrowser)
$port = 8000
$root = $PSScriptRoot
$types = @{
  ".html" = "text/html; charset=utf-8"
  ".css" = "text/css; charset=utf-8"
  ".js" = "text/javascript; charset=utf-8"
  ".png" = "image/png"
  ".webmanifest" = "application/manifest+json"
}

$listener = New-Object System.Net.HttpListener
$listener.Prefixes.Add("http://localhost:$port/")
$listener.Start()
Write-Host "ID & Certificate Generator running at http://localhost:$port/"
Write-Host "Keep this window open while installing. Close it when done."
if (-not $NoBrowser) { Start-Process "http://localhost:$port/" }

while ($listener.IsListening) {
  $context = $listener.GetContext()
  $path = [Uri]::UnescapeDataString($context.Request.Url.AbsolutePath)
  if ($path.EndsWith("/")) { $path += "index.html" }
  $file = [IO.Path]::GetFullPath((Join-Path $root $path.TrimStart("/")))
  $response = $context.Response
  if ($file.StartsWith($root) -and (Test-Path $file -PathType Leaf)) {
    $bytes = [IO.File]::ReadAllBytes($file)
    $type = $types[[IO.Path]::GetExtension($file).ToLower()]
    $response.ContentType = if ($type) { $type } else { "application/octet-stream" }
    $response.OutputStream.Write($bytes, 0, $bytes.Length)
  } else {
    $response.StatusCode = 404
  }
  $response.Close()
}
