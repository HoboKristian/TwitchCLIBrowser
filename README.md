Twitch CLI Browser
================

Twitch CLI Browser is a CLI interface for http://www.twitch.tv. It currently supports browsing top 25 games and featured games which should cover most use cases.

How to install
-------------

### Install
>* Required
	* Install node
		* Brew install node
		* Tested with v5.5.0+
	* Clone the repository
	* npm install
	* Install mpv
		* Needed for video support
		* brew install mpv
		* Tested with v0.14.0+
### Run
> `node --harmony_default_parameters index.js`

TODO
-------

> - Add paging to support more games/streams.
> - Support other video programs than MPV (VLC for instance).
> - Test and support windows.

Known issues
----------------

>- child_process.exec is not protected and a malicious stream name can be used to execute code.
>- Needs --harmony* to run on Node.
