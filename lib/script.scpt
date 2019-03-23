on run argv
	tell application "Adobe XD CC" to activate
	tell application "System Events" to tell process "XD"
		keystroke "r" using {command down, shift down}
		tell menu bar 1
			click menu item (item 1 of argv) of menu 1 of menu bar item "Plugins"
		end tell
	end tell
end run