param(
    [switch]$BuildOnly,
    [switch]$SubmitOnly,
    [string]$Track = "production",
    [switch]$NoInteractive,
    [string]$ReleaseNotesPtBR = "",
    [string]$ReleaseNotesEnUS = "",
    [string]$ReleaseNotesFile = "",
    [switch]$NoGitHubRelease
)

$ErrorActionPreference = "Stop"
Set-Location (Split-Path $PSScriptRoot)

function Check-Command($cmd) {
    if (-not (Get-Command $cmd -ErrorAction SilentlyContinue)) {
        Write-Error "Command '$cmd' not found. Run: npm install -g eas-cli"
        exit 1
    }
}

function Check-ServiceAccount {
    if (-not (Test-Path ".\service-account.json")) {
        Write-Error "service-account.json not found. See README for instructions."
        exit 1
    }
}

function Get-GitDraft {
    $prevPreference = $ErrorActionPreference
    $ErrorActionPreference = "Continue"
    $lastTag = git describe --tags --abbrev=0 2>$null
    $hasTag = ($LASTEXITCODE -eq 0)
    $ErrorActionPreference = $prevPreference

    if ($hasTag) {
        $log = git log --pretty=format:"- %s" "${lastTag}..HEAD" 2>$null
    } else {
        $log = git log --pretty=format:"- %s" -n 10 2>$null
    }
    return ($log | Out-String).Trim()
}

function Open-FileForEditing($path) {
    if (Get-Command "code" -ErrorAction SilentlyContinue) {
        Start-Process "code" -ArgumentList "--wait", $path -Wait
    } else {
        Start-Process "notepad.exe" -ArgumentList $path -Wait
    }
}

function Truncate-Note($text) {
    $text = $text.Trim()
    if ($text.Length -gt 500) { return $text.Substring(0, 497) + "..." }
    return $text
}

function Get-AppVersion {
    $appJson = Get-Content ".\app.json" -Raw | ConvertFrom-Json
    return $appJson.expo.version
}

function Get-GitHubToken {
    if (-not [string]::IsNullOrWhiteSpace($env:GITHUB_TOKEN)) { return $env:GITHUB_TOKEN.Trim() }
    if (Test-Path ".\.github-token") { return (Get-Content ".\.github-token" -Raw).Trim() }
    return ""
}

function Get-GitHubRepo {
    $remoteUrl = git remote get-url origin 2>$null
    if ($remoteUrl -match "github\.com[:/](.+/.+?)(\.git)?$") {
        return $Matches[1]
    }
    return ""
}

