<p align="center">
  <a href="http://muffin.cafe">
    <img src="http://i.imgur.com/buhMCWz.png" width="170">
  </a>
</p>

# muffin

If you ask a experienced developer what he's thinking about content management systems, he'll probably tell you that he doesn't like them since they're bloated, overkill and slow as fuck. Muffin would like to change that.

Of course it doesn't yet have those cool features which all the other cool kids on the block are showing off, but it's very ambitious and always has an open ear for feedback from all angles!

## Requirements

To be able to use muffin, you'll need **the latest version** of those things. So please make sure they're updated before trying out this application. After installing node.js, please also make sure to [fix your npm permissions](https://docs.npmjs.com/getting-started/fixing-npm-permissions).

- [Node.js](https://nodejs.org/en/)
- [MongoDB](https://www.mongodb.org)
- [Yeoman](http://yeoman.io) and [Muffin's generator](https://www.npmjs.com/package/generator-muffin)

## Use me

Please note that muffin isn't stable yet, so the commands below won't do you much. If you want to take a look at muffin in its current state, you need to read [this](https://github.com/small-cake/server/blob/master/CONTRIBUTING.md).

---

Please firstly make sure that your database is available. On your local machine, the easiest way to start MongoDB is by running the following command:

```bash
mongod
```

After that, simply use our neat Yeoman generator (which you've already installed previously) to generate a new boilerplate within the current directory:

```bash
yo muffin
```

You'll then be asked to enter a few details about your site and the database connection. After you've answered all questions, your new site will be prepared. As soon as the setup is finished, use the following command to run muffin:

```bash
npm start
```

That's all! :loudspeaker: :turtle:

## Contribute

To help us with development, please read [this](CONTRIBUTING.md).
