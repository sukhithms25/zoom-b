# Zoom-b

0:00
most fullstack developers are missing
0:01
out on one of the best compute platforms
0:03
available over the past 5 years I've
0:05
used several hosting providers Heroku
0:07
back when it had a free tier vulture and
0:09
digital ocean for deploying go services
0:11
on bps's too many AWS products while
0:14
working in big Tech and versel for free
0:16
nextjs hosting each of these providers
0:18
have their own pros and cons and there's
0:20
always a challenge of finding a compute
0:21
Solution that's affordable to start
0:23
offers a good developer experience and
0:25
can scale as your project grows Cloud
0:27
flare wasn't even on my radar until
0:29
recently I didn't even realize they
0:31
offered compute Solutions but it turns
0:33
out Cloud flare has a full ecosystem of
0:35
compute and data services that can
0:37
handle millions of requests a month for
0:39
free even without needing to pull out a
0:40
credit card and to be clear when I say
0:43
handle millions of requests I'm not
0:44
referring to Cloud flares proy or CDN
0:46
Services I literally mean you can ship
0:48
actual server side code to Cloud flare
0:50
and it runs on serverless functions for
0:52
free so to better understand how you can
Creating a nextjs project
0:54
use cloud Flare's compute offerings
0:56
let's go through the process of creating
0:58
a fake nextjs project let's say you're
1:00
building a next app that allows users to
1:02
summarize and analyze Zoom calls with
1:03
generative AI you get started by
1:05
creating a git repo you run the mpm
1:07
create Pages command for nextjs you say
1:10
that you want it deployed and there you
1:11
go you now have a site that's hosted now
1:14
you make some changes you push those
1:16
changes to a branch and you can see a
1:18
preview deployment is triggered you
1:19
check this deployment to make sure all
1:21
the changes are good you merge your
1:22
changes to master and now your changes
1:25
are live so now that you have an nextjs
1:27
project that's hosted you'll want to add
1:28
your own domain name you add your domain
1:30
name to cloudflare you link it to your
1:32
next app running on pages and there you
1:34
go you now have a next app with a cicd
1:37
pipeline extremely fast serverless
1:39
hosting and a domain name with SSL and
1:41
you haven't even pulled out a credit
1:43
card so at this point you might be
1:45
thinking okay cool but other services
1:47
offer free tier of serverless compute
1:49
and free DNS why would I choose cloudfl
1:51
over something like for sale from the
1:53
looks of it for sale is actually a bit
1:54
easier to set up I'd answer that by
1:56
saying the features we've just walked
1:57
through are just the icing on the cake
1:59
to a cloud FL offers so let's keep
2:01
building this project to learn
2:03
more you've now started the process of
2:05
trying to integrate a database into your
2:07
project you can use any of the popular
2:08
database offerings in your cloudflare
2:10
app or you could simply use cloud flares
2:12
out of the box D1 SQL database which is
2:15
a blazingly fast competitor to torso and
2:17
integrates seamlessly within your
2:18
cloudflare workers just create a
2:20
database bind it to your application
2:23
place it in your favorite orm and now
2:25
you have a performant scalable database
2:26
to support all your users CR operations
Adding object storage
2:29
now that you have a database you'll need
2:31
to pick a good object storage solution
2:33
to store all call recordings and
2:35
transcripts Amazon S3 is the big player
2:38
in this space so you could just
2:39
integrate with S3 but lucky for you
2:41
Cloud flare offers an S3 compatible
2:43
object storage solution called R2 all
2:45
you have to do is create a bucket bind
2:47
it to your application and now your
2:49
application has object storage with a
2:51
generous free tier and actually has
2:53
better pricing than AWS for the pay
2:55
tiers so now let's get to the meat of
2:57
your application you want your
caching
2:59
application to be installed via the zoom
3:01
Marketplace and zoom requires you to
3:02
implement ooth in your application as
3:04
your user base is growing you are
3:06
constantly having to reach out to zoom's
3:07
API to get valid client credentials so
3:10
you decide you want to temporarily store
3:11
the credentials to reduce the number of
3:13
requests made to zoom you want to
3:15
implement a cashing solution with a
3:16
total time to live on each cash entry
3:19
you typically would reach for redus for
3:20
this use case but then you realize that
3:22
cloud FL offers a key Value Store for
3:24
free you create a namespace buy it to
3:26
your application and within minutes you
3:28
have a caching solution tion that
3:30
supports TTL and you still haven't even
3:32
pulled out a credit card so let's talk
3:34
about your open a integration you build
3:36
this next app pretty quickly and you now
AI Gateway
3:38
realize that some users are able to spam
3:40
your service and rack up a pretty hefty
3:42
open AI bill you decide you are going to
3:44
build anti-spam logic and build out a
3:46
better building system but to buy
3:47
yourself some time you create a cloud
3:49
flare AI Gateway swap out the open AI
3:51
URL with your AI Gateway URL turn on
3:54
rate limiting and you temporarily stop
3:57
the bleeding on your AI spend after
3:59
fixing your issue with user spam you
4:00
decide you're going to keep the AI
4:01
Gateway as it started to provide awesome
4:03
insights into your AI usage and
4:05
performance and has also helped you
4:07
improve your Proms and now your
4:08
application is even better your user
4:10
base grows and you're starting to get
4:12
more feature requests your users really
4:14
want a feature where they can ask a
4:15
chatbot to search through all their
4:17
transcripts so you start implementing
4:19
basic retrieval augmented generation
4:21
better known as rag for this solution
4:23
you need to create Vector embeddings of
4:24
each transcript and store them in some
4:26
Vector database after doing some
4:28
research you real realiz that Vector
4:30
databases are surprisingly expensive you
4:32
are considering using pine cone as it is
4:34
super popular and has a free tier but
4:36
then you come across Cloud Flare's
4:38
Vector database solution and realize it
4:39
has all the features you need has a
4:41
generous free tier and is cheaper than
4:43
all the other competitors you researched
4:45
so you create a vector index bind it to
4:47
your application and Implement rag so
Recap
4:50
let's just recap really quick you have a
4:52
nextjs service with fast serverless
4:54
compute reachable behind your own SSL
4:57
protected domain name with a database
4:59
object storage external TTL caching an
5:02
AI Gateway a vector database and you
5:05
still haven't even pulled out a credit
5:06
card so by now I hope you're thinking
5:09
yeah Cloud flare is pretty cool I'd
5:10
probably use it for my next project but
5:12
what if I told you at this point we
5:14
still haven't even gotten to my favorite
5:15
features so let's keep building this AI
5:17
transcript tool so at this point your
Improving API routes
5:20
next app is serving a thousand users
5:21
you're making pretty good money and you
5:23
decide that you want to turn your side
5:25
project into a hardened production app
5:27
you upgrade from the free tier to the
5:28
paid tier would a w being $5 a month and
5:31
now you unlock more services with so
5:33
many users you realize that some of your
5:35
API routes need to be improved you have
5:37
a route called process transcript ID
5:39
which takes a zoom call ID fetches a
5:41
zoom recording saves it in R2 object
5:43
storage passes the saved recording link
5:46
to assembly AI to be transcribed waits
5:48
for the transcription saves the
5:50
transcript passes the transcript to open
5:52
AI to be summarized and finally returns
5:55
the summary and the transcript to the
5:57
user this is way too much logic and
6:00
worse yet some users are becoming
6:01
impatient and closing the tap during
6:03
this process as a result your serverless
6:06
functions cancel the request right after
6:08
you submit the transcript to assembly AI
6:10
this causes you to pay for
6:11
transcriptions that you are not able to
6:13
save now that you are on the $5 worker
6:15
tier you are able to create cues so you
6:18
decide to spin up a new worker to act as
6:19
a que processing service you create a
6:22
queue and bind it to your new worker and
6:24
your next
Faster backend features
6:25
application your process transcript ID
6:27
route now simply submits a call ID to a
6:29
q and tells the client to pull the next
6:31
API for updates in the background your
6:34
queue processing service is working away
6:36
as it collects and saves call recordings
6:38
submits transcription requests to
6:40
assembly AI uses open AI to summarize
6:43
and save transcripts and updates your
6:45
database when each of these tasks
6:47
complete now that you have implemented
6:49
Clare cues you realize that you able to
6:51
build new backend features faster as
6:53
there's clear separation from the data
6:55
processing layer of your service and
6:56
your next app you also realize that you
6:58
are able to more easily scale your
7:00
service with your growing user base so
Realtime AI usage
7:02
let's say your service now has 100,000
7:04
active users and you want to build an
7:07
even more robust solution where users
7:09
are able to monitor their AI usage in
7:11
real time so whenever your Q worker
7:13
finishes processing an open AI request
7:15
it sends the token usage stats back to
7:18
your queue the token data then gets
7:20
processed and stored in Cloud Flare's
7:22
analytic solution which allows for
7:24
blazingly fast time series based queries
7:26
you are now able to provide users with
7:28
near realtime visualization of their
7:30
personal usage metrics after a few more
Hyperdrive
7:33
years your service grows to a million
7:34
active users and you decide you need a
7:36
database Solution that's more
7:38
sophisticated than cloudflare's D1
7:40
database but historically speaking
7:42
serverless applications can run into a
7:43
cold start problem when a new serverless
7:45
function container is spun up for the
7:47
first time which makes client requests
7:49
take longer than expected the cold start
7:51
problem is compounded when your
7:53
serverless function container has to
7:54
create and maintain a connection pool
7:56
with your database cloudflare solved
7:58
this issue with a product called
8:00
hyperdrive hyperdrive creates lasting
8:02
connection pools with your database
8:03
across their entire Global server
8:05
Network this way all your worker has to
8:07
do is proxy request through hyperdrive
8:09
and bypasses the need to spend time
8:11
creating and maintaining connection
8:12
pools with your database at this point
Why Cloudflare
8:15
you're probably thinking man this guy's
8:16
really Shilling for cloud flare there
8:18
must be reasons to not choose Cloud
8:19
flare as my compute provider and I'll
8:21
admit there are very valid downsides to
8:23
useing Cloud Flare's compute offerings
8:24
which I'll talk about but the reason why
8:26
I'm so excited about Cloud flare as a
8:28
compute platform is because I have
8:30
finally found a hosting platform that
8:31
allows Indie hackers to build and deploy
8:33
services for free while at the same time
8:35
the compute ecosystem can support truly
8:38
Production Services cloudflare feels
8:40
like a happy middle ground between
8:41
services like forell or netfi and AWS
8:44
and Azure you get the ease of
8:46
development and deployment comparable to
8:48
forell but you aren't reaching for
8:50
several different managed services for
8:51
your database object storage cach and
8:54
message system while at the same time
8:56
you have all the compute offerings you
8:58
need to build an advanced system but you
9:00
aren't overwhelmed in the same way as
9:02
AWS where each compute solution has
9:04
several competing Solutions and you have
9:06
a hard time figuring out how to even get
9:08
started these are the reasons why I'm
Vendor lockin
9:10
excited by Cloud flare but now let's
9:13
talk about the glaring downsides the
9:14
first core downside to using cloudflare
9:16
is vendor lockin all of cloudflare's
9:19
products work really well together
9:20
largely due to how you are able to bind
9:22
Solutions together since the bindings
9:24
are accessible in the context of the
9:26
service request this heavily influences
9:28
the structure of your code now it is
9:30
possible to design your service around
9:32
vendor lockin making it easy to change
9:34
providers in the future but when working
9:36
in an ecosystem that allows you to build
9:38
so quickly you will likely lean into the
9:40
design patterns that work well with
9:41
cloudflare and this will make moving to
9:43
another provider in the future very
9:45
challenging that being said cloudflare's
9:47
compute pricing is very transparent and
9:49
is almost always cheaper than other
9:50
Cloud providers this makes the vendor
9:53
lock and risk worthwhile for me the
Language support
9:55
other core downside is language support
9:57
cloudflare has engineered their own
9:58
worker runtime that runs on VA isolates
10:00
and is utilized across their Edge
10:02
Network this allows cloudflare to manage
10:04
requests with virtually no cold starts
10:06
the downside of the VA engine is that it
10:08
really is only a runtime for JavaScript
10:10
and web assembly based projects so if
10:12
you're committed to using JavaScript or
10:14
typescript VA isolates will only benefit
10:16
your service but if you're Building
10:17
Solutions in languages like go or C++
10:19
you'll have to compile your code to web
10:21
assembly for it to work on cloudflare
10:22
workers this process can be very painful
10:25
and using cloudflare service bindings
10:26
goes from a delightful developer
10:28
experience to Pure frustration very
10:30
quickly for these reasons if you're set
10:32
on building a service in a language
10:33
other than typescript or JavaScript
10:35
Clare would not be a good choice for you
10:37
now cloudfare workers do offer support
10:38
for rust and python but I've not gone
10:40
through the process of shipping a rust
10:42
or python project to cloudflare workers
10:44
so I wouldn't recommend that solution
10:45
just yet that being said if you're a
10:47
fullstack engineer trying to get your
10:49
idea off the ground a freelancer
10:51
building solutions for clients or even a
10:53
midsize company that wants to ship
10:54
features fast I strongly recommend the
10:56
cloud flare stack now this video is one
10:58
of the first I want to create around the
11:00
topic of cloudflare I plan on creating a
11:02
series of howto videos talking about
11:04
building and deploying to cloudflare so
11:06
if there are any Frameworks or project
11:07
ideas you want to see build and deployed
11:10
please let me know in the comments