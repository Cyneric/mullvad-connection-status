# Release Guide

This document explains how to create a new release with automated builds.

## Automated Releases via GitHub Actions

The project uses GitHub Actions to automatically build and publish Windows installers.

### Prerequisites

1. Push your code to GitHub
2. Ensure all changes are committed and pushed to the `main` branch
3. Make sure the build is passing (check Actions tab)

### Creating a Release

#### Method 1: Tag-based Release (Recommended)

1. **Update the version in `package.json`:**
   ```bash
   npm version patch  # for 0.1.0 -> 0.1.1
   npm version minor  # for 0.1.0 -> 0.2.0
   npm version major  # for 0.1.0 -> 1.0.0
   ```

2. **Push the tag to GitHub:**
   ```bash
   git push origin main --tags
   ```

3. **GitHub Actions will automatically:**
   - Build the Windows installer
   - Create a draft release
   - Upload the installer as a release asset
   - Publish the release

4. **Edit the release notes** (optional):
   - Go to GitHub Releases
   - Edit the auto-generated release
   - Add detailed changelog or screenshots

#### Method 2: Manual Workflow Trigger

1. Go to your GitHub repository
2. Click **Actions** tab
3. Select **Release Build** workflow
4. Click **Run workflow**
5. Select the branch (usually `main`)
6. Click **Run workflow** button

### What Gets Built

The automated workflow creates:
- `Mullvad-Connection-Status_x.x.x_x64-setup.exe` - NSIS installer for Windows
- `Mullvad-Connection-Status_x.x.x_x64.msi` - MSI installer for Windows

### Version Management

Version is controlled in two places (keep them in sync):
- `package.json` - Node.js version
- `src-tauri/Cargo.toml` - Rust/Tauri version
- `src-tauri/tauri.conf.json` - Tauri configuration version

Use `npm version` which automatically updates `package.json`. Then manually update the other files if needed.

### Release Checklist

Before creating a release:

- [ ] All features tested locally
- [ ] Version bumped in `package.json`
- [ ] `CLAUDE.md` updated with any significant changes
- [ ] Committed and pushed all changes
- [ ] Tagged the release
- [ ] GitHub Actions build succeeded
- [ ] Tested the installer on a clean Windows machine
- [ ] Updated release notes on GitHub

## Manual Release Build (Without GitHub)

If you want to build locally without GitHub Actions:

```bash
# Build the application
npm run tauri build

# Find the installer in:
# src-tauri/target/release/bundle/nsis/Mullvad-Connection-Status_x.x.x_x64-setup.exe
# src-tauri/target/release/bundle/msi/Mullvad-Connection-Status_x.x.x_x64.msi
```

## Troubleshooting Releases

### Build fails in GitHub Actions

- Check the Actions tab for error logs
- Common issues:
  - Missing icon files
  - TypeScript compilation errors
  - Rust compilation errors
- Fix locally, commit, and push again

### Installer doesn't work

- Make sure WebView2 Runtime is installed on target machine
- Check that all icon files are present in `src-tauri/icons/`
- Verify the build completed successfully in Actions

### Release not appearing

- Check that the tag was pushed: `git push --tags`
- Verify GitHub Actions has permissions to create releases
- Look at Actions tab for any errors
