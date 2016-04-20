# Contribute

Muffin currently consists of two parts: The [Ember app](https://github.com/muffinjs/client) that runs in the user's browser and the server-side [API](https://github.com/muffinjs/server) that supplies the data and processes your website's templates and contents.

The following guideline will show you how to set up both on your local machine to be able to start contributing code. But before you do anything, please make sure that your npm permissions are [fixed](https://docs.npmjs.com/getting-started/fixing-npm-permissions).

If you just want to fix a misspelling or something equally small, simply click "Edit" (the small pencil) on the affected file and GitHub will automatically prepare a working copy for you. But if you'd like to add a new feature or make changes to the code, read along:

### Requirements

To be able to use muffin, you'll need **the latest version** of those things. So please make sure they're updated before trying out this application.

- [Bower](http://bower.io/#install-bower)
- [Ember CLI](http://ember-cli.com)
- [PhantomJS](https://www.npmjs.com/package/phantomjs-prebuilt)

### Setup

1. Make sure that the CLI is installed on your local device (it doesn't matter if you've installed it [through npm](https://www.npmjs.com/package/muffin-cli) or built it from the source using [these steps](https://github.com/muffinjs/cli#contribute))
2. Fork this repository and [the client](https://github.com/muffinjs/client) to your GitHub account and then [clone](https://guides.github.com/activities/forking/#clone) both to your device. While doing so, make sure they're both on the same directory level.
3. Move into the directory that contains the API: `cd server`
4. Link it to your global module directory: `npm link`
5. Move into the "client" repository: `cd client`
6. Install all missing dependencies: `npm intall`

That's all! :loudspeaker: :turtle:

**Important:** The above steps only make sure that all the parts of muffin are installed correctly on your system. If you want the code to be re-transpiled everytime you make changes to it, you need to run the following commands as well:

- Within the "server" directory, run `gulp`
- In the directory of the client, run `npm start`

## Usage

Firstly make sure that your database is available. On your local machine, the easiest way to start MongoDB is by running the following command:

```bash
mongod
```

After that, simply use the CLI to create a new boilerplate:

```bash
muffin new <destination-path>
```

You'll then be asked to enter a few details about your site and the database connection. After you've answered all questions, your new site will be prepared. As soon as the setup is finished, link your local version of muffin to the dependencies:

```bash
npm link muffin
```

And bang! :boom: You're now able to run the site based on your local development fork of muffin:

```bash
muffin serve -w
```
