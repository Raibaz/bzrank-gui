BZRANK-GUI
==========

A web application to visualize the [BZFlag](http://bzflag.org) stats as stored by [bzrank-feeder](https://github.com/Raibaz/bzrank-feeder).

![Screenshot](http://i.imgur.com/9gsNzXV.png)

This implementation works with a MongoDB behind a [Sleepy Mongoose](https://github.com/10gen-labs/sleepy.mongoose), and currently displays the following charts:

* Kills made
* Kills received
* Shots attempted
* Shot efficiency (Kills/shots)
* Flag efficiency (Kills percentage for each flag)
* Best nemeses (times the same player killed the same victim)
* Most picked up useful flags, to detect if any player is luckier than others
* Games played


All of the charts can show data for the last game played, for all the games logged as an aggregate, or weighted for the number of games each player has played.

Known issues
------------
The weighting on the number of games played is not very accurate, as it counts the number of `playerjoin` events instead of the actual number of games a user has played; thus, if a user leaves a game and then rejoins it, it will be counted as two games played, possibly biasing his/her stats.
