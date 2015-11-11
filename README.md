# WTF?!

If you ask a experienced developer what he's thinking about content management systems, he'll probably tell you that he doesn't like them since they're bloated, overkill and slow as fuck. Muffin would like to change that.

Of course it doesn't yet have those cool features which all the other cool kids on the block are showing off. But it's very ambitious and always has an open ear for feedback from all angles!

### Prerequisites

After installing [Git][1], [node.js][2] and [PhantomJS][3], you just need to execute the following command to globally install [bower][4] and the [ember-cli][5]:

```
npm install -g ember-cli bower
```

As soon as those packages are installed, you'll be able to start developing by continuing with the step below this one. But if you want to play it safe and make the process as fast as possible, you should also install [Watchman][6].

### Start developing

* `git clone` this repository
* change into the new directory
* `npm install`
* `bower install`

## Running / Development

* `ember server`
* Visit your app at [http://localhost:4200](http://localhost:4200).

### Code Generators

Make use of the many generators for code, try `ember help generate` for more details

### Running Tests

* `ember test`
* `ember test --server`

### Building

* `ember build` (development)
* `ember build --environment production` (production)



[1]: http://git-scm.com/
[2]: http://nodejs.org/
[3]: http://phantomjs.org/
[4]: http://bower.io
[5]: http://www.ember-cli.com
[6]: https://facebook.github.io/watchman/docs/install.html
