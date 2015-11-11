# What? Another CMS?

If you ask a experienced developer what he's thinking about content management systems, he'll probably tell you that he doesn't like them since they're bloated, overkill and slow as fuck. Muffin would like to change that.

Of course it doesn't yet have those cool features which all the other cool kids on the block are showing off. But it's very ambitious and always has an open ear for feedback from all angles!

## Prerequisites

After installing [Git][1], [node.js][2] and [PhantomJS][3], you just need to execute the following command to globally install [bower][4] and the [ember-cli][5]:

```
npm install -g ember-cli bower
```

As soon as those packages are installed, you'll be able to start developing by continuing with the step below this one. But if you want to play it safe and make the process as fast as possible, you should also install [Watchman][6].

## Setup

* Clone this repository: `git clone https://github.com/leo/muffin.git`
* Change into the new directory
* Run `npm install && bower install` to install all dependencies

## Start developing

* `ember server`
* Muffin will be running here: [http://localhost:4200/admin](http://localhost:4200/admin).

Dont forget to make use of the many generators for code, try `ember help generate` for more details.

### Testing

* `ember test`
* `ember test --server`

[1]: http://git-scm.com/
[2]: http://nodejs.org/
[3]: http://phantomjs.org/
[4]: http://bower.io
[5]: http://www.ember-cli.com
[6]: https://facebook.github.io/watchman/docs/install.html
