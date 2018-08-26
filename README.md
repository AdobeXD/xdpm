# xdpm

`xdpm` is a command line tool that makes it easy to develop Adobe XD plugins. It is capable of the following tasks:

* `install`: installs one or more plugin folders into Adobe XD
* `watch`: Watches a plugin folder and reinstalls it into Adobe XD whenever the contents change
* `package`: Packages a plugin folder into an `xdx` file suitable for distribution
* `ls`: Lists plugins installed in Adobe XD.

## Install

```
npm install -g xdpm
```

## Installing a plugin

```
xdpm install                            # Install the current folder into Adobe XD
xdpm install path/to/plugin             # Install the specified folder into Adobe XD
xdpm install -m p [...folders]          # Install to Adobe XD's `plugins` folder instead of `develop`
xdpm install -m d [...folders]          # Install to Adobe XD's `develop` folder (default)
xdpm install -w r                       # Install to Adobe XD CC Release
xdpm install -w p                       # Install to Adobe XD CC Prerelease
xdpm install -w d                       # Install to Adobe XD CC Dev
xdpm install -o                         # Overwrite plugin if it exists
xdpm install -c                         # Install cleanly (remove existing)
```

You can install a plugin folder into Adobe XD using `xdpm install [...folders]`. If you don't specify a folder `xdpm install` assumes your current directory is a plugin and will install it into Adobe XD.

If the plugin folder is not a valid XD plugin, you'll receive an error upon attempting to install it. If the plugin is already installed in XD, you'll need to specify `-o` to overwrite the plugin.

## Watching a plugin

```
xdpm watch                            # Watch current folder and install changes into Adobe XD
xdpm watch path/to/plugin             # Watch the specified folder and install changes into Adobe XD
xdpm watch -w r                       # Install to Adobe XD CC Release
xdpm watch -w p                       # Install to Adobe XD CC Prerelease
xdpm watch -w d                       # Install to Adobe XD CC Dev
xdpm watch -c                         # Perform clean installs when watching
```

When developing a plugin, you can work directly in Adobe XD's `develop` folder, but this may not fit your particular workflow. In this case, you can invoke `xdpm watch` on a folder (or the current directory) and whenever changes are made, `xdpm install` will be automatically invoked to reinstall the plugins. This can simplify your development process significantly, especially if you don't use a build process.

## Packaging plugins

```
xdpm package [...folders]            # Create Adobe XD package
```

When you're finished with a plugin, you can simply zip the folder and rename the file to an `.xdx` extension. If you are using a build process, however, you may have additional files you want to exclude when building the package. `xdpm package` can perform the compression steps for you, but will also read the `.gitignore`, `.npmignore`, and a special `.xdignore` file in your plugin's folder and skip adding those to the zip file. This can allow you to easily exclude files from the final package that you distribute to others.

## Listing installed plugins

```
xdpm ls                              # List installed plugins in Adobe XD's `develop` folder
xdpm ls -m p                         # List installed plugins in Adobe XD's `plugins` folder
xdpm ls -w r                         # List installed plugins in Adobe XD's `develop` folder
xdpm ls -w p                         # List installed plugins in Adobe XD Prerelease `develop` folder
xdpm ls -w d                         # List installed plugins in Adobe XD Dev `develop` folder
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
  -m, --mode [VALUE]     Indicates which plugin mode to use (d=develop,
                         p=production). VALUE must be either [d|p]  (Default is d)
  -o, --overwrite BOOL   Allow overwriting plugins
  -w, --which [VALUE]    Which Adobe XD instance to target (r=release,
                         p=prerelease, d=dev). VALUE must be either [r|p|d]  (Default is r)
  -k, --no-color         Omit color from output
      --debug            Show debug information
  -h, --help             Display help and usage details

Commands:
  install                Install a plugin
  ls                     List all plugins
  package                Package a plugin
  watch                  Watch a plugin directory. If no directory is
                         specified, `.` is assumed
```

## LICENSE

Apache 2.0

## DISCLAIMER

You use this utility at your own risk. Under no circumstances shall Adobe be held liable for the use, misuse, or abuse of this utility.