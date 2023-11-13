param(
    [Parameter(Mandatory = $true)]
    [string]$filePath
)

$SERVER = "http://192.168.1.183:3070"

$matchedWeight = (Get-Content "$filePath" | Select-String -Pattern '^.*Material Weight:\s+(\d+\.\d+).*g.*$').Matches.Groups[1].Value
$matchedNote = (Get-Content "$filePath" | Select-String -Pattern '^.*targetModels,(.+)$').Matches.Groups[1].Value
$body = @{weight = $matchedWeight; note = $matchedNote; filePath = $filePath } | ConvertTo-Json

Invoke-RestMethod -Method Post -Uri "$SERVER/spools/use/top" -Body $body -Header @{"Content-Type" = "application/json" }
