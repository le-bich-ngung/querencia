# remove-emdash-and-push.ps1
# Chay script nay tu thu muc goc cua repo querencia (noi co file .git)
# Muc dich: xoa toan bo dau em dash "—" trong code, thay bang "-", roi commit + push

$ErrorActionPreference = "Stop"

# 1. Cac thu muc/file bo qua
$excludeDirs = @("node_modules", ".git", ".next", "dist", "build", ".turbo", "android", "ios")
$excludeFiles = @("pnpm-lock.yaml")

# 2. Cac phan mo rong duoc coi la text file (bo qua binary, image, font...)
$textExtensions = @(
    ".ts", ".tsx", ".js", ".jsx", ".mjs", ".cjs",
    ".py", ".json", ".md", ".mdx", ".css", ".scss",
    ".html", ".htm", ".sql", ".yaml", ".yml", ".toml",
    ".txt", ".env", ".gitignore", ".xml"
)

Write-Host "Dang quet file trong repo..." -ForegroundColor Cyan

$allFiles = Get-ChildItem -Path . -Recurse -File -Force | Where-Object {
    $path = $_.FullName
    $inExcludedDir = $false
    foreach ($dir in $excludeDirs) {
        if ($path -match [regex]::Escape("\$dir\") -or $path -match [regex]::Escape("/$dir/")) {
            $inExcludedDir = $true
            break
        }
    }
    $isExcludedFile = $excludeFiles -contains $_.Name
    $ext = $_.Extension.ToLower()
    $isTextExt = $textExtensions -contains $ext -or $_.Name -eq ".env.example" -or $_.Name -eq ".gitignore"

    (-not $inExcludedDir) -and (-not $isExcludedFile) -and $isTextExt
}

Write-Host "Tim thay $($allFiles.Count) file text, dang kiem tra em dash..." -ForegroundColor Cyan

$changedFiles = @()
$utf8NoBom = New-Object System.Text.UTF8Encoding $false

foreach ($file in $allFiles) {
    $content = [System.IO.File]::ReadAllText($file.FullName)
    if ($content.Contains([char]0x2014)) {
        $newContent = $content.Replace([char]0x2014, "-")
        [System.IO.File]::WriteAllText($file.FullName, $newContent, $utf8NoBom)
        $changedFiles += $file.FullName
    }
}

Write-Host "Da sua $($changedFiles.Count) file:" -ForegroundColor Green
$changedFiles | ForEach-Object { Write-Host "  - $_" }

if ($changedFiles.Count -eq 0) {
    Write-Host "Khong co file nao chua em dash. Khong can commit." -ForegroundColor Yellow
    exit 0
}

# 3. Git add, commit, push
Write-Host "`nDang commit va push..." -ForegroundColor Cyan

git add -A
git commit -m "chore: remove em dash across ecosystem"
git push

Write-Host "`nXong! Da push len GitHub." -ForegroundColor Green
