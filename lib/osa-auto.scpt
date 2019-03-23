on run argv
	tell application "Adobe XD CC" to activate
	tell application "System Events" to tell process "XD"
		keystroke "r" using {command down, shift down}
		if (item 1 of argv is not "")
			tell menu bar 1	
				set undoItem to "Undo " & (item 1 of argv)

				try
					click menu item undoItem of menu 1 of menu bar item "Edit"
				end try
			end tell
		end if
		if (item 2 of argv is not "")
			tell menu bar 1
				click menu item (item 2 of argv) of menu 1 of menu bar item "Plugins"
			end tell
		end if
	end tell
end run