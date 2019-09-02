# XKCD Excuse Frontend

Generate your own excuse in a nifty comic style!

-------

Go to [xkcd-excuse.com](https://xkcd-excuse.com) and go from this:

![](https://github.com/mislavcimpersak/xkcd-excuse-generator/raw/master/blank_excuse.png)

to this:

![](https://github.com/mislavcimpersak/xkcd-excuse-generator/raw/master/example.png)

using a simple form!

-----

Originaly created as an example for [Python Hrvatska meetup](https://www.meetup.com/Python-Hrvatska/events/242639630/) held on September 12, 2017 and for [Python Belgrade meetup](https://www.meetup.com/PythonBelgrade/events/243547584/) held on September 29, 2017 on which I gave [a talk](https://mislavcimpersak.github.io/serverless-talk/) on serverless technology.

-----

Error monitoring provided by [Bugsnag](https://www.bugsnag.com) ❤️

-----

This repo is the frontend part of the [xkcd-excuse.com](https://xkcd-excuse.com) project. Code for the backend part can be found in [xkcd-excuse-generator](https://github.com/mislavcimpersak/xkcd-excuse-generator) repo.

## Tech

Frontend built using [Materialize](http://materializecss.com/) and some clunky JS.

For backend tech checkout the [XKCD excuse generator](https://github.com/mislavcimpersak/xkcd-excuse-generator#tech) repo's README.

### Infrastructure

Since this is a side project that will obviously never make any money, costs should idealy be minimal. Everything is served behind CloudFlare CDN, even the API that is served from AWS Lambda through AWS API Gateway. Frontend is served on Github Pages.

![](https://github.com/mislavcimpersak/xkcd-excuse-generator/raw/master/infrastructure.png)

## Legal

### Original image

[Original image](https://xkcd.com/303/) created by Randall Munroe from XKCD.

Released under [Creative Commons Attribution-NonCommercial 2.5 License](https://creativecommons.org/licenses/by-nc/2.5/).

### Font

[XKCD-Font](https://github.com/ipython/xkcd-font) created by iPython team.

Released under [Creative Commons Attribution-NonCommercial 3.0 License](https://creativecommons.org/licenses/by-nc/3.0/).

