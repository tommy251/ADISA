Add-Type -AssemblyName System.Drawing

function Trim-Logo([string]$inPath, [string]$outPath) {
  $bmp = [System.Drawing.Bitmap]::FromFile($inPath)
  $w = $bmp.Width; $h = $bmp.Height
  $corner = $bmp.GetPixel(0, 0)
  $transparent = ($corner.A -eq 0)
  Write-Host "$([IO.Path]::GetFileName($inPath)): ${w}x${h}, cornerAlpha=$($corner.A) transparent=$transparent"

  $step = 8
  $minX = $w; $minY = $h; $maxX = -1; $maxY = -1
  for ($y = 0; $y -lt $h; $y += $step) {
    for ($x = 0; $x -lt $w; $x += $step) {
      $p = $bmp.GetPixel($x, $y)
      $isContent = if ($transparent) { $p.A -gt 4 } else { ($p.R -lt 240) -or ($p.G -lt 240) -or ($p.B -lt 240) }
      if ($isContent) {
        if ($x -lt $minX) { $minX = $x }
        if ($y -lt $minY) { $minY = $y }
        if ($x -gt $maxX) { $maxX = $x }
        if ($y -gt $maxY) { $maxY = $y }
      }
    }
  }
  if ($maxX -lt 0) { Write-Host "  no content found, skipping"; $bmp.Dispose(); return }

  $pad = 12
  $minX = [Math]::Max(0, $minX - $pad); $minY = [Math]::Max(0, $minY - $pad)
  $maxX = [Math]::Min($w - 1, $maxX + $pad); $maxY = [Math]::Min($h - 1, $maxY + $pad)
  $cw = $maxX - $minX + 1; $ch = $maxY - $minY + 1
  Write-Host "  content bbox: ${cw}x${ch} at (${minX},${minY})"

  $out = New-Object System.Drawing.Bitmap($cw, $ch)
  $g = [System.Drawing.Graphics]::FromImage($out)
  $g.DrawImage($bmp, (New-Object System.Drawing.Rectangle(0, 0, $cw, $ch)),
    (New-Object System.Drawing.Rectangle($minX, $minY, $cw, $ch)), [System.Drawing.GraphicsUnit]::Pixel)
  $g.Dispose(); $bmp.Dispose()
  $out.Save($outPath, [System.Drawing.Imaging.ImageFormat]::Png)
  $out.Dispose()
  Write-Host "  saved $outPath"
}

$root = "C:\Users\tommy\Downloads\files (1)\uilibs\public"
Trim-Logo "$root\adisa-logo-raw.png" "$root\adisa-logo.png"
Trim-Logo "$root\adisa-logo-light-raw.png" "$root\adisa-logo-light.png"
