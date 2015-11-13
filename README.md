# What? Another CMS?

If you ask a experienced developer what he's thinking about content management systems, he'll probably tell you that he doesn't like them since they're bloated, overkill and slow as fuck. Muffin would like to change that.

Of course it doesn't yet have those cool features which all the other cool kids on the block are showing off. But it's very ambitious and always has an open ear for feedback from all angles!

## Use me

If you'd like to use muffin for your next project, simply install our neat command line interface and generate a new boilerplate within the current directory.

```bash
$ npm install -g muffin-cli
$ muffin init
```

## Develop me

Clone this repo

```bash
$ git clone git://github.com/leo/muffin.git
$ cd muffin
```

Setup muffin's task manager

```bash
$ npm install -g gulp
```

Install all other dependencies and build the assets

```bash
$ gulp 
```

### Start developing

You've made it! Now you only need to start the app and it will be running here: [http://localhost:4200/admin/](http://localhost:4200/admin/).

```bash
$ npm start
```

Dont forget to make use of the many generators for the development within `/client` and try `ember help generate` for more details. If you want to test your code, simply use `ember test` and `ember test --server`.