function Create-GitHubRelease($version, $notes) {
    $token = Get-GitHubToken
    if ([string]::IsNullOrWhiteSpace($token)) {
        Write-Host "GitHub token not found - skipping GitHub release." -ForegroundColor DarkYellow
        Write-Host "  Set GITHUB_TOKEN env var or create a .github-token file in the project root." -ForegroundColor DarkGray
        return
    }

    $repo = Get-GitHubRepo
    if ($repo -eq "") {
        Write-Host "Could not determine GitHub repo from git remote - skipping." -ForegroundColor DarkYellow
        return
    }

    $tag = "v$version"

    $prevPreference = $ErrorActionPreference
    $ErrorActionPreference = "Continue"
    git tag $tag 2>$null
    $tagCreated = ($LASTEXITCODE -eq 0)
    $ErrorActionPreference = $prevPreference

    if ($tagCreated) {
        $prevPreference = $ErrorActionPreference
        $ErrorActionPreference = "SilentlyContinue"
        git push origin $tag 2>&1 | Out-Null
        $ErrorActionPreference = $prevPreference
        Write-Host "Tag $tag created and pushed." -ForegroundColor Green
    } else {
        Write-Host "Tag $tag already exists." -ForegroundColor DarkYellow
    }

    $body = @{
        tag_name = $tag
        name     = $tag
        body     = $notes
        draft    = $false
        prerelease = $false
    } | ConvertTo-Json

    $headers = @{
        Authorization = "token $token"
        Accept        = "application/vnd.github+json"
    }

    try {
        $response = Invoke-RestMethod -Uri "https://api.github.com/repos/$repo/releases" `
            -Method Post -Body $body -Headers $headers -ContentType "application/json"
        Write-Host "GitHub release created: $($response.html_url)" -ForegroundColor Green
    } catch {
        Write-Host "Failed to create GitHub release: $_" -ForegroundColor Red
    }
}

Check-Command "eas"
$env:EAS_BUILD_NO_EXPO_GO_WARNING = "true"

Write-Host "=== DietOS Android Deploy ===" -ForegroundColor Cyan
Write-Host "Track: $Track" -ForegroundColor Yellow

if ($ReleaseNotesFile -ne "") {
    if (-not (Test-Path $ReleaseNotesFile)) {
        Write-Error "File not found: $ReleaseNotesFile"
        exit 1
    }
    $fileContent = Get-Content $ReleaseNotesFile -Raw -Encoding UTF8
    $sections = $fileContent -split "(?m)^---\s*$"
    if ($sections.Count -ge 2) {
        $ReleaseNotesPtBR = $sections[0].Trim()
        $ReleaseNotesEnUS = $sections[1].Trim()
    } else {
        $ReleaseNotesPtBR = $fileContent.Trim()
        $ReleaseNotesEnUS = $fileContent.Trim()
    }
    $NoInteractive = $true
}

if ($ReleaseNotesPtBR -ne "" -or $ReleaseNotesEnUS -ne "") {
    $NoInteractive = $true
    if ($ReleaseNotesPtBR -eq "") { $ReleaseNotesPtBR = $ReleaseNotesEnUS }
    if ($ReleaseNotesEnUS -eq "") { $ReleaseNotesEnUS = $ReleaseNotesPtBR }
}

if (-not $BuildOnly) {
    $tempDir = Join-Path $env:TEMP "dietos-deploy"
    if (-not (Test-Path $tempDir)) { New-Item -ItemType Directory -Path $tempDir | Out-Null }

    $ptFile = Join-Path $tempDir "release-pt-BR.txt"
    $enFile = Join-Path $tempDir "release-en-US.txt"

    $gitDraft = Get-GitDraft

    if ($NoInteractive) {
        if ($releaseNotesPtBR -eq "") { $releaseNotesPtBR = Truncate-Note $gitDraft }
        if ($releaseNotesEnUS -eq "") { $releaseNotesEnUS = Truncate-Note $gitDraft }
        Write-Host "`nRelease notes:" -ForegroundColor Yellow
        Write-Host $releaseNotesPtBR -ForegroundColor Gray
    } else {
        $draft = if ($gitDraft -ne "") { $gitDraft } else { "" }
        $ptHeader = "# PT-BR - edite e salve. Feche o arquivo quando terminar.`n# Limite: 500 caracteres. Linhas com # sao ignoradas.`n`n"
        $enHeader = "# EN-US - edit and save. Close the file when done.`n# Limit: 500 characters. Lines starting with # are ignored.`n`n"
        Set-Content -Path $ptFile -Value ($ptHeader + $draft) -Encoding UTF8
        Set-Content -Path $enFile -Value ($enHeader + $draft) -Encoding UTF8

        Write-Host "`nAbrindo arquivos de release notes para revisao..." -ForegroundColor Cyan
        Write-Host "  PT-BR: $ptFile" -ForegroundColor Gray
        Write-Host "  EN-US: $enFile" -ForegroundColor Gray
        Write-Host ""

        Write-Host "Editando PT-BR..." -ForegroundColor Yellow
        Open-FileForEditing $ptFile

        Write-Host "Editando EN-US..." -ForegroundColor Yellow
        Open-FileForEditing $enFile

        $rawPt = (Get-Content $ptFile -Encoding UTF8) | Where-Object { $_ -notmatch "^\s*#" } | Out-String
        $rawEn = (Get-Content $enFile -Encoding UTF8) | Where-Object { $_ -notmatch "^\s*#" } | Out-String

        $releaseNotesPtBR = Truncate-Note $rawPt
        $releaseNotesEnUS = Truncate-Note $rawEn

        Write-Host "`n--- PT-BR ($($releaseNotesPtBR.Length) chars) ---" -ForegroundColor Yellow
        Write-Host $releaseNotesPtBR -ForegroundColor Gray
        Write-Host "`n--- EN-US ($($releaseNotesEnUS.Length) chars) ---" -ForegroundColor Yellow
        Write-Host $releaseNotesEnUS -ForegroundColor Gray
        Write-Host ""

        $confirm = Read-Host "Confirmar deploy com essas notas? (s/N)"
        if ($confirm -notmatch "^[sS]$") {
            Write-Host "Deploy cancelado." -ForegroundColor Red
            exit 0
        }
    }
}

if (-not $SubmitOnly) {
    Write-Host "`nBuilding production AAB..." -ForegroundColor Cyan
    eas build --platform android --profile production --non-interactive --no-wait
    if ($LASTEXITCODE -ne 0) {
        Write-Error "Build failed."
        exit 1
    }
    Write-Host "Build triggered (async)." -ForegroundColor Green
}

if (-not $BuildOnly) {
    Check-ServiceAccount

    $submitProfile = $Track
    Write-Host "`nSubmitting to Google Play (profile: $submitProfile)..." -ForegroundColor Cyan

    eas submit --platform android --profile $submitProfile --non-interactive --no-wait --latest

    if ($LASTEXITCODE -ne 0) {
        Write-Error "Submit failed."
        exit 1
    }

    Write-Host "Submitted to Google Play successfully." -ForegroundColor Green

    if ($releaseNotesPtBR -ne "" -or $releaseNotesEnUS -ne "") {
        $combined = ""
        if ($releaseNotesPtBR -ne "") { $combined += "<pt-BR>`n$releaseNotesPtBR`n</pt-BR>" }
        if ($releaseNotesEnUS -ne "") {
            if ($combined -ne "") { $combined += "`n`n" }
            $combined += "<en-US>`n$releaseNotesEnUS`n</en-US>"
        }

        Set-Clipboard -Value $combined

        Write-Host ""
        Write-Host "--------------------------------------------------" -ForegroundColor DarkGray
        Write-Host "  RELEASE NOTES - cole na Play Console" -ForegroundColor Yellow
        Write-Host "  Production - Edit release - Notas da versao" -ForegroundColor DarkGray
        Write-Host "--------------------------------------------------" -ForegroundColor DarkGray
        Write-Host $combined -ForegroundColor White
        Write-Host "--------------------------------------------------" -ForegroundColor DarkGray
        Write-Host "  (copiado para o clipboard)" -ForegroundColor DarkGray
        Write-Host ""
    }

    if (-not $NoGitHubRelease) {
        $version = Get-AppVersion
        $githubNotes = if ($releaseNotesEnUS -ne "") { $releaseNotesEnUS } else { $releaseNotesPtBR }
        Write-Host "Creating GitHub release v$version..." -ForegroundColor Cyan
        Create-GitHubRelease $version $githubNotes
    }
}

Write-Host "`nDone." -ForegroundColor Green
