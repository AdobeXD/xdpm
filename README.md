# xdpm
Adobe XD Plugin Manager Command Line Tool (for developers)

## Usage

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
      --template STRING  Use this template when creating a plugin scaffold
  -w, --which [VALUE]    Which Adobe XD instance to target (r=release,
                         p=prerelease, d=dev). VALUE must be either [r|p|d]  (Default is r)
  -k, --no-color         Omit color from output
      --debug            Show debug information
  -h, --help             Display help and usage details

Commands:
  init                   Initialize a plugin scaffold, using an optional
                         template
  install                Install a plugin
  ls                     List all plugins
  package                Package a plugin
  watch                  Watch a plugin directory. If no directory is
                         specified, `.` is assumed
```

## LICENSE

MIT.