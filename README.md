# xdpm

`xdpm` is a command line tool that makes it easy to develop Adobe XD plugins. It is capable of the following tasks:

* `bootstrap`: Creates a new plugin scaffold: headless, panel, react, modal. Optionally specify the name for your new plugin's directory.
* `install`: copies one or more plugins in a develoment folder into Adobe XD's develop folder
* `watch`: Watches a plugin folder and copies it into Adobe XD whenever the contents change
* `validate`: Validates a plugin's manifest to ensure that it will be accepted by XD.
* `package`: Packages a plugin folder into an `xdx` file suitable for distribution
* `ls`: Lists plugins installed in Adobe XD in development mode.

## Install

```
npm install -g @adobe/xdpm
```

If you've cloned the repository:

```
npm install
npm link
```

## Bootstrapping a plugin

any of the following:

```
$ xdpm bootstrap
$ xdpm bootstrap panel
$ xdpm bootstrap panel my-panel
```

Plugin type options:

- headless (default)
- panel
- modal
- react

## Installing a plugin

```
xdpm install                            # Install the current folder into Adobe XD
xdpm install path/to/plugin             # Install the specified folder into Adobe XD
xdpm install -w release                 # Install to Adobe XD CC Release (`r` is also valid; default)
xdpm install -w prerelease              # Install to Adobe XD CC Prerelease (`p` is also valid)
xdpm install -o                         # Overwrite plugin if it exists
xdpm install -c                         # Install cleanly (remove existing)
```

You can install a plugin folder into Adobe XD using `xdpm install [...folders]`. If you don't specify a folder `xdpm install` assumes your current directory is a plugin and will install it into Adobe XD.

If the plugin folder is not a valid XD plugin, you'll receive an error upon attempting to install it. If the plugin is already installed in XD, you'll need to specify `-o` to overwrite the plugin.

## Watching a plugin

```
xdpm watch                            # Watch current folder and install changes into Adobe XD
xdpm watch path/to/plugin             # Watch the specified folder and install changes into Adobe XD
xdpm watch -w release                 # Install to Adobe XD CC Release (`r` is also valid; default)
xdpm watch -w prerelease              # Install to Adobe XD CC Prerelease (`p` is also valid)
xdpm watch -c                         # Perform clean installs when watching
```

When developing a plugin, you can work directly in Adobe XD's `develop` folder, but this may not fit your particular workflow. In this case, you can invoke `xdpm watch` on a folder (or the current directory) and whenever changes are made, `xdpm install` will be automatically invoked to reinstall the plugins. This can simplify your development process significantly, especially if you don't use a build process.

## Validating plugin manifests

```
xdpm validate [...folders]           # Validate the manifests in the list of folders
```

You can validate that a manifest is correct using this command. Any errors found will be listed; otherwise the report will be that the plugin validated successfully.

## Packaging plugins

```
xdpm package [...folders]            # Create Adobe XD package
```

When you're finished with a plugin, you can simply zip the folder and rename the file to an `.xdx` extension. If you are using a build process, however, you may have additional files you want to exclude when building the package. `xdpm package` can perform the compression steps for you, but will also read the `.gitignore`, `.npmignore`, and a special `.xdignore` file in your plugin's folder and skip adding those to the zip file. This can allow you to easily exclude files from the final package that you distribute to others.

> **NOTE**: Plugins that fail validation will not be packaged.

## Listing installed plugins

```
xdpm ls                              # List installed plugins in Adobe XD's `develop` folder
xdpm ls -w release                   # List installed plugins in Adobe XD's `develop` folder (default)
xdpm ls -w prerelease                # List installed plugins in Adobe XD Prerelease `develop` folder
```

You can install plugins that are currently installed in Adobe XD using `ls`.

## Help

```
Usage:
  xdpm [OPTIONS] <command> [ARGS]

Options:
  -c, --clean BOOL       Clean before install
  -j, --json BOOL        If true, indicates that JSON output should be
                         generated
  -o, --overwrite BOOL   Allow overwriting plugins
  -w, --which [VALUE]    Which Adobe XD instance to target. VALUE must be
                         either
                         [r|p|d|release|pre|prerelease|dev|development]  (Default is r)
  -k, --no-color         Omit color from output
      --debug            Show debug information
  -h, --help             Display help and usage details

Commands:
  install                Install a plugin in development mode
  ls                     List all plugins in development mode
  package                Package a plugin
  validate               Validate a plugin's manifest
  watch                  Watch a plugin directory. If no directory is
                         specified, `.` is assumed
```

## LICENSE

Apache 2.0

## DISCLAIMER

You use this utility at your own risk. Under no circumstances shall Adobe be held liable for the use, misuse, or abuse of this utility.

Use of this utility means that you agree to Adobe's [Terms of Use](https://www.adobe.com/legal/terms.html) and the [Adobe Developer Additional Terms](https://wwwimages2.adobe.com/content/dam/acom/en/legal/servicetou/Adobe-Developer-Additional-Terms_en_US_20180605_2200.pdf).