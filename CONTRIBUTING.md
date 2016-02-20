# Contribute

The application currently consists of two parts: The [kit](https://github.com/small-cake/generator) and the [core system](https://github.com/small-cake/app). The following guideline will show you how to set up both on your local machine to be able to start contributing code.

If you just want to fix a misspelling or something equally small, you can also just click "Edit" (the small pencil) on the affected file and GitHub will automatically prepare a working copy for you.

Okay, then let's go on. Firstly, make sure that you've forked and cloned the core system:

```shell
git clone git://github.com/small-cake/app.git
cd app
```

After that, link it to the global module directory on your device (this will also automatically install all dependencies):

```shell
npm link
```

Now we need to set up the generator (kit). To do this, firstly uninstall it:

```shell
npm uninstall -g generator-muffin
```

After it's gone, fork and clone it again from GitHub:

```shell
git clone git://github.com/small-cake/generator.git
cd generator
```

And link it to the global module directory, too:

```shell
npm link
```

---

Awesome! Now you can use the `yo muffin` command to generate a new boilerplate whereever you want. Within the generated directory, the only thing you need to do now is link your local working copy of muffin to the dependencies:

```shell
npm link muffin
```

Boom! You're done. Now feel free to start run muffin:

```shell
npm start
```
